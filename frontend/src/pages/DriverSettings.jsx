import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoMoonOutline, IoMoon, IoCardOutline, IoLockClosedOutline, IoHelpCircleOutline, IoChevronForward, IoCloseOutline, IoTrashOutline } from "react-icons/io5";
import DriverBottomNav from "../components/DriverBottomNav";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";

export default function DriverSettings() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="page driver-page" style={{ backgroundColor: "#1F2937", color: "#F9FAFB", minHeight: "100vh" }}>
      <header className="header" style={{ backgroundColor: "#1F2937", borderBottom: "1px solid #374151" }}>
        <button className="back-btn" onClick={() => navigate("/driver/profile")} style={{ color: "#F9FAFB" }}>
          <IoArrowBack size={24} />
        </button>
        <h1 className="page-title" style={{ color: "#F9FAFB" }}>Settings</h1>
        <div style={{ width: "24px" }}></div>
      </header>

      <main className="content" style={{ backgroundColor: "#111827", paddingBottom: "90px" }}>
        <section className="settings-section">
          <h3 className="section-title" style={{ color: "#F9FAFB" }}>Appearance</h3>
          <div className="settings-list">
            <div
              className="settings-item"
              style={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                color: "#F9FAFB",
                opacity: 0.5,
                cursor: "not-allowed",
                pointerEvents: "none"
              }}
            >
              <span className="settings-item-content">
                <IoMoon size={20} />
                Dark Mode
              </span>
              <div
                style={{
                  width: "48px",
                  height: "28px",
                  backgroundColor: "#3B82F6",
                  borderRadius: "14px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    position: "absolute",
                    top: "2px",
                    left: "22px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h3 className="section-title" style={{ color: "#F9FAFB" }}>Account</h3>
          <div className="settings-list">
            <button 
              className="settings-item"
              onClick={() => navigate("/driver/profile")}
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
          </div>
        </section>

        {/* Delete Account */}
        <section className="settings-section">
          <h3 className="section-title" style={{ color: "#DC2626" }}>Danger Zone</h3>
          <div className="settings-list">
            {!showDeleteConfirm ? (
              <button 
                className="settings-item"
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #DC2626",
                  color: "#DC2626",
                }}
              >
                <span className="settings-item-content">
                  <IoTrashOutline size={20} />
                  Delete Account
                </span>
                <IoChevronForward size={20} />
              </button>
            ) : (
              <div style={{
                padding: "16px",
                backgroundColor: "#1F2937",
                borderRadius: "12px",
                border: "2px solid #DC2626"
              }}>
                <p style={{
                  margin: "0 0 12px 0",
                  color: "#F9FAFB",
                  fontSize: "14px",
                  fontWeight: "500"
                }}>
                  Are you sure you want to delete your account? This action cannot be undone.
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={async () => {
                      setIsDeleting(true);
                      try {
                        const data = await api.deleteAccount();
                        if (data.success) {
                          logout();
                          localStorage.clear();
                          navigate("/login");
                        } else {
                          alert(data.message || "Failed to delete account");
                          setIsDeleting(false);
                          setShowDeleteConfirm(false);
                        }
                      } catch (error) {
                        console.error("Error deleting account:", error);
                        alert("Failed to delete account. Please try again.");
                        setIsDeleting(false);
                        setShowDeleteConfirm(false);
                      }
                    }}
                    disabled={isDeleting}
                    style={{
                      flex: 1,
                      padding: "10px",
                      backgroundColor: "#DC2626",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: isDeleting ? "not-allowed" : "pointer",
                      opacity: isDeleting ? 0.6 : 1
                    }}
                  >
                    {isDeleting ? "Deleting..." : "Yes, Delete"}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    style={{
                      flex: 1,
                      padding: "10px",
                      backgroundColor: "#374151",
                      color: "#F9FAFB",
                      border: "1px solid #4B5563",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: isDeleting ? "not-allowed" : "pointer"
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="settings-section">
          <h3 className="section-title" style={{ color: "#F9FAFB" }}>Preferences</h3>
          <div className="settings-list">
            <div
              className="settings-item"
              style={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                color: "#F9FAFB",
                opacity: 0.5,
                cursor: "not-allowed",
                pointerEvents: "none"
              }}
            >
              <span className="settings-item-content">
                <IoLockClosedOutline size={20} />
                Privacy & Security
              </span>
              <IoChevronForward size={20} />
            </div>
            <div
              className="settings-item"
              style={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                color: "#F9FAFB",
                opacity: 0.5,
                cursor: "not-allowed",
                pointerEvents: "none"
              }}
            >
              <span className="settings-item-content">
                <IoHelpCircleOutline size={20} />
                Help & Support
              </span>
              <IoChevronForward size={20} />
            </div>
          </div>
        </section>
      </main>

      <DriverBottomNav />
    </div>
  );
}
