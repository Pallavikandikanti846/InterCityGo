import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoEllipseSharp } from "react-icons/io5";
import BottomNav from "../components/BottomNav";

export default function Review() {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("searchData");
    if (data) {
      setSearchData(JSON.parse(data));
    } else {
      navigate("/search");
    }
  }, [navigate]);

  if (!searchData) return null;

  const baseFare = 110.0;
  const taxesAndFees = 10.0;
  const total = baseFare + taxesAndFees;

  const handleConfirm = () => {
    if (searchData.rideType === "pooling") {
      navigate("/ride-pool");
    } else {
      // Book the trip directly
      alert("Booking confirmed!");
      navigate("/trips");
    }
  };

  return (
    <div className="page">
      <header className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <IoArrowBack size={24} />
        </button>
        <h1 className="page-title">Review Your Ride</h1>
        <div style={{ width: "24px" }}></div>
      </header>

      <main className="content review-content">
        <div className="review-section">
          <div className="location-row">
            <IoEllipseSharp className="location-icon" color="#3B82F6" />
            <div>
              <p className="location-label">PICKUP</p>
              <p className="location-address">{searchData.pickupLocation}</p>
            </div>
          </div>
          <div className="location-row">
            <IoEllipseSharp className="location-icon" color="#3B82F6" />
            <div>
              <p className="location-label">DROPOFF</p>
              <p className="location-address">{searchData.dropoffLocation}</p>
            </div>
          </div>
        </div>

        <div className="review-section">
          <div className="detail-row">
            <div>
              <p className="detail-label">Date</p>
              <p className="detail-value">
                {new Date(searchData.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="detail-label">Time</p>
              <p className="detail-value">10:00 AM</p>
            </div>
          </div>
          <div className="detail-row">
            <p className="detail-label">Ride Type</p>
            <p className="detail-value">
              {searchData.rideType === "private"
                ? "Private Ride"
                : searchData.rideType === "pooling"
                ? "Ride Pooling"
                : "Women-Only Ride"}
            </p>
          </div>
        </div>

        <div className="review-section fare-section">
          <h3 className="fare-title">Fare Details</h3>
          <div className="fare-row">
            <span>Base Fare</span>
            <span>${baseFare.toFixed(2)}</span>
          </div>
          <div className="fare-row">
            <span>Taxes & Fees</span>
            <span>${taxesAndFees.toFixed(2)}</span>
          </div>
          <div className="fare-divider"></div>
          <div className="fare-row total">
            <strong>Total</strong>
            <strong>${total.toFixed(2)}</strong>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleConfirm}>
          Confirm Booking
        </button>
      </main>

      <BottomNav />
    </div>
  );
}

