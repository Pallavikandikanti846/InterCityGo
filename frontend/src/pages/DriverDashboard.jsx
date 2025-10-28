import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  IoCarSportOutline, 
  IoAddCircleOutline,
  IoEyeOutline,
  IoPersonCircleOutline
} from "react-icons/io5";
import DriverBottomNav from "../components/DriverBottomNav";
import { api } from "../utils/api";

export default function DriverDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingRequests(true); // Initial load with loading state
    // Refresh requests every 10 seconds
    const interval = setInterval(() => {
      fetchPendingRequests(false); // Background refresh without loading state
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchPendingRequests = async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      }
      const data = await api.getDriverPendingRequests();
      
      if (data.success && data.requests) {
        setPendingRequests(data.requests);
      } else {
        setPendingRequests([]);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      setPendingRequests([]);
    } finally {
      if (isInitial) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="page driver-page" style={{ backgroundColor: "#1F2937", color: "#F9FAFB", minHeight: "100vh" }}>
      <header className="header" style={{ backgroundColor: "#1F2937", borderBottom: "1px solid #374151" }}>
        <div style={{ width: "24px" }}></div>
        <h1 className="page-title" style={{ color: "#F9FAFB" }}>Dashboard</h1>
        <div style={{ width: "24px" }}></div>
      </header>

      <main className="content" style={{ backgroundColor: "#111827" }}>
        {/* Driver Profile Section */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "20px",
          backgroundColor: "#1F2937",
          borderRadius: "12px",
          marginBottom: "24px",
          border: "1px solid #374151",
        }}>
          <IoPersonCircleOutline size={60} style={{ color: "#3B82F6" }} />
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#F9FAFB" }}>
              {user?.name || "Ethan Carter"}
            </h2>
            <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#9CA3AF" }}>
              Driver
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
              <div style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: isOnline ? "#10B981" : "#EF4444",
              }}></div>
              <span style={{ fontSize: "13px", color: "#9CA3AF" }}>
                {isOnline ? "Online" : "Offline"}
              </span>
              <button
                onClick={() => setIsOnline(!isOnline)}
                style={{
                  marginLeft: "auto",
                  padding: "4px 12px",
                  fontSize: "12px",
                  border: "1px solid #374151",
                  borderRadius: "6px",
                  background: "#374151",
                  color: "#F9FAFB",
                  cursor: "pointer",
                }}
              >
                {isOnline ? "Go Offline" : "Go Online"}
              </button>
            </div>
          </div>
        </div>

        {/* Pending Requests Section */}
        <div style={{ marginBottom: "24px" }}>
          <h3 className="section-title" style={{ color: "#F9FAFB" }}>Pending Requests</h3>
          {loading ? (
            <p style={{ color: "#9CA3AF", textAlign: "center", padding: "20px" }}>
              Loading...
            </p>
          ) : pendingRequests.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "32px 20px",
              backgroundColor: "#1F2937",
              borderRadius: "12px",
              border: "1px solid #374151",
            }}>
              <IoCarSportOutline size={48} style={{ color: "#60A5FA", marginBottom: "12px", opacity: 0.5 }} />
              <p style={{ color: "#9CA3AF", margin: 0 }}>
                No pending requests
              </p>
              <p style={{ color: "#6B7280", fontSize: "13px", marginTop: "4px" }}>
                Bookings will appear here when passengers request your rides
              </p>
            </div>
          ) : (
            pendingRequests.map((request) => (
              <div
                key={request.id}
                onClick={() => navigate(`/driver/ride-request/${request.bookingId}`)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px",
                  backgroundColor: "#1F2937",
                  borderRadius: "12px",
                  marginBottom: "12px",
                  border: "1px solid #374151",
                  cursor: "pointer",
                }}
              >
                <IoCarSportOutline size={40} style={{ color: "#60A5FA" }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#F9FAFB" }}>
                    {request.time} • {request.route}
                  </p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#9CA3AF" }}>
                    {request.passenger?.name || "Passenger"} • ${request.fare?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="section-title" style={{ color: "#F9FAFB" }}>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              onClick={() => navigate("/driver/post-ride")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px",
                backgroundColor: "#3B82F6",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              <IoAddCircleOutline size={24} />
              Post a Ride
            </button>
            <button
              onClick={() => navigate("/driver/earnings")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px",
                backgroundColor: "#3B82F6",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              <IoEyeOutline size={24} />
              View Earnings
            </button>
          </div>
        </div>
      </main>

      <DriverBottomNav />
    </div>
  );
}
