import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoMoonOutline, IoMoon, IoCardOutline, IoLockClosedOutline, IoHelpCircleOutline, IoChevronForward, IoCloseOutline } from "react-icons/io5";
import DriverBottomNav from "../components/DriverBottomNav";
import { useState, useEffect } from "react";

export default function DriverSettings() {
  const navigate = useNavigate();

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
