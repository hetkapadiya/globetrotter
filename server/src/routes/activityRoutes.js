const express = require("express");

const {
  getActivities,
  getActivityById,
  addActivityToTrip,
} = require("../controllers/activityController");

const router = express.Router();

router.get("/", getActivities);
router.post("/trip", addActivityToTrip);
router.get("/:id", getActivityById);

// router.post(
//   "/trip",
//   addActivityToTrip
// );

module.exports = router;