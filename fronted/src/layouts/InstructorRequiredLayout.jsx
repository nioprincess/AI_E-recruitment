import { useLocation, Navigate, Outlet } from "react-router-dom";
import useUser from "../hooks/useUser";

const InstructorRequiredLayout = () => {
  const user = useUser()
  const location = useLocation();

  return user.role=="instructor" ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  );
};

export default InstructorRequiredLayout;
