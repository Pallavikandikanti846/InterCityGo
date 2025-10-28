import { useNavigate } from "react-router-dom";
import { IoSearchOutline, IoSettingsOutline } from "react-icons/io5";
import BottomNav from "../components/BottomNav";
import GoogleMap from "../components/GoogleMap";

// Import city images from assets folder
import montrealImg from "../Images/montreal.jpg";
import ottawaImg from "../Images/ottawa.jpg";
import quebecImg from "../Images/quebec.jpg";

export default function Home() {
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate("/search");
  };

  const recentDestinations = [
    { 
      name: "Montreal", 
      image: montrealImg,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#667eea"
    },
    { 
      name: "Ottawa", 
      image: ottawaImg,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      color: "#f093fb"
    },
    { 
      name: "Quebec", 
      image: quebecImg,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      color: "#4facfe"
    },
  ];

  return (
    <div className="page">
      <header className="header">
        <h1 className="logo" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>InterCityGo</h1>
        <button className="settings-btn" onClick={() => navigate("/settings")}>
          <IoSettingsOutline size={24} />
        </button>
      </header>

      <main className="content home-content">
        {/* Where to? Search Box - Clickable */}
        <div className="where-to-search" onClick={handleSearchClick}>
          <IoSearchOutline className="where-to-icon" />
          <span className="where-to-text">Where to ?</span>
        </div>

        {/* Google Map with User Location */}
        <div className="map-container">
          <GoogleMap height="280px" showUserLocation={true} />
        </div>

        {/* Recently Booked */}
        <div className="recently-booked home-recently-booked">
          <h2 className="section-title">Book to Provinces</h2>
          <div className="destination-grid">
            {recentDestinations.map((dest) => (
              <div 
                key={dest.name} 
                className="destination-card"
              >
                <div 
                  className="destination-image" 
                  style={{ 
                    backgroundImage: dest.image ? `url(${dest.image})` : dest.gradient,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: dest.color
                  }}
                >
                  {!dest.image && (
                    <span className="city-initial">{dest.name.charAt(0)}</span>
                  )}
                </div>
                <p className="destination-name">{dest.name}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

