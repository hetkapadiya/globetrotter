const express = require("express");

const {
  createTrip,
  getTrips,
  getTripById,
} = require("../controllers/tripController");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, createTrip);

router.get("/", authenticate, getTrips);

router.get("/:id", authenticate, getTripById);

module.exports = router;