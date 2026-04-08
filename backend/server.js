require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/destinations", require("./routes/destinations"));
app.use("/api/flights", require("./routes/flights"));
app.use("/api/hotels", require("./routes/hotels"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/wishlist", require("./routes/wishlist"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/admin", require("./routes/admin"));

// Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/dist", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;


if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`🚀 GlobeTrove server running on port ${PORT}`));
}

module.exports = app;