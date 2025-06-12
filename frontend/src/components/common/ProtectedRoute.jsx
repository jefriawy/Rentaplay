    // frontend/src/components/common/ProtectedRoute.jsx

    import React from 'react';
    import { Navigate } from 'react-router-dom';
    import { useAuth } from '../../context/AuthContext';

    const ProtectedRoute = ({ children, adminOnly = false }) => {
      const { currentUser, loading } = useAuth();

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
            Memuat sesi...
          </div>
        );
      }

      if (!currentUser) {
        return <Navigate to="/login" replace />;
      }

      if (adminOnly && currentUser.role !== 'admin') {
        return <Navigate to="/" replace />; 
      }

      return children;
    };

    export default ProtectedRoute;
    