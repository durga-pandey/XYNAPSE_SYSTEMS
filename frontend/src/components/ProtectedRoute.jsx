import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({
  children,
  requireAuth = true,
  allowedRoles = [],
  redirectTo = '/login'
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (isAuthenticated && allowedRoles.length === 0) {
    return children;
  }

  if (isAuthenticated && allowedRoles.length > 0) {
    const userRole = user?.role;

    if (allowedRoles.includes(userRole)) {
      return children;
    } else {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  if (!requireAuth) {
    return children;
  }

  return <Navigate to={redirectTo} state={{ from: location }} replace />;
};

export default ProtectedRoute;

export const AdminRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin', 'super_admin']} requireAuth={true}>
    {children}
  </ProtectedRoute>
);

export const SuperAdminRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['super_admin']} requireAuth={true}>
    {children}
  </ProtectedRoute>
);

export const UserRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['user']} requireAuth={true}>
    {children}
  </ProtectedRoute>
);

export const PublicRoute = ({ children }) => (
  <ProtectedRoute requireAuth={false}>
    {children}
  </ProtectedRoute>
);
