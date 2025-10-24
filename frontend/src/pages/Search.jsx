import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearchOutline, IoSettingsOutline, IoCalendarOutline, IoLocationOutline, IoArrowBack } from "react-icons/io5";
import BottomNav from "../components/BottomNav";
import LocationSearchInput from "../components/LocationSearchInput";
import { cityImages, cityColors } from "../assets/cities";

export default function Search() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    date: "",
    rideType: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLocationChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRideTypeChange = (type) => {
    setFormData((prev) => ({ ...prev, rideType: type }));
  };

  const handleSearch = () => {
    // Validate that ride type is selected
    if (!formData.rideType) {
      alert("Please select a ride option");
      return;
    }
    if (!formData.pickupLocation || !formData.dropoffLocation || !formData.date) {
      alert("Please fill in all fields");
      return;
    }
    // Store search data and navigate to review
    localStorage.setItem("searchData", JSON.stringify(formData));
    navigate("/review");
  };

  const recentDestinations = [
    { 
      name: "Montreal", 
      gradient: cityImages.montreal,
      color: cityColors.montreal 
    },
    { 
      name: "Ottawa", 
      gradient: cityImages.ottawa,
      color: cityColors.ottawa 
    },
    { 
      name: "Quebec", 
      gradient: cityImages.quebec,
      color: cityColors.quebec 
    },
  ];

  return (
    <div className="page">
      <header className="header">
        <button className="back-btn" onClick={() => navigate("/home")}>
          <IoArrowBack size={24} />
        </button>
        <h1 className="page-title">Search Ride</h1>
        <button className="settings-btn">
          <IoSettingsOutline size={24} />
        </button>
      </header>

      <main className="content">
        <div className="search-form">
          <LocationSearchInput
            value={formData.pickupLocation}
            onChange={(value) => handleLocationChange("pickupLocation", value)}
            placeholder="Pick Up Location"
            type="pickup"
            icon={IoSearchOutline}
          />

          <LocationSearchInput
            value={formData.dropoffLocation}
            onChange={(value) => handleLocationChange("dropoffLocation", value)}
            placeholder="Drop Off Location"
            type="dropoff"
            icon={IoLocationOutline}
          />

          <div className="input-group">
            <IoCalendarOutline className="input-icon" />
            <input
              className="input"
              type="date"
              name="date"
              placeholder="Date And Time"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="ride-options">
          <h2 className="section-title">Ride Options</h2>

          <div
            className={`option-card ${formData.rideType === "private" ? "selected" : ""}`}
            onClick={() => handleRideTypeChange("private")}
          >
            <div className="option-content">
              <h3 className="option-title">Private Ride</h3>
              <p className="option-desc">Your Own car, direct route</p>
            </div>
            <div className={`option-radio ${formData.rideType === "private" ? "checked" : ""}`}>
              {formData.rideType === "private" && <div className="radio-inner"></div>}
            </div>
          </div>

          <div
            className={`option-card ${formData.rideType === "pooling" ? "selected" : ""}`}
            onClick={() => handleRideTypeChange("pooling")}
          >
            <div className="option-content">
              <h3 className="option-title">Ride Pooling</h3>
              <p className="option-desc">Share the ride, save money</p>
            </div>
            <div className={`option-radio ${formData.rideType === "pooling" ? "checked" : ""}`}>
              {formData.rideType === "pooling" && <div className="radio-inner"></div>}
            </div>
          </div>

          <div
            className={`option-card ${formData.rideType === "women-only" ? "selected" : ""}`}
            onClick={() => handleRideTypeChange("women-only")}
          >
            <div className="option-content">
              <h3 className="option-title">Women-Only Ride</h3>
              <p className="option-desc">Travel with women riders</p>
            </div>
            <div className={`option-radio ${formData.rideType === "women-only" ? "checked" : ""}`}>
              {formData.rideType === "women-only" && <div className="radio-inner"></div>}
            </div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleSearch}>
          Book Ride
        </button>

        <div className="recently-booked">
          <h2 className="section-title">Recently Booked</h2>
          <div className="destination-grid">
            {recentDestinations.map((dest) => (
              <div key={dest.name} className="destination-card">
                <div 
                  className="destination-image" 
                  style={{ 
                    background: dest.gradient,
                    backgroundColor: dest.color
                  }}
                >
                  <span className="city-initial">{dest.name.charAt(0)}</span>
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

