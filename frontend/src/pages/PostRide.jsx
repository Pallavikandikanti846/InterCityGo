import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  IoArrowBack, 
  IoLocationOutline, 
  IoCalendarOutline, 
  IoTimeOutline,
  IoPeopleOutline
} from "react-icons/io5";
import LocationSearchInput from "../components/LocationSearchInput";
import { api } from "../utils/api";

export default function PostRide() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    startingLocation: "",
    destination: "",
    departureDate: "",
    departureTime: "",
    numberOfSeats: "0",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLocationChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const parseLocation = (locationString) => {
    // LocationSearchInput returns "City, Province" format
    // We need to convert to { address, city, province } format
    const parts = locationString.split(",").map(s => s.trim());
    
    if (parts.length >= 2) {
      return {
        address: locationString,
        city: parts[0],
        province: parts[1]
      };
    } else {
      return {
        address: locationString,
        city: locationString,
        province: ""
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.startingLocation || !formData.destination || !formData.departureDate || !formData.departureTime) {
        setError("All fields are required");
        setLoading(false);
        return;
      }

      const tripData = {
        pickupLocation: parseLocation(formData.startingLocation),
        dropoffLocation: parseLocation(formData.destination),
        date: new Date(`${formData.departureDate}T${formData.departureTime}`),
        time: formData.departureTime,
        rideType: "pooling",
        availableSeats: parseInt(formData.numberOfSeats) || 0,
      };

      const result = await api.createTrip(tripData);
      
      if (result.message) {
        // Success - navigate back to dashboard
        navigate("/driver/dashboard");
      } else {
        throw new Error(result.message || "Failed to create trip");
      }
    } catch (err) {
      setError(err.message || "Failed to post ride");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page driver-page" style={{ backgroundColor: "#1F2937", color: "#F9FAFB", minHeight: "100vh" }}>
      <header className="header" style={{ backgroundColor: "#1F2937", borderBottom: "1px solid #374151" }}>
        <button className="back-btn" onClick={() => navigate("/driver/dashboard")} style={{ color: "#F9FAFB" }}>
          <IoArrowBack size={24} />
        </button>
        <h1 className="page-title" style={{ color: "#F9FAFB" }}>Post a Ride</h1>
        <div style={{ width: "24px" }}></div>
      </header>

      <main className="content" style={{ backgroundColor: "#111827", paddingBottom: "30px" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Starting Location */}
          <div>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#F9FAFB",
            }}>
              <IoLocationOutline size={18} color="#F9FAFB" />
              Starting Location
            </label>
            <LocationSearchInput
              placeholder="Enter starting location"
              value={formData.startingLocation}
              onChange={(value) => handleLocationChange("startingLocation", value)}
              icon={IoLocationOutline}
            />
          </div>

          {/* Destination */}
          <div>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#F9FAFB",
            }}>
              <IoLocationOutline size={18} color="#F9FAFB" />
              Destination
            </label>
            <LocationSearchInput
              placeholder="Enter destination"
              value={formData.destination}
              onChange={(value) => handleLocationChange("destination", value)}
              icon={IoLocationOutline}
            />
          </div>

          {/* Departure Date */}
          <div>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#F9FAFB",
            }}>
              <IoCalendarOutline size={18} color="#F9FAFB" />
              Departure Date
            </label>
            <input
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
              required
              className="input"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #374151",
                borderRadius: "10px",
                fontSize: "15px",
                backgroundColor: "#1F2937",
                color: "#F9FAFB",
              }}
            />
          </div>

          {/* Departure Time */}
          <div>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#F9FAFB",
            }}>
              <IoTimeOutline size={18} color="#F9FAFB" />
              Departure Time
            </label>
            <input
              type="time"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
              required
              className="input"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #374151",
                borderRadius: "10px",
                fontSize: "15px",
                backgroundColor: "#1F2937",
                color: "#F9FAFB",
              }}
            />
          </div>

          {/* Number of Seats */}
          <div>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#F9FAFB",
            }}>
              <IoPeopleOutline size={18} color="#F9FAFB" />
              Number of Seats
            </label>
            <input
              type="number"
              name="numberOfSeats"
              value={formData.numberOfSeats}
              onChange={handleChange}
              required
              min="0"
              max="8"
              className="input"
              placeholder="Enter number of seats"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #374151",
                borderRadius: "10px",
                fontSize: "15px",
                backgroundColor: "#1F2937",
                color: "#F9FAFB",
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: "12px 16px",
              borderRadius: "8px",
              backgroundColor: "#7F1D1D",
              color: "#FCA5A5",
              fontSize: "14px",
              marginTop: "8px",
              textAlign: "center"
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              marginTop: "8px",
              padding: "14px",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            {loading ? "Posting..." : "Post Ride"}
          </button>
        </form>
      </main>
    </div>
  );
}

