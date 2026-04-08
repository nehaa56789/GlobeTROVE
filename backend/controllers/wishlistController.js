const Wishlist = require("../models/Wishlist");
const Destination = require("../models/Destination");

// GET /api/wishlist  (protected)
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate("destinations");
    if (!wishlist) return res.json({ success: true, count: 0, data: [] });

    res.json({ success: true, count: wishlist.destinations.length, data: wishlist.destinations });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/wishlist/:destId  (protected — toggle)
const toggleWishlist = async (req, res) => {
  try {
    const dest = await Destination.findById(req.params.destId);
    if (!dest) return res.status(404).json({ success: false, message: "Destination not found" });

    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user._id, destinations: [] });
    }

    const idx = wishlist.destinations.indexOf(dest._id);
    let action;
    if (idx === -1) {
      wishlist.destinations.push(dest._id);
      action = "added";
    } else {
      wishlist.destinations.splice(idx, 1);
      action = "removed";
    }

    await wishlist.save();

    res.json({
      success: true,
      message: `${dest.city} ${action} ${action === "added" ? "to" : "from"} wishlist`,
      data: wishlist.destinations,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getWishlist, toggleWishlist };
