import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";

export default function Login() {
  const [userType, setUserType] = useState("passenger"); // "passenger" or "driver"
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    carModel: "",
    carImage: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // Ensure login page is always in light mode
  useEffect(() => {
    document.documentElement.classList.remove("dark-mode");
  }, []);

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        // Login flow
        const data = await api.login({ email: formData.email, password: formData.password });
        
        if (data.token && data.user) {
          login(data.user, data.token);
          // Clear form after successful login
          setFormData({
            name: "",
            email: "",
            password: "",
            phone: "",
          });
          // Navigate based on user role
          if (data.user.role === "driver") {
            navigate("/driver/dashboard");
          } else {
            navigate("/home");
          }
        } else {
          throw new Error(data.message || "Authentication failed");
        }
      } else {
        // Signup flow - include role based on userType
        const signupData = {
          ...formData,
          role: userType,
        };
        
        // For driver signup, validate required fields
        if (userType === "driver") {
          if (!formData.name || !formData.email || !formData.phone || !formData.carModel || !formData.carImage) {
            setError("All fields are required for driver registration");
            setIsSubmitting(false);
            return;
          }
        }
        
        // Build payload based on user type
        let payload;
        let isMultipart = false;
        if (userType === "driver") {
          // For drivers, use FormData to include image upload
          const fd = new FormData();
          fd.append("name", formData.name);
          fd.append("email", formData.email);
          fd.append("password", formData.password);
          fd.append("phone", formData.phone);
          fd.append("role", userType);
          fd.append("carModel", formData.carModel);
          if (formData.carImage) {
            fd.append("carImage", formData.carImage);
          }
          payload = fd;
          isMultipart = true;
        } else {
          // For passengers, send JSON
          payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            role: userType,
          };
        }

        const data = await api.signup(payload, isMultipart);
        
        if (data.success || data.message) {
          // Show success message
          setSuccess(data.message || "Account created successfully! Please login.");
          // Clear form fields
          setFormData({
            name: "",
            email: "",
            password: "",
            phone: "",
            carModel: "",
            carImage: null,
          });
          // Switch to login mode after a short delay
          setTimeout(() => {
            setIsLogin(true);
            setSuccess("");
          }, 2000);
        } else {
          throw new Error(data.message || "Signup failed");
        }
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
        {/* User Type Tabs */}
        <div className="user-type-tabs">
          <button
            type="button"
            className={`tab-btn ${userType === "passenger" ? "active" : ""}`}
            onClick={() => {
              setUserType("passenger");
              setError("");
              setSuccess("");
            }}
          >
            Passenger
          </button>
          <button
            type="button"
            className={`tab-btn ${userType === "driver" ? "active" : ""}`}
            onClick={() => {
              setUserType("driver");
              setError("");
              setSuccess("");
            }}
          >
            Driver
          </button>
        </div>

        <h1 className="title">{isLogin ? "Login" : "Sign Up"}</h1>

        <form onSubmit={handleSubmit} className="form" encType={userType === "driver" && !isLogin ? "multipart/form-data" : undefined}>
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
              {userType === "driver" && (
                <input
                  className="input"
                  type="text"
                  name="phone"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              )}
              {userType === "passenger" && (
                <input
                  className="input"
                  type="text"
                  name="phone"
                  placeholder="Phone Number (optional)"
                  value={formData.phone}
                  onChange={handleChange}
                />
              )}
              {userType === "driver" && (
                <>
                  <input
                    className="input"
                    type="text"
                    name="carModel"
                    placeholder="Car Model *"
                    value={formData.carModel}
                    onChange={handleChange}
                    required
                  />
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      color: "#6B7280",
                      fontWeight: "500",
                    }}>
                      Car Image *
                    </label>
                    <input
                      className="input"
                      type="file"
                      name="carImage"
                      accept="image/*"
                      onChange={handleChange}
                      required
                      style={{
                        padding: "8px",
                        fontSize: "14px",
                      }}
                    />
                    {formData.carImage && (
                      <p style={{
                        fontSize: "12px",
                        color: "#10B981",
                        marginTop: "4px",
                      }}>
                        Selected: {formData.carImage.name}
                      </p>
                    )}
                  </div>
                </>
              )}
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
            onClick={() => {
              setIsLogin((v) => !v);
              setError("");
              setSuccess("");
              // Clear form when switching between login/signup
              setFormData({
                name: "",
                email: "",
                password: "",
                phone: "",
                carModel: "",
                carImage: null,
              });
            }}
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>

        {error && <div className="error-message">{error}</div>}
        {success && (
          <div style={{
            padding: "12px 16px",
            borderRadius: "8px",
            backgroundColor: "#D1FAE5",
            color: "#065F46",
            fontSize: "14px",
            marginTop: "16px",
            textAlign: "center"
          }}>
            {success}
          </div>
        )}
      </section>
    </main>
  );
}

