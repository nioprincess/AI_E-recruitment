import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const LoginRequiredLayout = () => {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return  <Outlet />
};

export default LoginRequiredLayout;
