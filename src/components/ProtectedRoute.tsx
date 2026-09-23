import { Navigate, useLocation,Outlet } from "react-router-dom";
import { useAuth } from "../hooks/customHooks";

function ProtectedRoute() {
  const { isAuthenticated,isLoading } = useAuth();
  const location = useLocation();

 if (isLoading) {
    return <div>Loading...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet/>;
}

export default ProtectedRoute;
