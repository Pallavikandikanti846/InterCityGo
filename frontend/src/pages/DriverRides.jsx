import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoCarSportOutline } from "react-icons/io5";
import DriverBottomNav from "../components/DriverBottomNav";

export default function DriverRides() {
  const navigate = useNavigate();

  return (
    <div className="page driver-page" style={{ backgroundColor: "#1F2937", color: "#F9FAFB", minHeight: "100vh" }}>
      <header className="header" style={{ backgroundColor: "#1F2937", borderBottom: "1px solid #374151" }}>
        <button className="back-btn" onClick={() => navigate("/driver/dashboard")} style={{ color: "#F9FAFB" }}>
          <IoArrowBack size={24} />
        </button>
        <h1 className="page-title" style={{ color: "#F9FAFB" }}>My Rides</h1>
        <div style={{ width: "24px" }}></div>
      </header>

      <main className="content" style={{ backgroundColor: "#111827", paddingBottom: "90px" }}>
        <div style={{
          textAlign: "center",
          padding: "40px 20px",
        }}>
          <IoCarSportOutline size={80} style={{ color: "#60A5FA", marginBottom: "16px" }} />
          <h2 style={{ marginBottom: "8px", color: "#F9FAFB" }}>My Rides</h2>
          <p style={{ color: "#9CA3AF", fontSize: "14px" }}>
            View your ride history and manage your posted trips
          </p>
        </div>
      </main>

      <DriverBottomNav />
    </div>
  );
}

