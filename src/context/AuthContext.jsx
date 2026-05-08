import { useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
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

    const newUserData = {
      uid: credential.user.uid,
      name,
      email,
      points: 0,
      badges: [],
      completedModules: [],
      certificates: [],
      role: 'user',
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        try {
          const userSnapshot = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userSnapshot.exists()) {
            setUser(normalizeUserData(userSnapshot.data()));
          } else {
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
        } catch (error) {
          if (!isPermissionDeniedError(error)) {
            throw error;
          }
          console.warn('Firestore read denied on auth state change. Using auth-only profile.');
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
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = useMemo(() => ({
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: !!user?.isAdmin,
    isSuperAdmin: !!user?.isSuperAdmin,
    canAccessAdminPanel: !!user?.canAccessAdminPanel,
    loading
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};