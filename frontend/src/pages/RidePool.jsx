import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoPersonCircleOutline, IoMapOutline } from "react-icons/io5";
import BottomNav from "../components/BottomNav";

export default function RidePool() {
  const navigate = useNavigate();

  const coPassengers = [
    { name: "Sarah M.", pickupTime: "10:15AM" },
    { name: "David L.", pickupTime: "10:30AM" },
  ];

  const privateFare = 45.0;
  const poolFare = 25.0;
  const savings = privateFare - poolFare;

  const handleBookPool = () => {
    alert("Ride pool booked successfully!");
    navigate("/trips");
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
            <p className="map-title">Toronto → Montreal</p>
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

