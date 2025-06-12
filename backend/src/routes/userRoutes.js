// backend/src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
// Pastikan jalur ke authMiddleware.js sudah benar.
// Dari routes/, '../' naik ke src/, lalu masuk ke middleware/
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware'); 

// Rute untuk mendapatkan profil pengguna
// Hanya dapat diakses oleh user yang sudah login (membutuhkan token yang diverifikasi)
router.get('/profile', verifyToken, (req, res) => {
  // req.user akan berisi informasi user yang terdekode dari token oleh verifyToken
  res.status(200).json({
    message: 'Anda berhasil mengakses profil!',
    user: {
      uid: req.user.uid,
      email: req.user.email,
      // Role akan berasal dari custom claims di token, atau 'user' jika tidak ada
      role: req.user.role || 'user' 
    }
  });
});

// Rute untuk mendapatkan data admin
// Hanya dapat diakses oleh user yang sudah login DAN memiliki role 'admin'
router.get('/admin-data', verifyToken, authorizeRoles('admin'), (req, res) => {
  res.status(200).json({
    message: 'Selamat datang, Admin! Ini data rahasia.',
    adminUser: {
      uid: req.user.uid,
      email: req.user.email,
      role: req.user.role // Seharusnya 'admin' jika middleware authorizeRoles('admin') dilewati
    }
  });
});

module.exports = router;