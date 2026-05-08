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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const userDocRef = doc(db, 'users', credential.user.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      return userSnapshot.data();
    }

    const fallbackUser = {
      uid: credential.user.uid,
      name: credential.user.displayName || email.split('@')[0],
      email: credential.user.email,
      points: 0,
      badges: [],
      completedModules: [],
      certificates: []
    };

    await setDoc(userDocRef, {
      ...fallbackUser,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return fallbackUser;
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
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, 'users', credential.user.uid), newUserData);

    return newUserData;
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
        const userSnapshot = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userSnapshot.exists()) {
          setUser(userSnapshot.data());
        } else {
          setUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Peserta',
            email: firebaseUser.email,
            points: 0,
            badges: [],
            completedModules: [],
            certificates: []
          });
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
    loading
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};