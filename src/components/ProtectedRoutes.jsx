import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  // If token exists, go to dashboard, otherwise go to login
  return token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
