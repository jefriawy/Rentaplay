// frontend/src/firebase/index.js

// Import fungsi yang dibutuhkan dari Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Firebase Authentication
import { getFirestore } from "firebase/firestore"; // Import Firebase Firestore

// Konfigurasi aplikasi web Firebase Anda
// Ganti nilai-nilai ini dengan konfigurasi proyek Firebase Anda yang Anda dapatkan dari Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCnBJGRUxn8Mx0WnDGFmzxKKGWwY_rspj4", // Ini API Key Anda yang sudah Anda berikan
  authDomain: "rentaplay-79852.firebaseapp.com",
  projectId: "rentaplay-79852",
  storageBucket: "rentaplay-79852.firebasestorage.app",
  messagingSenderId: "475658951918",
  appId: "1:475658951918:web:e7d06f04eabff3f99427ff"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Dapatkan instance service yang sering digunakan
// Ini akan memudahkan Anda untuk menggunakannya di seluruh aplikasi React Anda
export const auth = getAuth(app); // Export instance Auth
export const db = getFirestore(app); // Export instance Firestore

// Anda bisa menambahkan eksport untuk service Firebase lainnya di sini jika diperlukan,
// seperti:
// import { getStorage } from "firebase/storage";
// export const storage = getStorage(app);