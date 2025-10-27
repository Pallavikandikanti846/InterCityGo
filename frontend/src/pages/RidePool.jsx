import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoPersonCircleOutline, IoMapOutline } from "react-icons/io5";
import BottomNav from "../components/BottomNav";

export default function RidePool() {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("searchData");
    if (data) {
      setSearchData(JSON.parse(data));
    }
  }, []);

  // Default co-passengers for now
  const coPassengers = [
    { name: "Sarah M.", pickupTime: "10:15AM" },
    { name: "David L.", pickupTime: "10:30AM" },
  ];

  // Calculate fares based on the search data
  const PRIVATE_RIDE_PER_KM = 2.15;
  const POOLING_DISCOUNT = 0.35;
  const BASE_DISTANCE_KM = 50;
  const BASE_TAXES_FEES = 10.0;

  const estimatedDistance = BASE_DISTANCE_KM;
  const privateFare = (estimatedDistance * PRIVATE_RIDE_PER_KM) + BASE_TAXES_FEES;
  const poolFare = (estimatedDistance * PRIVATE_RIDE_PER_KM * POOLING_DISCOUNT) + BASE_TAXES_FEES;
  const savings = privateFare - poolFare;

  const handleBookPool = () => {
    navigate("/payments");
  };

  return (
    <div className="page">
      <header className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <IoArrowBack size={24} />
        </button>
        <h1 className="page-title">Ride Pool</h1>
        <div style={{ width: "24px" }}></div>
      </header>

      <main className="content">
        {searchData?.womenOnly && (
          <div style={{ 
            margin: '15px 20px', 
            padding: '12px', 
            backgroundColor: '#fef3c7', 
            borderRadius: '8px', 
            border: '1px solid #fbbf24',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, color: '#92400e', fontSize: '14px', fontWeight: '500' }}>
              👥 Women-Only Pooling
            </p>
          </div>
        )}

        <section className="pool-section">
          <h2 className="section-title">Potential Co-Passengers</h2>
          {coPassengers.map((passenger, index) => (
            <div key={index} className="passenger-card">
              <IoPersonCircleOutline className="passenger-avatar" />
              <div className="passenger-info">
                <p className="passenger-name">{passenger.name}</p>
                <p className="passenger-pickup">Pickup {passenger.pickupTime}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="pool-section">
          <h2 className="section-title">Route Overview</h2>
          <div className="map-placeholder">
            <IoMapOutline size={64} color="#94A3B8" />
            <p className="map-title">
              {searchData 
                ? `${searchData.pickupLocation || "Pickup"} → ${searchData.dropoffLocation || "Dropoff"}` 
                : "Route map"}
            </p>
            <p className="map-note">Detailed route map</p>
          </div>
        </section>

        <section className="pool-section">
          <h2 className="section-title">Cost Savings</h2>
          <div className="savings-card">
            <div className="savings-row">
              <span>Private Ride</span>
              <span>${privateFare.toFixed(2)}</span>
            </div>
            <div className="savings-row pool-price">
              <span>Ride Pool</span>
              <span className="highlight">${poolFare.toFixed(2)}</span>
            </div>
            <div className="savings-divider"></div>
            <p className="savings-note">
              You'll save approximately ${savings.toFixed(2)} by pooling
            </p>
          </div>
        </section>

        <button className="btn btn-primary" onClick={handleBookPool}>
          Book Ride Pool
        </button>
      </main>

      <BottomNav />
    </div>
  );
}

