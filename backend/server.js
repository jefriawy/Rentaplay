// backend/server.js

// Import modul yang diperlukan
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Muat variabel lingkungan dari file .env
dotenv.config();

// Inisialisasi aplikasi Express
const app = express();

// Konfigurasi middleware
app.use(cors()); 
app.use(express.json()); 

// Import rute API
const userRoutes = require('./src/routes/userRoutes'); 
const adminRoutes = require('./src/routes/adminRoutes'); 
const ps5Routes = require('./src/routes/ps5Routes'); 
const rentalRoutes = require('./src/routes/rentalRoutes'); // <-- BARIS BARU UNTUK IMPOR RENTAL ROUTES

// Gunakan rute API
app.use('/api/users', userRoutes); 
app.use('/api/admin', adminRoutes); 
app.use('/api/ps5', ps5Routes); 
app.use('/api/rentals', rentalRoutes); // <-- BARIS BARU UNTUK MENGGUNAKAN RENTAL ROUTES


// Import konfigurasi Firebase Admin SDK (untuk pengujian koneksi, opsional bisa dihapus nanti)
const { db, auth } = require('./src/config/firebase');

// Route dasar untuk menguji server
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Selamat datang di API RentaPlay!' });
});

// Route untuk menguji koneksi Firebase Firestore (opsional)
app.get('/test-firestore', async (req, res) => {
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.limit(1).get(); 
    if (snapshot.empty) {
      return res.status(200).json({
        message: 'Koneksi Firebase Firestore berhasil! (Koleksi users mungkin kosong)',
        status: 'success'
      });
    } else {
      return res.status(200).json({
        message: 'Koneksi Firebase Firestore berhasil! Dokumen ditemukan.',
        status: 'success'
      });
    }
  } catch (error) {
    console.error('Error menguji koneksi Firestore:', error);
    return res.status(500).json({
      message: 'Gagal menguji koneksi Firebase Firestore.',
      error: error.message,
      status: 'error'
    });
  }
});

// Route untuk menguji koneksi Firebase Authentication (opsional)
app.get('/test-auth', async (req, res) => {
  try {
    const userRecords = await auth.listUsers(1);
    if (userRecords.users.length === 0) {
      return res.status(200).json({
        message: 'Koneksi Firebase Authentication berhasil! (Tidak ada pengguna terdaftar)',
        status: 'success'
      });
    } else {
      return res.status(200).json({
        message: 'Koneksi Firebase Authentication berhasil! Pengguna ditemukan.',
        status: 'success'
      });
    }
  } catch (error) {
    console.error('Error menguji koneksi Authentication:', error);
    return res.status(500).json({
      message: 'Gagal menguji koneksi Firebase Authentication.',
      error: error.message,
      status: 'error'
    });
  }
});


// Definisikan port dari variabel lingkungan atau default ke 5000
const PORT = process.env.PORT || 5000;

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server RentaPlay berjalan di port ${PORT} (${process.env.NODE_ENV} mode)`);
  console.log(`Akses: http://localhost:${PORT}`);
});