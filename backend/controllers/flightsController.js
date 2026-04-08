const Flight = require("../models/Flight");
const Booking = require("../models/Booking");

// GET /api/flights
const getAllFlights = async (req, res) => {
  try {
    const { from, to, class: flightClass, stops, sort } = req.query;
    const filter = { isActive: true };

    if (from) filter.from = { $regex: from, $options: "i" };
    if (to) filter.to = { $regex: to, $options: "i" };
    if (flightClass && flightClass !== "All") filter.class = flightClass;
    if (stops === "Direct") filter.stops = 0;

    let query = Flight.find(filter);
    if (sort === "duration") query = query.sort({ dur: 1 });
    else query = query.sort({ price: 1 });

    const flights = await query;
    res.json({ success: true, count: flights.length, data: flights });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/flights/:id
const getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ success: false, message: "Flight not found" });
    res.json({ success: true, data: flight });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/flights/book  (protected) — creates pending booking, payment done separately
const bookFlight = async (req, res) => {
  try {
    const { flightId } = req.body;
    const flight = await Flight.findById(flightId);
    if (!flight) return res.status(404).json({ success: false, message: "Flight not found" });
    if (flight.seatsAvailable < 1) {
      return res.status(400).json({ success: false, message: "No seats available" });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      type: "Flight",
      dest: `${flight.from} → ${flight.to}`,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      status: "Pending",
      paymentStatus: "pending",
      price: flight.price,
      img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=200&q=80",
      details: flight.toObject(),
    });

    res.status(201).json({ success: true, message: "Booking created. Complete payment to confirm.", data: booking });
  } catch (err) {
    console.error("Book flight error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getAllFlights, getFlightById, bookFlight };
