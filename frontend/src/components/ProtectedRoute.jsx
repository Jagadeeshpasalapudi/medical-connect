import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="loading-screen"><div className="loader-ring" /><p>Loading MediConnect...</p></div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const destination = user.role === "doctor" ? "/doctor/dashboard" : user.role === "admin" ? "/admin/dashboard" : "/patient/dashboard";
    return <Navigate to={destination} replace />;
  }
  return <Outlet />;
};
export default ProtectedRoute;
