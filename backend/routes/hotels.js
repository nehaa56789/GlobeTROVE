const express = require("express");
const router = express.Router();
const { getAllHotels, getHotelById, bookHotel } = require("../controllers/hotelsController");
const { protect } = require("../middleware/auth");

router.get("/", getAllHotels);
router.get("/:id", getHotelById);
router.post("/book", protect, bookHotel);

module.exports = router;
