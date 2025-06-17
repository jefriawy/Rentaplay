// backend/src/routes/rentalRoutes.js

const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware'); // Untuk melindungi rute
const rentalController = require('../controllers/rentalController'); // Impor controller rental

// --- Rute untuk User ---
// POST: Mengecek ketersediaan PS5 untuk periode tertentu
// Bisa diakses oleh user yang login
router.post('/check-availability', verifyToken, rentalController.checkAvailability);

// POST: Membuat pesanan sewa baru
// Hanya user yang login yang bisa membuat pesanan
router.post('/create', verifyToken, rentalController.createRental);

// TODO: Nanti akan ada rute untuk mengambil riwayat sewa user, update status rental (admin), dll.
// GET: Mengambil riwayat sewa user yang sedang login
router.get('/my-rentals', verifyToken, rentalController.getUserRentals);

// --- Rute baru untuk Admin ---
// Mengambil semua data rental (untuk admin)
router.get('/', verifyToken, authorizeRoles('admin'), rentalController.getAllRentals);
// Mengubah status rental (konfirmasi/tolak oleh admin)
router.patch('/:rentalId/status', verifyToken, authorizeRoles('admin'), rentalController.updateRentalStatus);

module.exports = router;