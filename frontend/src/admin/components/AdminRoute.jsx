// src/admin/components/AdminRoute.jsx
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Belum login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Sudah login tapi bukan admin
  if (user.role !== "admin") {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
};

export default AdminRoute;
