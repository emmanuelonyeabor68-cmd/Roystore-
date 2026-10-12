import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageSkeleton } from '../components/Skeletons';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageSkeleton admin />;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.is_staff) return <Navigate to="/dashboard" replace />;
  return children;
}