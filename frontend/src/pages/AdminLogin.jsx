import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";

export default function AdminLogin() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // Ensure login page is always in light mode
  useEffect(() => {
    document.documentElement.classList.remove("dark-mode");
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      const data = await api.adminLogin({ email: formData.email, password: formData.password });
      
      if (data.token && data.user) {
        // Verify user is admin
        if (data.user.role !== "admin") {
          throw new Error("Access denied. Admin access only.");
        }
        
        login(data.user, data.token);
        setFormData({ email: "", password: "" });
        navigate("/admin/dashboard");
      } else {
        throw new Error(data.message || "Authentication failed");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDevLogin = () => {
    // Development mode: Create a mock admin user
    const mockAdmin = {
      _id: "dev_admin_001",
      email: "admin@dev.local",
      name: "Development Admin",
      role: "admin"
    };
    localStorage.setItem("admin_dev_mode", "true");
    login(mockAdmin, "dev_token_" + Date.now());
    navigate("/admin/dashboard");
  };

  return (
    <main className="app auth-page">
      <section className="card">
        <h1 className="title">Admin Login</h1>

        <form onSubmit={handleSubmit} className="form">
          <input
            className="input"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            className="input"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button className="btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Please wait..." : "Login"}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}
        
        {import.meta.env.DEV && (
          <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--border-color)" }}>
            <button
              type="button"
              onClick={handleDevLogin}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "2px solid #3B82F6",
                backgroundColor: "transparent",
                color: "#3B82F6",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Development Mode Login
            </button>
            <p style={{
              marginTop: "8px",
              fontSize: "12px",
              color: "var(--text-muted)",
              textAlign: "center"
            }}>
              Use this for testing without backend
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

