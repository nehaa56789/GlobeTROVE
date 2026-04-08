const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    img: { type: String, required: true },
    tag: {
      type: String,
      enum: ["Romantic", "Tropical", "Culture", "Scenic", "Luxury", "Adventure", "Exotic"],
      required: true,
    },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Destination", destinationSchema);
