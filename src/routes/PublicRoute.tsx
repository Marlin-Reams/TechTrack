import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../providers/useAuth";
import LoadingScreen from "../components/common/LoadingScreen";

function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) {
  return <LoadingScreen />;
}

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;