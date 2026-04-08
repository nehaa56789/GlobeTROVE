const express = require("express");
const router = express.Router();
const {
  getStats,
  getAllUsers, updateUser, deleteUser,
  getAllBookings, updateBooking, deleteBooking,
  createDestination, updateDestination, deleteDestination,
  createFlight, updateFlight, deleteFlight,
  createHotel, updateHotel, deleteHotel,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

// All admin routes are protected + admin-only
router.use(protect, adminOnly);

router.get("/stats", getStats);

// Users
router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Bookings
router.get("/bookings", getAllBookings);
router.put("/bookings/:id", updateBooking);
router.delete("/bookings/:id", deleteBooking);

// Destinations
router.post("/destinations", createDestination);
router.put("/destinations/:id", updateDestination);
router.delete("/destinations/:id", deleteDestination);

// Flights
router.post("/flights", createFlight);
router.put("/flights/:id", updateFlight);
router.delete("/flights/:id", deleteFlight);

// Hotels
router.post("/hotels", createHotel);
router.put("/hotels/:id", updateHotel);
router.delete("/hotels/:id", deleteHotel);

module.exports = router;
