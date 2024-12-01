import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { User } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: User['role'];
}

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};