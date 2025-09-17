import { useLocation, Navigate, Outlet } from "react-router-dom";
import useUser from "../hooks/useUser";

const StudentRequiredLayout  = () => {
  const user = useUser()
  const location = useLocation();

  return user.role=="student" ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  );
};

export default StudentRequiredLayout;
