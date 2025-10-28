import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  IoArrowBack,
  IoCardOutline,
  IoMoonOutline,
  IoMoon,
  IoNotificationsOutline,
  IoLockClosedOutline,
  IoHelpCircleOutline,
  IoCloseOutline,
  IoChevronForward,
} from "react-icons/io5";
import BottomNav from "../components/BottomNav";

export default function Settings() {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    // Load payment methods from localStorage
    const storedMethods = localStorage.getItem("paymentMethods");
    if (storedMethods) {
      setPaymentMethods(JSON.parse(storedMethods));
    }
  }, []);

  const removePaymentMethod = (id) => {
    const updatedMethods = paymentMethods.filter((method) => method.id !== id);
    setPaymentMethods(updatedMethods);
    localStorage.setItem("paymentMethods", JSON.stringify(updatedMethods));
  };

  return (
    <div className="page">
      <header className="header">
        <button className="back-btn" onClick={() => navigate("/profile")}>
          <IoArrowBack size={24} />
        </button>
        <h1 className="page-title">Settings</h1>
        <div style={{ width: "24px" }}></div>
      </header>

      <main className="content">
        {/* App Settings */}
        <section className="settings-section">
          <h3 className="section-title">Appearance</h3>
          <div className="settings-list">
            <button className="settings-item" onClick={toggleDarkMode}>
              <span className="settings-item-content">
                {isDarkMode ? <IoMoon size={20} /> : <IoMoonOutline size={20} />}
                Dark Mode
              </span>
              <div
                style={{
                  width: "48px",
                  height: "28px",
                  backgroundColor: isDarkMode ? "#3B82F6" : "#D1D5DB",
                  borderRadius: "14px",
                  position: "relative",
                  transition: "background-color 0.3s",
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
                    left: isDarkMode ? "22px" : "2px",
                    transition: "left 0.3s",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            </button>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="settings-section">
          <h3 className="section-title">Payment Methods</h3>
          {paymentMethods.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px 20px",
                backgroundColor: "var(--card-bg)",
                borderRadius: "12px",
                border: "1px solid var(--border-color)",
              }}
            >
              <IoCardOutline size={48} style={{ color: "var(--text-muted)", marginBottom: "12px" }} />
              <p style={{ color: "var(--text-muted)", margin: 0 }}>No payment methods added</p>
              <button
                onClick={() => navigate("/payments")}
                style={{
                  marginTop: "16px",
                  padding: "10px 20px",
                  backgroundColor: "#3B82F6",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Add Payment Method
              </button>
            </div>
          ) : (
            <div className="settings-list">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="payment-card-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "14px",
                    backgroundColor: "var(--card-bg)",
                    borderRadius: "12px",
                    marginBottom: "10px",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <IoCardOutline size={24} style={{ color: "var(--text-muted)", marginRight: "12px" }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: "500", color: "var(--text-primary)" }}>
                      {method.type} •••• {method.last4}
                    </p>
                    <p
                      style={{
                        margin: "4px 0 0 0",
                        fontSize: "13px",
                        color: "var(--text-muted)",
                      }}
                    >
                      {method.expiry !== "N/A" ? `Expires ${method.expiry}` : "Digital Wallet"}
                    </p>
                  </div>
                  <button
                    onClick={() => removePaymentMethod(method.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "8px",
                      borderRadius: "6px",
                      color: "var(--text-muted)",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <IoCloseOutline size={20} />
                  </button>
                </div>
              ))}
              <button
                className="settings-item"
                onClick={() => navigate("/payments")}
                style={{
                  marginTop: "8px",
                  justifyContent: "center",
                  border: "2px dashed var(--border-color)",
                }}
              >
                <span className="settings-item-content">
                  <IoCardOutline size={20} />
                  Add New Payment Method
                </span>
                <IoChevronForward size={20} />
              </button>
            </div>
          )}
        </section>

        {/* Other Settings */}
        <section className="settings-section">
          <h3 className="section-title">Preferences</h3>
          <div className="settings-list">
            <div 
              className="settings-item" 
              style={{ 
                opacity: 0.5, 
                cursor: "not-allowed",
                pointerEvents: "none"
              }}
            >
              <span className="settings-item-content">
                <IoNotificationsOutline size={20} />
                Notifications
              </span>
              <IoChevronForward size={20} />
            </div>
            <div 
              className="settings-item" 
              style={{ 
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

        {/* Account Info */}
        <section className="settings-section">
          <h3 className="section-title">Account</h3>
          <div className="settings-list">
            <button className="settings-item" onClick={() => navigate("/profile/edit")}>
              <span className="settings-item-content">
                Edit Profile
              </span>
              <IoChevronForward size={20} />
            </button>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

