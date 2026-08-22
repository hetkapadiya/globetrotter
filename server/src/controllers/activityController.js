const prisma = require("../config/prisma");

// =========================================================
// GET ALL ACTIVITIES
// GET /api/activities
// Optional: ?cityId=...
// =========================================================

async function getActivities(req, res) {
  try {
    const { cityId } = req.query;

    const where = {};

    if (cityId) {
      where.cityId = cityId;
    }

    const activities =
      await prisma.activity.findMany({
        where,
        include: {
          city: true,
        },
        orderBy: [
          {
            category: "asc",
          },
          {
            name: "asc",
          },
        ],
      });

    res.json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    console.error(
      "Get activities error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch activities",
    });
  }
}

// =========================================================
// GET SINGLE ACTIVITY
// GET /api/activities/:id
// =========================================================

async function getActivityById(req, res) {
  try {
    const { id } = req.params;

    const activity =
      await prisma.activity.findUnique({
        where: {
          id,
        },
        include: {
          city: true,
        },
      });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    res.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error(
      "Get activity error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch activity",
    });
  }
}

// =========================================================
// ADD ACTIVITY TO TRIP
// POST /api/activities/trip
// =========================================================

async function addActivityToTrip(req, res) {
  try {
    const {
      tripId,
      tripStopId,
      activityId,
      date,
      startTime,
      endTime,
      customCost,
    } = req.body;

    // -----------------------------
    // Validate input
    // -----------------------------

    if (
      !tripId ||
      !tripStopId ||
      !activityId ||
      !date
    ) {
      return res.status(400).json({
        success: false,
        message:
          "tripId, tripStopId, activityId and date are required",
      });
    }

    // -----------------------------
    // Check trip
    // -----------------------------

    const trip =
      await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
      });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    // -----------------------------
    // Check stop
    // -----------------------------

    const stop =
      await prisma.tripStop.findUnique({
        where: {
          id: tripStopId,
        },
      });

    if (!stop) {
      return res.status(404).json({
        success: false,
        message: "Trip stop not found",
      });
    }

    if (stop.tripId !== tripId) {
      return res.status(400).json({
        success: false,
        message:
          "Trip stop does not belong to this trip",
      });
    }

    // -----------------------------
    // Check activity
    // -----------------------------

    const activity =
      await prisma.activity.findUnique({
        where: {
          id: activityId,
        },
      });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    // -----------------------------
    // Create TripActivity
    // -----------------------------

    const tripActivity =
      await prisma.tripActivity.create({
        data: {
          tripId,
          tripStopId,
          activityId,

          date: new Date(date),

          startTime:
            startTime || null,

          endTime:
            endTime || null,

          customCost:
            customCost !== undefined &&
            customCost !== null
              ? Number(customCost)
              : null,
        },

        include: {
          activity: true,

          tripStop: {
            include: {
              city: true,
            },
          },
        },
      });

    res.status(201).json({
      success: true,
      message:
        "Activity added to trip",
      data: tripActivity,
    });
  } catch (error) {
    console.error(
      "Add activity error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to add activity",
    });
  }
}

// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  getActivities,
  getActivityById,
  addActivityToTrip,
};