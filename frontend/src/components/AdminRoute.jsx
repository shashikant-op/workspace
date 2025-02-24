import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const isAdminAuthenticated = localStorage.getItem("adminToken"); // Check token

  return isAdminAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

export default AdminRoute;
