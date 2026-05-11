import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const ensureAdminApp = () => {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID?.trim().replace(/^"|"$/g, '');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim().replace(/^"|"$/g, '');
  let privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim().replace(/^"|"$/g, '');

  if (privateKey) {
    // Pastikan newline terformat dengan benar
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase Admin env belum lengkap. Isi FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY.');
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey
    })
  });
};

export const getAdminAuth = () => getAuth(ensureAdminApp());
export const getAdminDb = () => getFirestore(ensureAdminApp());
