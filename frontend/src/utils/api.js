// API utility functions
const API_BASE_URL = "http://localhost:8888/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Auth
  login: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return res.json();
  },

  signup: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return res.json();
  },

  // Trips
  searchTrips: async (searchParams) => {
    const res = await fetch(`${API_BASE_URL}/trips/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(searchParams),
    });
    return res.json();
  },

  getTripDetails: async (tripId) => {
    const res = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  bookTrip: async (tripId) => {
    const res = await fetch(`${API_BASE_URL}/trips/${tripId}/book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
    return res.json();
  },

  getPoolDetails: async (tripId) => {
    const res = await fetch(`${API_BASE_URL}/trips/${tripId}/pool`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  // Bookings
  getMyTrips: async () => {
    const res = await fetch(`${API_BASE_URL}/bookings/my-trips`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  getBookingDetails: async (bookingId) => {
    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  cancelBooking: async (bookingId) => {
    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: "PUT",
      headers: getAuthHeader(),
    });
    return res.json();
  },
};

