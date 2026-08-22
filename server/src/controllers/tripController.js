const prisma = require("../config/prisma");

const createTrip = async (req, res) => {
  try {
    const {
      userId,
      name,
      description,
      startDate,
      endDate,
      budget,
      stops = [],
    } = req.body;

    // Basic validation
    if (!userId || !name || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "userId, name, startDate and endDate are required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid start or end date",
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify all cities before creating the trip
    for (const stop of stops) {
      const city = await prisma.city.findUnique({
        where: {
          id: stop.cityId,
        },
      });

      if (!city) {
        return res.status(404).json({
          success: false,
          message: `City not found: ${stop.cityId}`,
        });
      }
    }

    const trip = await prisma.trip.create({
      data: {
        userId,
        name,
        description: description || null,
        startDate: start,
        endDate: end,
        budget:
          budget !== undefined && budget !== null
            ? Number(budget)
            : null,

        stops: {
          create: stops.map((stop, index) => ({
            cityId: stop.cityId,
            startDate: new Date(stop.startDate),
            endDate: new Date(stop.endDate),
            order: index + 1,
          })),
        },
      },

      include: {
        stops: {
          include: {
            city: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Trip created successfully",
      data: trip,
    });
  } catch (error) {
    console.error("Create trip error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create trip",
    });
  }
};


const getTrips = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const trips = await prisma.trip.findMany({
      where: {
        userId,
      },
      include: {
        stops: {
          include: {
            city: true,
          },
          orderBy: {
            order: "asc",
          },
        },
        activities: {
          include: {
            activity: true,
            tripStop: true,
          },
        },
        expenses: true,
      },
      orderBy: {
        startDate: "asc",
      },
    });

    res.json({
      success: true,
      count: trips.length,
      data: trips,
    });
  } catch (error) {
    console.error("Get trips error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch trips",
    });
  }
};


const getTripById = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await prisma.trip.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        stops: {
          include: {
            city: true,
            activities: {
              include: {
                activity: true,
              },
              orderBy: {
                date: "asc",
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },

        activities: {
          include: {
            activity: true,
            tripStop: true,
          },
          orderBy: {
            date: "asc",
          },
        },

        expenses: true,
      },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    res.json({
      success: true,
      data: trip,
    });
  } catch (error) {
    console.error("Get trip error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch trip",
    });
  }
};


module.exports = {
  createTrip,
  getTrips,
  getTripById,
};