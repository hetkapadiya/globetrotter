const express = require("express");

const {
  getCities,
  getCityById,
  getCityActivities,
} = require("../controllers/cityController");

const router = express.Router();

router.get("/", getCities);

router.get("/:id", getCityById);

router.get("/:id/activities", getCityActivities);

module.exports = router;