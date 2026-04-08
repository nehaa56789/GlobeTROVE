const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    airline: { type: String, required: true },
    dep: { type: String, required: true },
    arr: { type: String, required: true },
    dur: { type: String, required: true },
    price: { type: Number, required: true },
    stops: { type: Number, default: 0 },
    class: {
      type: String,
      enum: ["Economy", "Business", "First"],
      default: "Economy",
    },
    seatsAvailable: { type: Number, default: 50 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Flight", flightSchema);
