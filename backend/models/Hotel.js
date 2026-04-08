const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true },
    stars: { type: Number, min: 1, max: 5, required: true },
    price: { type: Number, required: true }, // per night in paise
    rating: { type: Number, min: 0, max: 10, required: true },
    img: { type: String, required: true },
    amenities: [{ type: String }],
    roomsAvailable: { type: Number, default: 20 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hotel", hotelSchema);
