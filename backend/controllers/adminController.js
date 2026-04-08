const User = require("../models/User");
const Booking = require("../models/Booking");
const Destination = require("../models/Destination");
const Flight = require("../models/Flight");
const Hotel = require("../models/Hotel");

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalBookings,
      totalDestinations,
      totalFlights,
      totalHotels,
      revenueAgg,
      recentBookings,
      bookingsByStatus,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Booking.countDocuments(),
      Destination.countDocuments(),
      Flight.countDocuments(),
      Hotel.countDocuments(),
      Booking.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      Booking.find().sort({ createdAt: -1 }).limit(8).populate("userId", "name email"),
      Booking.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalBookings,
        totalDestinations,
        totalFlights,
        totalHotels,
        totalRevenue,
        recentBookings,
        bookingsByStatus,
      },
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── USERS ────────────────────────────────────────────────────────────────────

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/admin/users/:id  (toggle active / change role)
const updateUser = async (req, res) => {
  try {
    const { role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...(role && { role }), ...(isActive !== undefined && { isActive }) },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    await Booking.deleteMany({ userId: req.params.id });
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── BOOKINGS ────────────────────────────────────────────────────────────────

// GET /api/admin/bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/admin/bookings/:id
const updateBooking = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(paymentStatus && { paymentStatus }) },
      { new: true }
    ).populate("userId", "name email");

    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/admin/bookings/:id
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── DESTINATIONS CRUD ────────────────────────────────────────────────────────

// POST /api/admin/destinations
const createDestination = async (req, res) => {
  try {
    const dest = await Destination.create(req.body);
    res.status(201).json({ success: true, data: dest });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/admin/destinations/:id
const updateDestination = async (req, res) => {
  try {
    const dest = await Destination.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!dest) return res.status(404).json({ success: false, message: "Destination not found" });
    res.json({ success: true, data: dest });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/admin/destinations/:id
const deleteDestination = async (req, res) => {
  try {
    const dest = await Destination.findByIdAndDelete(req.params.id);
    if (!dest) return res.status(404).json({ success: false, message: "Destination not found" });
    res.json({ success: true, message: "Destination deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── FLIGHTS CRUD ─────────────────────────────────────────────────────────────

// POST /api/admin/flights
const createFlight = async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json({ success: true, data: flight });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/admin/flights/:id
const updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!flight) return res.status(404).json({ success: false, message: "Flight not found" });
    res.json({ success: true, data: flight });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/admin/flights/:id
const deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) return res.status(404).json({ success: false, message: "Flight not found" });
    res.json({ success: true, message: "Flight deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── HOTELS CRUD ──────────────────────────────────────────────────────────────

// POST /api/admin/hotels
const createHotel = async (req, res) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({ success: true, data: hotel });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/admin/hotels/:id
const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });
    res.json({ success: true, data: hotel });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/admin/hotels/:id
const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });
    res.json({ success: true, message: "Hotel deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getStats,
  getAllUsers, updateUser, deleteUser,
  getAllBookings, updateBooking, deleteBooking,
  createDestination, updateDestination, deleteDestination,
  createFlight, updateFlight, deleteFlight,
  createHotel, updateHotel, deleteHotel,
};
