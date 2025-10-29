import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminProtectedRoute({ children }) {
  const { isAuthenticated, loading, user, login } = useAuth();
  
  const devMode = localStorage.getItem("admin_dev_mode") === "true";
  
  useEffect(() => {
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
    return children;
  }

  if (!isAuthenticated || !user || user.role !== "admin") {
    return <Navigate to="/admin/login" />;
  }

  return children;
}

