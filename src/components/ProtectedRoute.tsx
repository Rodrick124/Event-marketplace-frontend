import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../context/types';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // Redirect to login and save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(user.role)) {
    // Redirect based on user's actual role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'organizer':
        return <Navigate to="/organizer" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
