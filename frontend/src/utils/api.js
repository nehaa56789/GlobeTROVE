import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("gt_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global response error handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("gt_token");
      localStorage.removeItem("gt_user");
    }
    return Promise.reject(err);
  }
);

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

// ─── Destinations ──────────────────────────────────────────────────────────────
export const destinationsAPI = {
  getAll: (params) => api.get("/destinations", { params }),
  getById: (id) => api.get(`/destinations/${id}`),
  getPopular: () => api.get("/destinations/popular"),
};

// ─── Flights ───────────────────────────────────────────────────────────────────
export const flightsAPI = {
  getAll: (params) => api.get("/flights", { params }),
  getById: (id) => api.get(`/flights/${id}`),
  book: (flightId) => api.post("/flights/book", { flightId }),
};

// ─── Hotels ────────────────────────────────────────────────────────────────────
export const hotelsAPI = {
  getAll: (params) => api.get("/hotels", { params }),
  getById: (id) => api.get(`/hotels/${id}`),
  book: (hotelId, checkIn, checkOut) => api.post("/hotels/book", { hotelId, checkIn, checkOut }),
};

// ─── Bookings ──────────────────────────────────────────────────────────────────
export const bookingsAPI = {
  getMine: () => api.get("/bookings"),
  cancel: (id) => api.delete(`/bookings/${id}`),
};

// ─── Wishlist ──────────────────────────────────────────────────────────────────
export const wishlistAPI = {
  get: () => api.get("/wishlist"),
  toggle: (destId) => api.post(`/wishlist/${destId}`),
};

// ─── Payment ───────────────────────────────────────────────────────────────────
export const paymentAPI = {
  createOrder: (bookingId) => api.post("/payment/create-order", { bookingId }),
  verifyPayment: (data) => api.post("/payment/verify", data),
  refund: (bookingId) => api.post("/payment/refund", { bookingId }),
};

// ─── Admin ─────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get("/admin/stats"),

  // Users
  getUsers: () => api.get("/admin/users"),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Bookings
  getBookings: () => api.get("/admin/bookings"),
  updateBooking: (id, data) => api.put(`/admin/bookings/${id}`, data),
  deleteBooking: (id) => api.delete(`/admin/bookings/${id}`),

  // Destinations
  createDestination: (data) => api.post("/admin/destinations", data),
  updateDestination: (id, data) => api.put(`/admin/destinations/${id}`, data),
  deleteDestination: (id) => api.delete(`/admin/destinations/${id}`),

  // Flights
  createFlight: (data) => api.post("/admin/flights", data),
  updateFlight: (id, data) => api.put(`/admin/flights/${id}`, data),
  deleteFlight: (id) => api.delete(`/admin/flights/${id}`),

  // Hotels
  createHotel: (data) => api.post("/admin/hotels", data),
  updateHotel: (id, data) => api.put(`/admin/hotels/${id}`, data),
  deleteHotel: (id) => api.delete(`/admin/hotels/${id}`),
};

export default api;
