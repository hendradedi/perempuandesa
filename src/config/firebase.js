import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyARNZB_0NULar-2uxuuti1IOW9d0VmSSZU',
  authDomain: 'perempuandesa-5ab24.firebaseapp.com',
  projectId: 'perempuandesa-5ab24',
  storageBucket: 'perempuandesa-5ab24.firebasestorage.app',
  messagingSenderId: '8995037957',
  appId: '1:8995037957:web:5fa859084d2fc2d8f90d6c'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;