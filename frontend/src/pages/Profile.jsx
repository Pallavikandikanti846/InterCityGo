import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  IoPersonCircleOutline, 
  IoCreateOutline, 
  IoSettingsOutline,
  IoChevronForward 
} from "react-icons/io5";
import BottomNav from "../components/BottomNav";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="page">
      <header className="header">
        <div style={{ width: "24px" }}></div>
        <h1 className="page-title">Profile</h1>
        <div style={{ width: "24px" }}></div>
      </header>

      <main className="content">
        <section className="profile-section">
          <IoPersonCircleOutline className="profile-avatar" />
          <h2 className="profile-name">{user?.name || "User"}</h2>
          <p className="profile-email">{user?.email}</p>
          {user?.phone && <p className="profile-phone" style={{ marginTop: "4px", color: "#6B7280" }}>{user.phone}</p>}
          <p className="profile-role">
            {user?.role === "passenger" ? "Passenger" : user?.role}
          </p>
        </section>

        <section className="profile-section">
          <h3 className="section-title">Account Settings</h3>
          <div className="settings-list">
            <button className="settings-item" onClick={() => navigate("/profile/edit")}>
              <span className="settings-item-content">
                <IoCreateOutline size={20} />
                Edit Profile
              </span>
              <IoChevronForward size={20} />
            </button>
            <button className="settings-item" onClick={() => navigate("/settings")}>
              <span className="settings-item-content">
                <IoSettingsOutline size={20} />
                Settings
              </span>
              <IoChevronForward size={20} />
            </button>
          </div>
        </section>

        <section className="profile-section">
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

