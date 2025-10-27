import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearchOutline, IoSettingsOutline, IoCalendarOutline, IoLocationOutline, IoArrowBack } from "react-icons/io5";
import BottomNav from "../components/BottomNav";
import LocationSearchInput from "../components/LocationSearchInput";

export default function Search() {
  const navigate = useNavigate();
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    date: "", // Empty by default
    time: "",
    rideType: "",
    womenOnly: false, // New field for women-only option
  });


  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLocationChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRideTypeChange = (type) => {
    setFormData((prev) => ({ 
      ...prev, 
      rideType: type,
      womenOnly: false // Reset women-only when changing ride type
    }));
  };

  const handleWomenOnlyToggle = () => {
    setFormData((prev) => ({ ...prev, womenOnly: !prev.womenOnly }));
  };

  const handleSearch = () => {
    // Validate that ride type is selected
    if (!formData.rideType) {
      alert("Please select a ride option");
      return;
    }
    if (!formData.pickupLocation || !formData.dropoffLocation || !formData.date || !formData.time) {
      alert("Please fill in all fields");
      return;
    }
    // Store search data and navigate based on ride type
    localStorage.setItem("searchData", JSON.stringify(formData));
    
    if (formData.rideType === "pooling") {
      navigate("/ride-pool");
    } else {
      navigate("/review");
    }
  };


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

          <div className="date-time-container">
            <div className="input-group" onClick={() => {
              if (dateInputRef.current) {
                dateInputRef.current.focus();
                dateInputRef.current.click();
                if (dateInputRef.current.showPicker) {
                  dateInputRef.current.showPicker();
                }
              }
            }}>
              <IoCalendarOutline className="input-icon" />
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <input
                  ref={dateInputRef}
                  className="input"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (e.target.showPicker) {
                      e.target.showPicker();
                    }
                  }}
                  onFocus={(e) => {
                    if (e.target.showPicker) {
                      e.target.showPicker();
                    }
                  }}
                  style={{
                    cursor: 'pointer',
                    zIndex: 10,
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    opacity: 0, // Make the actual input invisible
                    backgroundColor: 'transparent'
                  }}
                />
                <div 
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '40px',
                    color: formData.date ? 'inherit' : '#6B7280',
                    fontSize: '16px',
                    pointerEvents: 'none',
                    zIndex: 1
                  }}
                >
                  {formData.date ? new Date(formData.date + 'T00:00:00').toLocaleDateString('en-GB') : 'dd-mm-yyyy'}
                </div>
              </div>
            </div>

            <div className="input-group" onClick={() => {
              if (timeInputRef.current) {
                timeInputRef.current.focus();
                timeInputRef.current.click();
                if (timeInputRef.current.showPicker) {
                  timeInputRef.current.showPicker();
                }
              }
            }}>
              <IoCalendarOutline className="input-icon" />
              <input
                ref={timeInputRef}
                className="input"
                type="time"
                name="time"
                placeholder="hh:mm"
                value={formData.time}
                onChange={handleChange}
                onClick={(e) => {
                  e.stopPropagation();
                  if (e.target.showPicker) {
                    e.target.showPicker();
                  }
                }}
                onFocus={(e) => {
                  if (e.target.showPicker) {
                    e.target.showPicker();
                  }
                }}
                style={{
                  cursor: 'pointer',
                  zIndex: 10,
                  position: 'relative',
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>
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
              <p className="option-desc">Your own car, direct route - Standard pricing</p>
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
              <p className="option-desc">Share the ride, save up to 65%</p>
            </div>
            <div className={`option-radio ${formData.rideType === "pooling" ? "checked" : ""}`}>
              {formData.rideType === "pooling" && <div className="radio-inner"></div>}
            </div>
          </div>

          {/* Women-only option - only show when pooling is selected */}
          {formData.rideType === "pooling" && (
            <div className="women-only-option" style={{ marginTop: '15px', padding: '15px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
              <div 
                className={`option-card ${formData.womenOnly ? "selected" : ""}`}
                onClick={handleWomenOnlyToggle}
                style={{ margin: 0, backgroundColor: 'transparent', border: 'none' }}
              >
                <div className="option-content">
                  <h3 className="option-title" style={{ fontSize: '16px', margin: 0 }}>Women-Only Pooling</h3>
                  <p className="option-desc" style={{ fontSize: '14px', margin: '5px 0 0 0' }}>
                    Travel with women passengers only (optional)
                  </p>
                </div>
                <div className={`option-radio ${formData.womenOnly ? "checked" : ""}`}>
                  {formData.womenOnly && <div className="radio-inner"></div>}
                </div>
              </div>
            </div>
          )}
        </div>

        <button className="btn btn-primary" onClick={handleSearch}>
          Book Ride
        </button>
      </main>

      <BottomNav />
    </div>
  );
}

