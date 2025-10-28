import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack, IoLocationOutline, IoTimeOutline, IoCashOutline, IoStar } from "react-icons/io5";
import { IoPersonCircleOutline } from "react-icons/io5";
import { api } from "../utils/api";

export default function RideRequest() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchBookingData();
  }, [id]);

  const fetchBookingData = async () => {
    try {
      setFetchLoading(true);
      const data = await api.getDriverBooking(id);
      if (data.success && data.booking) {
        setBookingData(data.booking);
      }
    } catch (error) {
      console.error("Failed to fetch booking:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleAccept = async () => {
    setLoading(true);
    try {
      const data = await api.acceptDriverBooking(id);
      if (data.success) {
        // Navigate to in-ride page
        navigate(`/driver/in-ride/${id}`);
      } else {
        alert(data.message || "Failed to accept ride");
      }
    } catch (error) {
      console.error("Failed to accept ride:", error);
      alert("Failed to accept ride. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    setLoading(true);
    try {
      const data = await api.declineDriverBooking(id);
      if (data.success) {
        // Navigate back to dashboard
        navigate("/driver/dashboard");
      } else {
        alert(data.message || "Failed to decline ride");
      }
    } catch (error) {
      console.error("Failed to decline ride:", error);
      alert("Failed to decline ride. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="page driver-page" style={{ backgroundColor: "#1F2937", color: "#F9FAFB", minHeight: "100vh" }}>
        <header className="header" style={{ backgroundColor: "#1F2937", borderBottom: "1px solid #374151" }}>
          <button className="back-btn" onClick={() => navigate("/driver/dashboard")} style={{ color: "#F9FAFB" }}>
            <IoArrowBack size={24} />
          </button>
          <h1 className="page-title" style={{ color: "#F9FAFB" }}>New Ride Request</h1>
          <div style={{ width: "24px" }}></div>
        </header>
        <main className="content" style={{ backgroundColor: "#111827", padding: "40px 20px", textAlign: "center" }}>
          <p style={{ color: "#9CA3AF" }}>Loading request details...</p>
        </main>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="page driver-page" style={{ backgroundColor: "#1F2937", color: "#F9FAFB", minHeight: "100vh" }}>
        <header className="header" style={{ backgroundColor: "#1F2937", borderBottom: "1px solid #374151" }}>
          <button className="back-btn" onClick={() => navigate("/driver/dashboard")} style={{ color: "#F9FAFB" }}>
            <IoArrowBack size={24} />
          </button>
          <h1 className="page-title" style={{ color: "#F9FAFB" }}>New Ride Request</h1>
          <div style={{ width: "24px" }}></div>
        </header>
        <main className="content" style={{ backgroundColor: "#111827", padding: "40px 20px", textAlign: "center" }}>
          <p style={{ color: "#9CA3AF" }}>Request not found</p>
          <button
            onClick={() => navigate("/driver/dashboard")}
            style={{
              marginTop: "16px",
              padding: "10px 20px",
              backgroundColor: "#3B82F6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Back to Dashboard
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="page driver-page" style={{ backgroundColor: "#1F2937", color: "#F9FAFB", minHeight: "100vh" }}>
      <header className="header" style={{ backgroundColor: "#1F2937", borderBottom: "1px solid #374151" }}>
        <button className="back-btn" onClick={() => navigate("/driver/dashboard")} style={{ color: "#F9FAFB" }}>
          <IoArrowBack size={24} />
        </button>
        <h1 className="page-title" style={{ color: "#F9FAFB" }}>New Ride Request</h1>
        <div style={{ width: "24px" }}></div>
      </header>

      <main className="content" style={{ backgroundColor: "#111827", paddingBottom: "30px" }}>
        {/* Passenger Details */}
        <section style={{ marginBottom: "24px" }}>
          <h3 className="section-title" style={{ color: "#F9FAFB" }}>Passenger Details</h3>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "16px",
            backgroundColor: "#1F2937",
            borderRadius: "12px",
            border: "1px solid #374151",
          }}>
            <IoPersonCircleOutline size={60} style={{ color: "#3B82F6" }} />
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#F9FAFB" }}>
                {bookingData.passenger?.name || "Passenger"}
              </h4>
              {bookingData.passenger?.rating && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                  <IoStar size={16} style={{ color: "#F59E0B" }} />
                  <span style={{ fontSize: "14px", color: "#F9FAFB", fontWeight: "500" }}>
                    {bookingData.passenger.rating}
                  </span>
                  {bookingData.passenger.rides && (
                    <span style={{ fontSize: "13px", color: "#9CA3AF", marginLeft: "4px" }}>
                      • {bookingData.passenger.rides} rides
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Ride Details */}
        <section style={{ marginBottom: "32px" }}>
          <h3 className="section-title" style={{ color: "#F9FAFB" }}>Ride Details</h3>
          <div style={{
            padding: "16px",
            backgroundColor: "#1F2937",
            borderRadius: "12px",
            border: "1px solid #374151",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
              <IoLocationOutline size={20} style={{ color: "#10B981", marginTop: "2px" }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: "13px", color: "#9CA3AF", marginBottom: "4px" }}>
                  Pickup
                </p>
                <p style={{ margin: 0, fontSize: "15px", fontWeight: "500", color: "#F9FAFB" }}>
                  {bookingData.pickupLocation || "Unknown"}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
              <IoLocationOutline size={20} style={{ color: "#EF4444", marginTop: "2px" }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: "13px", color: "#9CA3AF", marginBottom: "4px" }}>
                  Drop-off
                </p>
                <p style={{ margin: 0, fontSize: "15px", fontWeight: "500", color: "#F9FAFB" }}>
                  {bookingData.dropoffLocation || "Unknown"}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
              <IoTimeOutline size={20} style={{ color: "#3B82F6", marginTop: "2px" }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: "13px", color: "#9CA3AF", marginBottom: "4px" }}>
                  Time
                </p>
                <p style={{ margin: 0, fontSize: "15px", fontWeight: "500", color: "#F9FAFB" }}>
                  {bookingData.time || "N/A"}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <IoCashOutline size={20} style={{ color: "#10B981", marginTop: "2px" }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: "13px", color: "#9CA3AF", marginBottom: "4px" }}>
                  Fare
                </p>
                <p style={{ margin: 0, fontSize: "15px", fontWeight: "500", color: "#F9FAFB" }}>
                  ${(bookingData.fare || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleDecline}
            disabled={loading}
            style={{
              flex: 1,
              padding: "14px",
              border: "2px solid #374151",
              borderRadius: "12px",
              backgroundColor: "#1F2937",
              color: "#F9FAFB",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            disabled={loading}
            style={{
              flex: 1,
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              backgroundColor: "#3B82F6",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Processing..." : "Accept"}
          </button>
        </div>
      </main>
    </div>
  );
}

