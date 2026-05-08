import { getAdminAuth, getAdminDb } from './_firebaseAdmin.js';

const superAdminEmails = (process.env.SUPER_ADMIN_EMAILS || '')
  .split(',')
  .map((item) => item.trim().toLowerCase())
  .filter(Boolean);

const getTokenFromHeader = (authorizationHeader = '') => {
  if (!authorizationHeader.toLowerCase().startsWith('bearer ')) {
    return '';
  }

  return authorizationHeader.slice(7).trim();
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method tidak diizinkan.' });
  }

  try {
    const auth = getAdminAuth();
    const db = getAdminDb();

    const idToken = getTokenFromHeader(req.headers.authorization || '');
    if (!idToken) {
      return res.status(401).json({ error: 'Token admin tidak ditemukan.' });
    }

    const decodedToken = await auth.verifyIdToken(idToken);
    const requesterEmail = (decodedToken.email || '').toLowerCase();

    const requesterDoc = await db.collection('users').doc(decodedToken.uid).get();
    const requesterRole = requesterDoc.exists ? requesterDoc.data()?.role : 'user';

    const isSuperAdmin = requesterRole === 'admin' || superAdminEmails.includes(requesterEmail);

    if (!isSuperAdmin) {
      return res.status(403).json({ error: 'Hanya admin utama yang boleh reset password.' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const targetEmail = body?.targetEmail?.trim();
    const newPassword = body?.newPassword?.trim();

    if (!targetEmail || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'Email dan password baru minimal 8 karakter wajib diisi.' });
    }

    const targetUser = await auth.getUserByEmail(targetEmail);
    await auth.updateUser(targetUser.uid, { password: newPassword });

    return res.status(200).json({ message: 'Password user berhasil diperbarui.' });
  } catch (error) {
    return res.status(500).json({ error: error?.message || 'Gagal reset password user.' });
  }
}
