const Destination = require("../models/Destination");

// GET /api/destinations
const getAllDestinations = async (req, res) => {
  try {
    const { tag, maxPrice, minRating, sort } = req.query;
    const filter = { isActive: true };

    if (tag && tag !== "All") filter.tag = tag;
    if (maxPrice) filter.price = { $lte: Number(maxPrice) };
    if (minRating) filter.rating = { $gte: Number(minRating) };

    let query = Destination.find(filter);

    if (sort === "price_asc") query = query.sort({ price: 1 });
    else if (sort === "price_desc") query = query.sort({ price: -1 });
    else if (sort === "rating") query = query.sort({ rating: -1 });

    const destinations = await query;
    res.json({ success: true, count: destinations.length, data: destinations });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/destinations/popular
const getPopularDestinations = async (req, res) => {
  try {
    const popular = await Destination.find({ isPopular: true, isActive: true });
    res.json({ success: true, count: popular.length, data: popular });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/destinations/:id
const getDestinationById = async (req, res) => {
  try {
    const dest = await Destination.findById(req.params.id);
    if (!dest) return res.status(404).json({ success: false, message: "Destination not found" });
    res.json({ success: true, data: dest });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getAllDestinations, getPopularDestinations, getDestinationById };
