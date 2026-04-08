const express = require("express");
const router = express.Router();
const { getUserBookings, cancelBooking } = require("../controllers/bookingsController");
const { protect } = require("../middleware/auth");

router.get("/", protect, getUserBookings);
router.delete("/:id", protect, cancelBooking);

module.exports = router;
