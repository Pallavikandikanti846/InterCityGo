import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IoArrowBack, IoPersonCircleOutline } from "react-icons/io5";
import DriverBottomNav from "../components/DriverBottomNav";
import { api } from "../utils/api";

export default function DriverEditProfile() {
  const { user, updateUser } = useAuth();
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
        const result = await api.getProfile();
        if (result.user) {
          setFormData({
            name: result.user.name || "",
            email: result.user.email || "",
            phone: result.user.phone || "",
          });
          updateUser(result.user);
        } else if (user) {
          setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
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
        const updatedUser = result.user || {
          ...user,
          ...formData,
        };
        updateUser(updatedUser);

        setMessage({ type: "success", text: "Profile updated successfully!" });

        setTimeout(() => {
          navigate("/driver/profile");
        }, 1500);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page driver-page" style={{ backgroundColor: "#1F2937", color: "#F9FAFB", minHeight: "100vh" }}>
      <header className="header" style={{ backgroundColor: "#1F2937", borderBottom: "1px solid #374151" }}>
        <button className="back-btn" onClick={() => navigate("/driver/profile")} style={{ color: "#F9FAFB" }}>
          <IoArrowBack size={24} />
        </button>
        <h1 className="page-title" style={{ color: "#F9FAFB" }}>Edit Profile</h1>
        <div style={{ width: "24px" }}></div>
      </header>

      <main className="content" style={{ backgroundColor: "#111827", paddingBottom: "90px" }}>
        <section className="profile-section">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "32px" }}>
            <IoPersonCircleOutline size={80} style={{ color: "#60A5FA" }} />
            <h2 style={{ marginTop: "16px", marginBottom: "8px", color: "#F9FAFB" }}>{user?.name || "Driver"}</h2>
            <p style={{ color: "#9CA3AF", fontSize: "14px" }}>{user?.email}</p>
          </div>

          {message.text && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "24px",
                backgroundColor: message.type === "error" ? "#7F1D1D" : "#064E3B",
                color: message.type === "error" ? "#FCA5A5" : "#6EE7B7",
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
                  color: "#F9FAFB",
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
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  fontSize: "16px",
                  backgroundColor: "#1F2937",
                  color: "#F9FAFB",
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
                  color: "#F9FAFB",
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
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  fontSize: "16px",
                  backgroundColor: "#374151",
                  color: "#9CA3AF",
                }}
                disabled
              />
              <p style={{ marginTop: "4px", fontSize: "12px", color: "#9CA3AF" }}>
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
                  color: "#F9FAFB",
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
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  fontSize: "16px",
                  backgroundColor: "#1F2937",
                  color: "#F9FAFB",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button
                type="button"
                onClick={() => navigate("/driver/profile")}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  backgroundColor: "#1F2937",
                  color: "#F9FAFB",
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
                  backgroundColor: loading ? "#6B7280" : "#3B82F6",
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

      <DriverBottomNav />
    </div>
  );
}
