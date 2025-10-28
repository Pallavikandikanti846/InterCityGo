import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IoArrowBack, IoPersonCircleOutline } from "react-icons/io5";
import BottomNav from "../components/BottomNav";
import { api } from "../utils/api";

export default function EditProfile() {
  const { user, login, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch fresh user data from server to ensure we have the latest phone number
        const result = await api.getProfile();
        if (result.user) {
          // Update the form with server data
          setFormData({
            name: result.user.name || "",
            email: result.user.email || "",
            phone: result.user.phone || "",
          });
          // Also update the context with fresh data
          updateUser(result.user);
        } else if (user) {
          // Fallback to context data if API fails
          setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        // Fallback to context data if API fails
        if (user) {
          setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
          });
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const result = await api.updateProfile(formData);
      
      if (result.error) {
        setMessage({ type: "error", text: result.message || "Failed to update profile" });
      } else {
        // Update user in context and localStorage
        const updatedUser = result.user || {
          ...user,
          ...formData,
        };
        updateUser(updatedUser);
        
        setMessage({ type: "success", text: "Profile updated successfully!" });
        
        // Redirect to profile page after 1.5 seconds
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="header">
        <button className="back-btn" onClick={() => navigate("/profile")}>
          <IoArrowBack size={24} />
        </button>
        <h1 className="page-title">Edit Profile</h1>
        <div style={{ width: "24px" }}></div>
      </header>

      <main className="content">
        <section className="profile-section">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "32px" }}>
            <IoPersonCircleOutline size={80} color="#6B7280" />
            <h2 style={{ marginTop: "16px", marginBottom: "8px" }}>{user?.name || "User"}</h2>
            <p style={{ color: "#6B7280", fontSize: "14px" }}>{user?.email}</p>
          </div>

          {message.text && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "24px",
                backgroundColor: message.type === "error" ? "#FEE2E2" : "#D1FAE5",
                color: message.type === "error" ? "#991B1B" : "#065F46",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label
                htmlFor="name"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  fontSize: "14px",
                  color: "#374151",
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "16px",
                  backgroundColor: "#FFFFFF",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  fontSize: "14px",
                  color: "#374151",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "16px",
                  backgroundColor: "#F9FAFB",
                  color: "#6B7280",
                }}
                disabled
              />
              <p style={{ marginTop: "4px", fontSize: "12px", color: "#6B7280" }}>
                Email cannot be changed
              </p>
            </div>

            <div>
              <label
                htmlFor="phone"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  fontSize: "14px",
                  color: "#374151",
                }}
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "16px",
                  backgroundColor: "#FFFFFF",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  backgroundColor: "#FFFFFF",
                  color: "#374151",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: loading ? "#9CA3AF" : "#3B82F6",
                  color: "#FFFFFF",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

