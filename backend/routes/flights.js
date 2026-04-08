const express = require("express");
const router = express.Router();
const { getAllFlights, getFlightById, bookFlight } = require("../controllers/flightsController");
const { protect } = require("../middleware/auth");

router.get("/", getAllFlights);
router.get("/:id", getFlightById);
router.post("/book", protect, bookFlight);

module.exports = router;
