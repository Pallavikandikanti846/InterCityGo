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
      const parsedData = JSON.parse(data);
      setSearchData(parsedData);
    } else {
      navigate("/search");
    }
  }, [navigate]);

  if (!searchData) return null;

  // Pricing constants (per kilometer in CAD)
  const PRIVATE_RIDE_PER_KM = 2.15; // Similar to Uber/Lyft average
  const POOLING_DISCOUNT = 0.35; // 35% discount for pooling
  const BASE_DISTANCE_KM = 50; // Estimated average distance for intercity rides
  const BASE_TAXES_FEES = 10.0;

  // Calculate distance (simplified - in a real app, you'd use Google Maps Distance Matrix API)
  // For now, we'll use a base distance
  const estimatedDistance = BASE_DISTANCE_KM;

  // Calculate base fare based on ride type
  const calculateFare = () => {
    let baseFare;
    
    if (searchData.rideType === "pooling") {
      // Pooling: discounted rate
      baseFare = estimatedDistance * PRIVATE_RIDE_PER_KM * POOLING_DISCOUNT;
    } else {
      // Private or Women-only: full rate
      baseFare = estimatedDistance * PRIVATE_RIDE_PER_KM;
    }
    
    return baseFare;
  };

  const baseFare = calculateFare();
  const taxesAndFees = BASE_TAXES_FEES;
  const total = baseFare + taxesAndFees;

  const handleConfirm = () => {
    if (searchData.rideType === "pooling") {
      navigate("/ride-pool");
    } else {
      // Navigate to payments for private rides
      navigate("/payments");
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
                {(() => {
                  if (!searchData.date) {
                    return "Not specified";
                  }
                  
                  // Simple and robust date parsing
                  let date;
                  try {
                    // For YYYY-MM-DD format, add time to avoid timezone issues
                    if (searchData.date.includes('-') && searchData.date.length === 10) {
                      date = new Date(searchData.date + 'T12:00:00');
                    } else {
                      date = new Date(searchData.date);
                    }
                    
                    if (isNaN(date.getTime())) {
                      return searchData.date;
                    }
                    
                    // Format the date
                    const formatted = date.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    });
                    
                    return formatted;
                    
                  } catch (error) {
                    return searchData.date;
                  }
                })()}
              </p>
            </div>
            <div>
              <p className="detail-label">Time</p>
              <p className="detail-value">
                {searchData.time 
                  ? new Date(`2000-01-01T${searchData.time}`).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "Not specified"
                }
              </p>
            </div>
          </div>
          <div className="detail-row">
            <p className="detail-label">Ride Type</p>
            <p className="detail-value">
              {searchData.rideType === "private"
                ? "Private Ride"
                : searchData.rideType === "pooling"
                ? (searchData.womenOnly ? "Women-Only Pooling" : "Ride Pooling")
                : "Women-Only Ride"}
            </p>
          </div>
        </div>

        <div className="review-section fare-section">
          <h3 className="fare-title">Fare Details</h3>
          
          {/* Pricing explanation based on ride type */}
          {searchData.rideType === "pooling" && (
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f0f9ff', borderRadius: '5px', fontSize: '14px' }}>
              <p style={{ margin: 0, color: '#0369a1' }}>
                💰 <strong>Pooling Discount:</strong> Save up to 65% by sharing your ride with others!
                {searchData.womenOnly && (
                  <span style={{ display: 'block', marginTop: '5px' }}>
                    👥 <strong>Women-Only:</strong> Travel with women passengers only
                  </span>
                )}
              </p>
            </div>
          )}
          
          {searchData.rideType === "women-only" && (
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fef3c7', borderRadius: '5px', fontSize: '14px' }}>
              <p style={{ margin: 0, color: '#92400e' }}>
                👥 <strong>Women-Only Option:</strong> Travel comfortably with women passengers only (Private or Pooling rates apply)
              </p>
            </div>
          )}
          
          <div className="fare-row">
            <span>
              Base Fare 
              <span style={{ fontSize: '12px', color: '#6B7280', marginLeft: '5px' }}>
                ({estimatedDistance} km @ ${PRIVATE_RIDE_PER_KM.toFixed(2)}/km
                {searchData.rideType === "pooling" && ` with 65% off`})
              </span>
            </span>
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

