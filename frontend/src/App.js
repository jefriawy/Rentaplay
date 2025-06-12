// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import './styles/globals.css';

import Header from './components/common/Header'; 

import Login from './pages/user/Login';
import Register from './pages/user/Register';
import Home from './pages/user/Home'; 
import UserDashboard from './pages/user/UserDashboard';
import Catalog from './pages/user/Catalog'; 
import Booking from './pages/user/Booking'; // <-- IMPOR HALAMAN BOOKING
import AdminDashboard from './pages/admin/AdminDashboard'; 
import PS5Management from './pages/admin/PS5Management'; 

import ProtectedRoute from './components/common/ProtectedRoute';
import { useAuth } from './context/AuthContext'; 

function App() {
  const { loading } = useAuth(); 

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        fontSize: '1.5rem', 
        color: 'var(--primary-green)',
        backgroundColor: 'var(--pale-white)'
      }}>
        Memuat aplikasi...
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Header /> 

        <div style={{ flexGrow: 1, paddingTop: '70px' }}> 
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<Catalog />} /> 
            <Route path="/catalog" element={<Catalog />} /> 

            {/* Rute untuk halaman Booking dengan parameter ID PS5 */}
            <Route path="/booking/:ps5Id" element={<ProtectedRoute><Booking /></ProtectedRoute>} /> {/* <-- BARIS BARU UNTUK BOOKING */}

            <Route path="/user-home" element={<ProtectedRoute><Home /></ProtectedRoute>} /> 
            <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            
            <Route path="/admin-login" element={<Login adminOnly={true} />} /> 
            <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/ps5-management" element={<ProtectedRoute adminOnly={true}><PS5Management /></ProtectedRoute>} />

            <Route path="*" element={<p style={{ textAlign: 'center', marginTop: '50px', fontSize: '2rem', color: 'var(--gray-700)' }}>404 - Halaman Tidak Ditemukan</p>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;