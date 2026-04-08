const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");

// GET /api/hotels
const getAllHotels = async (req, res) => {
  try {
    const { city, stars, sort } = req.query;
    const filter = { isActive: true };

    if (city) filter.city = { $regex: city, $options: "i" };
    if (stars) filter.stars = { $gte: Number(stars) };

    let query = Hotel.find(filter);
    if (sort === "rating") query = query.sort({ rating: -1 });
    else query = query.sort({ price: 1 });

    const hotels = await query;
    res.json({ success: true, count: hotels.length, data: hotels });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/hotels/:id
const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });
    res.json({ success: true, data: hotel });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/hotels/book  (protected)
const bookHotel = async (req, res) => {
  try {
    const { hotelId, checkIn, checkOut } = req.body;
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });

    const booking = await Booking.create({
      userId: req.user._id,
      type: "Hotel",
      dest: hotel.name,
      date: checkIn && checkOut ? `${checkIn} – ${checkOut}` : "Dates TBD",
      status: "Pending",
      paymentStatus: "pending",
      price: hotel.price,
      img: hotel.img,
      details: hotel.toObject(),
    });

    res.status(201).json({ success: true, message: "Hotel booking created. Complete payment to confirm.", data: booking });
  } catch (err) {
    console.error("Book hotel error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getAllHotels, getHotelById, bookHotel };
