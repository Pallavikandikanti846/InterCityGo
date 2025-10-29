const API_BASE_URL = "http://localhost:8888/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
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

  deleteAccount: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/account`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });
    return res.json();
  },

  getDriverEarnings: async () => {
    const res = await fetch(`${API_BASE_URL}/driver/earnings`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  getDriverPendingRequests: async () => {
    const res = await fetch(`${API_BASE_URL}/driver/pending-requests`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  getDriverBooking: async (bookingId) => {
    const res = await fetch(`${API_BASE_URL}/driver/booking/${bookingId}`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  acceptDriverBooking: async (bookingId) => {
    const res = await fetch(`${API_BASE_URL}/driver/booking/${bookingId}/accept`, {
      method: "POST",
      headers: getAuthHeader(),
    });
    return res.json();
  },

  declineDriverBooking: async (bookingId) => {
    const res = await fetch(`${API_BASE_URL}/driver/booking/${bookingId}/decline`, {
      method: "POST",
      headers: getAuthHeader(),
    });
    return res.json();
  },

  adminLogin: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return res.json();
  },

  getAdminStats: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  getRecentActivity: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/activity`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  getAdminDrivers: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/drivers`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  getAdminUsers: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  getAdminDisputes: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/disputes`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  getAdminDisputeDetail: async (disputeId) => {
    const res = await fetch(`${API_BASE_URL}/admin/disputes/${disputeId}`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  sendDisputeMessage: async (disputeId, messageData) => {
    const res = await fetch(`${API_BASE_URL}/admin/disputes/${disputeId}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(messageData),
    });
    return res.json();
  },

  resolveDispute: async (disputeId) => {
    const res = await fetch(`${API_BASE_URL}/admin/disputes/${disputeId}/resolve`, {
      method: "POST",
      headers: getAuthHeader(),
    });
    return res.json();
  },

  escalateDispute: async (disputeId) => {
    const res = await fetch(`${API_BASE_URL}/admin/disputes/${disputeId}/escalate`, {
      method: "POST",
      headers: getAuthHeader(),
    });
    return res.json();
  },
};

