import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminProtectedRoute({ children }) {
  const { isAuthenticated, loading, user, login } = useAuth();
  
  // Development mode: Allow bypass if admin_dev_mode is set in localStorage
  const devMode = localStorage.getItem("admin_dev_mode") === "true";
  
  useEffect(() => {
    // In dev mode, if no user is set, create a mock admin user
    if (devMode && !user) {
      const mockAdmin = {
        _id: "dev_admin_001",
        email: "admin@dev.local",
        name: "Development Admin",
        role: "admin"
      };
      login(mockAdmin, "dev_token_" + Date.now());
    }
  }, [devMode, user, login]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (devMode) {
    // In dev mode, allow access even if user is not fully set yet (will be set by useEffect)
    return children;
  }

  // Check if user is authenticated and is an admin
  if (!isAuthenticated || !user || user.role !== "admin") {
    return <Navigate to="/admin/login" />;
  }

  return children;
}

