import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IoArrowBack, IoPersonCircleOutline, IoChevronForward } from "react-icons/io5";
import DriverBottomNav from "../components/DriverBottomNav";

export default function DriverProfile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="page driver-page" style={{ backgroundColor: "#1F2937", color: "#F9FAFB", minHeight: "100vh" }}>
      <header className="header" style={{ backgroundColor: "#1F2937", borderBottom: "1px solid #374151" }}>
        <button className="back-btn" onClick={() => navigate("/driver/dashboard")} style={{ color: "#F9FAFB" }}>
          <IoArrowBack size={24} />
        </button>
        <h1 className="page-title" style={{ color: "#F9FAFB" }}>Profile</h1>
        <div style={{ width: "24px" }}></div>
      </header>

      <main className="content" style={{ backgroundColor: "#111827", paddingBottom: "90px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <IoPersonCircleOutline size={80} style={{ color: "#60A5FA", marginBottom: "16px" }} />
          <h2 style={{ marginBottom: "8px", color: "#F9FAFB" }}>
            {user?.name || "Driver"}
          </h2>
          <p style={{ color: "#9CA3AF", margin: "4px 0" }}>{user?.email}</p>
          <p style={{ color: "#60A5FA", fontSize: "13px", fontWeight: "600", marginTop: "8px" }}>
            Driver
          </p>
        </div>

        <section className="profile-section">
          <div className="settings-list">
            <button 
              className="settings-item" 
              onClick={() => navigate("/driver/profile/edit")}
              style={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                color: "#F9FAFB",
              }}
            >
              <span className="settings-item-content">
                Edit Profile
              </span>
              <IoChevronForward size={20} />
            </button>
            <button 
              className="settings-item" 
              onClick={() => navigate("/driver/settings")}
              style={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                color: "#F9FAFB",
              }}
            >
              <span className="settings-item-content">
                Settings
              </span>
              <IoChevronForward size={20} />
            </button>
          </div>
        </section>

        <section className="profile-section">
          <button 
            className="btn btn-danger" 
            onClick={handleLogout}
            style={{
              backgroundColor: "#EF4444",
              color: "white",
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </section>
      </main>

      <DriverBottomNav />
    </div>
  );
}

