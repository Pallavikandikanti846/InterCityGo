import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoCarSportOutline, IoChevronForward } from "react-icons/io5";
import BottomNav from "../components/BottomNav";
import { api } from "../utils/api";

// Import city images from assets folder
import montrealImg from "../Images/montreal.jpg";
import ottawaImg from "../Images/ottawa.jpg";
import quebecImg from "../Images/quebec.jpg";

export default function MyTrips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);

  // Function to get city image based on city name
  const getCityImage = (cityName) => {
    const city = cityName.toLowerCase();
    switch (city) {
      case 'montreal':
        return montrealImg;
      case 'ottawa':
        return ottawaImg;
      case 'quebec':
        return quebecImg;
      default:
        return null;
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const data = await api.getMyTrips();
      setTrips(data);
    } catch (error) {
      console.error("Failed to fetch trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading">Loading trips...</div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="page">
      <header className="header">
        <h1 className="page-title">My Trips</h1>
      </header>

      <main className="content">
        <section className="trips-section">
          <h2 className="section-title">Upcoming</h2>
          {trips.upcoming.length === 0 ? (
            <p className="empty-state">No upcoming trips</p>
          ) : (
            trips.upcoming.map((booking) => {
              const pickupImage = getCityImage(booking.trip.pickupLocation.city);
              const dropoffImage = getCityImage(booking.trip.dropoffLocation.city);
              
              return (
                <div key={booking._id} className="trip-card upcoming">
                  <div className="trip-image-container">
                    {pickupImage ? (
                      <img 
                        src={pickupImage} 
                        alt={booking.trip.pickupLocation.city}
                        className="trip-city-image"
                      />
                    ) : (
                      <IoCarSportOutline className="trip-icon" />
                    )}
                  </div>
                  <div className="trip-details">
                    <p className="trip-date">
                      {formatDate(booking.trip.date)} - {booking.trip.time}
                    </p>
                    <p className="trip-route">
                      {booking.trip.pickupLocation.city} to{" "}
                      {booking.trip.dropoffLocation.city}
                    </p>
                  </div>
                  <button
                    className="view-btn active"
                    onClick={() => navigate(`/booking/${booking._id}`)}
                  >
                    View <IoChevronForward />
                  </button>
                </div>
              );
            })
          )}
        </section>

        <section className="trips-section">
          <h2 className="section-title">Past</h2>
          {trips.past.length === 0 ? (
            <p className="empty-state">No past trips</p>
          ) : (
            trips.past.map((booking) => {
              const pickupImage = getCityImage(booking.trip.pickupLocation.city);
              const dropoffImage = getCityImage(booking.trip.dropoffLocation.city);
              
              return (
                <div key={booking._id} className="trip-card past">
                  <div className="trip-image-container">
                    {pickupImage ? (
                      <img 
                        src={pickupImage} 
                        alt={booking.trip.pickupLocation.city}
                        className="trip-city-image"
                      />
                    ) : (
                      <IoCarSportOutline className="trip-icon" />
                    )}
                  </div>
                  <div className="trip-details">
                    <p className="trip-date">
                      {formatDate(booking.trip.date)} - {booking.trip.time}
                    </p>
                    <p className="trip-route">
                      {booking.trip.pickupLocation.city} to{" "}
                      {booking.trip.dropoffLocation.city}
                    </p>
                  </div>
                  <button
                    className="view-btn"
                    onClick={() => navigate(`/booking/${booking._id}`)}
                  >
                    View <IoChevronForward />
                  </button>
                </div>
              );
            })
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

