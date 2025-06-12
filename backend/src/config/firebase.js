// backend/src/config/firebase.js

const admin = require("firebase-admin"); // Import Firebase Admin SDK

// Pastikan jalur ke service account key Anda sudah benar
// File ini harus disimpan dengan aman dan TIDAK diunggah ke repositori publik
const serviceAccount = require("../config/serviceAccountKey.json"); // Sesuaikan path jika berbeda

// Inisialisasi Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Dapatkan instance Firestore dan Authentication
const db = admin.firestore(); // Export instance Firestore
const auth = admin.auth(); // Export instance Auth

// Export instance db dan auth agar bisa digunakan di controller dan service lain
module.exports = { db, auth, admin }; // Juga export 'admin' jika Anda membutuhkan fungsionalitas lain dari admin SDK
