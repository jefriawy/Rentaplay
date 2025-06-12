// backend/src/routes/rentalRoutes.js

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware'); // Untuk melindungi rute
const rentalController = require('../controllers/rentalController'); // Impor controller rental

// POST: Mengecek ketersediaan PS5 untuk periode tertentu
// Bisa diakses oleh user yang login
router.post('/check-availability', verifyToken, rentalController.checkAvailability);

// POST: Membuat pesanan sewa baru
// Hanya user yang login yang bisa membuat pesanan
router.post('/create', verifyToken, rentalController.createRental);

// TODO: Nanti akan ada rute untuk mengambil riwayat sewa user, update status rental (admin), dll.

module.exports = router;