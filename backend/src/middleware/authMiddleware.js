// backend/src/middleware/authMiddleware.js

const { auth } = require('../config/firebase'); // Impor instance auth dari firebase admin SDK

const verifyToken = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: 'Authorization header not found. Token required.' });
  }

  const token = header.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'Token not found in Authorization header.' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken; 
    next(); 
  } catch (error) {
    console.error('Error verifying token:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token.', error: error.message });
  }
};

const authorizeRoles = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles]; 
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: 'Akses Ditolak: Pengguna tidak terautentikasi.' });
    }

    const userRole = req.user.role || 'user'; 

    if (roles.length && !roles.includes(userRole)) {
      return res.status(403).json({ message: 'Akses Ditolak: Anda tidak memiliki peran yang diperlukan.' });
    }
    next(); 
  };
};

module.exports = { verifyToken, authorizeRoles };