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

  signup: async (userData, isFormData = false) => {
    const headers = isFormData ? {} : { "Content-Type": "application/json" };
    const body = isFormData ? userData : JSON.stringify(userData);
    
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers,
      body,
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

  createTrip: async (tripData) => {
    const res = await fetch(`${API_BASE_URL}/trips`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(tripData),
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

  // User Profile
  getProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  updateProfile: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(userData),
    });
    return res.json();
  },

  // Driver Earnings
  getDriverEarnings: async () => {
    const res = await fetch(`${API_BASE_URL}/driver/earnings`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  // Driver Pending Requests
  getDriverPendingRequests: async () => {
    const res = await fetch(`${API_BASE_URL}/driver/pending-requests`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  // Driver Booking Details
  getDriverBooking: async (bookingId) => {
    const res = await fetch(`${API_BASE_URL}/driver/booking/${bookingId}`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  // Accept Driver Booking
  acceptDriverBooking: async (bookingId) => {
    const res = await fetch(`${API_BASE_URL}/driver/booking/${bookingId}/accept`, {
      method: "POST",
      headers: getAuthHeader(),
    });
    return res.json();
  },

  // Decline Driver Booking
  declineDriverBooking: async (bookingId) => {
    const res = await fetch(`${API_BASE_URL}/driver/booking/${bookingId}/decline`, {
      method: "POST",
      headers: getAuthHeader(),
    });
    return res.json();
  },
};

