import { useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { AuthContext } from './authContextObject';
import { auth, db } from '../config/firebase';

const isPermissionDeniedError = (error) => {
  const code = error?.code || '';
  return code.includes('permission-denied') || code.includes('missing-or-insufficient-permissions');
};

const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((item) => item.trim().toLowerCase())
  .filter(Boolean);

const assistantAdminEmails = (import.meta.env.VITE_ASSISTANT_ADMIN_EMAILS || '')
  .split(',')
  .map((item) => item.trim().toLowerCase())
  .filter(Boolean);

const normalizeUserData = (userData = {}) => {
  const active = userData.active !== false;
  const email = userData.email || '';
  const emailLower = email.toLowerCase();

  let role = userData.role || 'user';

  if (adminEmails.includes(emailLower)) {
    role = 'admin';
  } else if (assistantAdminEmails.includes(emailLower) && role === 'user') {
    role = 'assistant_admin';
  }

  const isSuperAdmin = role === 'admin';
  const canAccessAdminPanel = isSuperAdmin || role === 'assistant_admin';

  return {
    ...userData,
    role,
    active,
    isAdmin: canAccessAdminPanel,
    isSuperAdmin,
    canAccessAdminPanel
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const userDocRef = doc(db, 'users', credential.user.uid);

    try {
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const existingUser = normalizeUserData(userSnapshot.data());

        if (!existingUser.active) {
          await signOut(auth);
          throw new Error('ACCOUNT_DISABLED');
        }

        return existingUser;
      }
    } catch (error) {
      if (!isPermissionDeniedError(error)) {
        throw error;
      }
      console.warn('Firestore read denied during login. Using fallback profile from auth only.');
    }

    const fallbackUser = {
      uid: credential.user.uid,
      name: credential.user.displayName || email.split('@')[0],
      email: credential.user.email,
      points: 0,
      badges: [],
      completedModules: [],
      certificates: [],
      role: 'user',
      active: true
    };

    try {
      await setDoc(userDocRef, {
        ...fallbackUser,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      if (!isPermissionDeniedError(error)) {
        throw error;
      }
      console.warn('Firestore write denied during login fallback profile creation.');
    }

    return normalizeUserData(fallbackUser);
  };

  const register = async ({ name, email, password }) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const emailLower = email.toLowerCase();

    let role = 'user';
    if (adminEmails.includes(emailLower)) {
      role = 'admin';
    } else if (assistantAdminEmails.includes(emailLower)) {
      role = 'assistant_admin';
    }

    const newUserData = {
      uid: credential.user.uid,
      name,
      email,
      points: 0,
      badges: [],
      completedModules: [],
      certificates: [],
      role,
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'users', credential.user.uid), newUserData);
    } catch (error) {
      if (!isPermissionDeniedError(error)) {
        throw error;
      }
      console.warn('Firestore write denied during registration. Account created in Auth with local fallback profile.');
    }

    return normalizeUserData(newUserData);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    let unsubscribeSnapshot = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      // Clean up previous snapshot listener if any
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Start Realtime Listener for User Document
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      
      unsubscribeSnapshot = onSnapshot(userDocRef, (snapshot) => {
        if (snapshot.exists()) {
          setUser(normalizeUserData(snapshot.data()));
        } else {
          // Fallback for user without a document yet
          setUser(normalizeUserData({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Peserta',
            email: firebaseUser.email,
            points: 0,
            badges: [],
            completedModules: [],
            certificates: [],
            role: 'user',
            active: true
          }));
        }
        setLoading(false);
      }, (error) => {
        if (!isPermissionDeniedError(error)) {
          console.error('Error in user snapshot:', error);
        } else {
          console.warn('Firestore read denied on snapshot. Using fallback profile.');
        }
        
        // Final fallback if snapshot fails due to permissions
        setUser(normalizeUserData({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Peserta',
          email: firebaseUser.email,
          role: 'user',
          active: true
        }));
        setLoading(false);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const refreshUser = async () => {
    // With onSnapshot, refreshUser is redundant but kept for compatibility
    if (!auth.currentUser) return;
  };

  const value = useMemo(() => ({
    user,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    isAdmin: !!user?.isAdmin,
    isSuperAdmin: !!user?.isSuperAdmin,
    canAccessAdminPanel: !!user?.canAccessAdminPanel,
    loading
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};