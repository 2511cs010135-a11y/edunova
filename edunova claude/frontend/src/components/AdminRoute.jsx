import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, loading, toggleAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="py-24 text-center font-mono text-slate">Loading authentication...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
