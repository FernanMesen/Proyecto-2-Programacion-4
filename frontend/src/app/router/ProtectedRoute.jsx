import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext.jsx";

export function ProtectedRoute({ role }) {
  const { isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role && !hasRole(`ROLE_${role}`)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
}
