import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// NOTE: filename is intentionally kept as "ProctectedRoute.jsx" so the existing
// import in App.jsx keeps working. Recommend renaming to "ProtectedRoute.jsx"
// (and updating the import) as a P2 cleanup in a later sprint.

const ProtectedRoute = ({ children, role }) => {
  const { user, verifying } = useAuth();
  const token = localStorage.getItem("token");

  // No token at all → straight to login.
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token present but still being verified against the server → wait.
  if (verifying) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Verification finished and the server rejected the token → login.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Optional role gate (e.g. <ProtectedRoute role="admin">).
  if (role && user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
