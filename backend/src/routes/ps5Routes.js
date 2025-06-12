// backend/src/routes/ps5Routes.js

const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware'); // Impor middleware
const ps5Controller = require('../controllers/ps5Controller'); // Impor controller PS5

// Rute PUBLIK untuk mendapatkan unit PS5 yang TERSEDIA (untuk tampilan katalog user)
router.get('/available', ps5Controller.getAvailablePs5Units);

// Rute ADMIN untuk PS5 Management (membutuhkan autentikasi dan role 'admin')
// POST: Menambahkan unit PS5 baru
router.post('/', verifyToken, authorizeRoles('admin'), ps5Controller.addPs5Unit);

// GET: Mengambil semua unit PS5 (untuk daftar manajemen admin)
router.get('/', verifyToken, authorizeRoles('admin'), ps5Controller.getAllPs5Units);

// PERBAIKAN DI SINI:
// GET: Mengambil unit PS5 berdasarkan ID (untuk detail/booking user)
// Cukup butuh verifyToken (pengguna login), tidak perlu role 'admin'
router.get('/:id', verifyToken, ps5Controller.getPs5UnitById); // <-- authorizeRoles('admin') DIHAPUS

// PUT: Mengupdate unit PS5 berdasarkan ID
router.put('/:id', verifyToken, authorizeRoles('admin'), ps5Controller.updatePs5Unit);

// DELETE: Menghapus unit PS5 berdasarkan ID
router.delete('/:id', verifyToken, authorizeRoles('admin'), ps5Controller.deletePs5Unit);


module.exports = router;