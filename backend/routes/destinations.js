const express = require("express");
const router = express.Router();
const { getAllDestinations, getPopularDestinations, getDestinationById } = require("../controllers/destinationsController");

// NOTE: /popular must be before /:id to avoid "popular" being treated as an ID
router.get("/popular", getPopularDestinations);
router.get("/", getAllDestinations);
router.get("/:id", getDestinationById);

module.exports = router;
