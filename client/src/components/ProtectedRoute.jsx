import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { AUTH_ENABLED } from '../config.js';
import Message from './Message.jsx';

export default function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();
  const location = useLocation();

  // If authentication is disabled globally, allow immediate access
  if (!AUTH_ENABLED) return children;

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  if (roles && !roles.includes(user.role)) {
    return <Message type="error">Access denied: this page is only for {roles.join(' / ')}.</Message>;
  }

  return children;
}
