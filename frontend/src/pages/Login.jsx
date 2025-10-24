import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      const data = isLogin
        ? await api.login({ email: formData.email, password: formData.password })
        : await api.signup(formData);

      if (data.token && data.user) {
        login(data.user, data.token);
        navigate("/home");
      } else {
        throw new Error(data.message || "Authentication failed");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="app auth-page">
      <section className="card">
        <h1 className="title">{isLogin ? "Login" : "Sign Up"}</h1>

        <form onSubmit={handleSubmit} className="form">
          {!isLogin && (
            <>
              <input
                className="input"
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                className="input"
                type="text"
                name="phone"
                placeholder="Phone Number (optional)"
                value={formData.phone}
                onChange={handleChange}
              />
            </>
          )}

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
            {isSubmitting ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <p className="muted link-row">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="link-btn"
            onClick={() => setIsLogin((v) => !v)}
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>

        {error && <div className="error-message">{error}</div>}
      </section>
    </main>
  );
}

