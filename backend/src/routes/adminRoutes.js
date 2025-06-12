// backend/src/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
// Pastikan jalur ke authMiddleware.js sudah benar (naik satu folder ke src, lalu masuk middleware)
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
// Impor auth dari Firebase Admin SDK untuk setCustomUserClaims
const { auth } = require('../config/firebase'); 

// Route untuk menetapkan role admin ke pengguna berdasarkan UID
// Hanya bisa diakses oleh pengguna yang sudah login DAN memiliki role 'admin'
router.post('/set-admin-role', verifyToken, authorizeRoles('admin'), async (req, res) => {
  const { uid } = req.body; // Dapatkan UID dari body request

  if (!uid) {
    return res.status(400).json({ message: 'UID pengguna diperlukan untuk menetapkan role admin.' });
  }

  try {
    // Verifikasi apakah UID tersebut valid (opsional, tapi baik untuk mencegah error)
    await auth.getUser(uid); // Akan melempar error jika UID tidak ditemukan

    // Tetapkan custom claim 'role: admin'
    await auth.setCustomUserClaims(uid, { role: 'admin' });

    // Opsional: Perbarui juga field role di Firestore jika Anda ingin konsisten
    // (Ini tidak wajib, karena role dari custom claims yang utama)
    // const { db } = require('../config/firebase'); // Impor db jika belum
    // await db.collection('users').doc(uid).update({ role: 'admin', updated_at: new Date() });

    console.log(`Role 'admin' berhasil ditetapkan untuk UID: ${uid} oleh admin ${req.user.email}`);
    res.status(200).json({ message: `Role 'admin' berhasil ditetapkan untuk pengguna dengan UID: ${uid}` });

  } catch (error) {
    console.error(`Error menetapkan role admin untuk UID ${uid}:`, error);
    // Tangani error jika UID tidak ditemukan atau masalah lain
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({ message: 'Pengguna dengan UID tersebut tidak ditemukan.' });
    }
    res.status(500).json({ message: 'Gagal menetapkan role admin. Silakan coba lagi.', error: error.message });
  }
});

module.exports = router;