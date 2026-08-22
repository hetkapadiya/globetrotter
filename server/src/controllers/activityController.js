const prisma = require("../config/prisma");

// GET /api/activities
// Optional: ?cityId=...
async function getActivities(req, res) {
  try {
    const { cityId } = req.query;

    const where = {};

    if (cityId) {
      where.cityId = cityId;
    }

    const activities = await prisma.activity.findMany({
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

// GET /api/activities/:id
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

module.exports = {
  getActivities,
  getActivityById,
};