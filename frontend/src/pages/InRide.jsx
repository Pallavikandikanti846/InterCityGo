import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack, IoLocationOutline, IoTimeOutline, IoCallOutline } from "react-icons/io5";
import GoogleMap from "../components/GoogleMap";

export default function InRide() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock ride data
  const rideData = {
    destination: "123 Main St, San Francisco",
    eta: "10:30 AM",
    passengerName: "Sophia Bennett",
    passengerPhone: "+1 (555) 123-4567",
  };

  const handleCompleteRide = () => {
    // TODO: Implement complete ride API call
    console.log("Completing ride:", id);
    navigate("/driver/dashboard");
  };

  const handleContactPassenger = () => {
    // TODO: Implement contact passenger (call/SMS)
    window.location.href = `tel:${rideData.passengerPhone}`;
  };

  return (
    <div className="page" style={{ padding: 0, position: "relative", height: "100vh", overflow: "hidden" }}>
      <header className="header" style={{ 
        backgroundColor: "rgba(31, 41, 55, 0.95)", 
        backdropFilter: "blur(10px)",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        borderBottom: "1px solid #374151",
      }}>
        <button className="back-btn" onClick={() => navigate("/driver/dashboard")} style={{ color: "#F9FAFB" }}>
          <IoArrowBack size={24} />
        </button>
        <h1 className="page-title" style={{ color: "#F9FAFB" }}>In Ride</h1>
        <div style={{ width: "24px" }}></div>
      </header>

      {/* Map Section */}
      <div style={{ position: "relative", height: "100vh", width: "100%", paddingTop: "56px" }}>
        <GoogleMap height="calc(100% - 56px)" showUserLocation={true} />
      </div>

      {/* Ride Information Card */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#1F2937",
        borderTopLeftRadius: "20px",
        borderTopRightRadius: "20px",
        padding: "20px",
        paddingBottom: "30px",
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.3)",
        maxWidth: "430px",
        margin: "0 auto",
      }}>
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
            <IoLocationOutline size={20} style={{ color: "#EF4444", marginTop: "2px" }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: "13px", color: "#9CA3AF", marginBottom: "4px" }}>
                Destination
              </p>
              <p style={{ margin: 0, fontSize: "15px", fontWeight: "500", color: "#F9FAFB" }}>
                {rideData.destination}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <IoTimeOutline size={20} style={{ color: "#3B82F6", marginTop: "2px" }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: "13px", color: "#9CA3AF", marginBottom: "4px" }}>
                ETA
              </p>
              <p style={{ margin: 0, fontSize: "15px", fontWeight: "500", color: "#F9FAFB" }}>
                {rideData.eta}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={handleContactPassenger}
            style={{
              padding: "12px",
              border: "none",
              borderRadius: "10px",
              backgroundColor: "transparent",
              color: "#60A5FA",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <IoCallOutline size={20} />
            Contact Passenger
          </button>
          <button
            onClick={handleCompleteRide}
            style={{
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              backgroundColor: "#3B82F6",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Complete Ride
          </button>
        </div>
      </div>
    </div>
  );
}

