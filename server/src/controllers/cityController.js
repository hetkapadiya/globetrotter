const prisma = require("../config/prisma");

const getCities = async (req, res) => {
  try {
    const { search, country, region } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          country: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (country) {
      where.country = {
        equals: country,
        mode: "insensitive",
      };
    }

    if (region) {
      where.region = {
        equals: region,
        mode: "insensitive",
      };
    }

    const cities = await prisma.city.findMany({
      where,
      orderBy: {
        popularity: "desc",
      },
      include: {
        _count: {
          select: {
            activities: true,
          },
        },
      },
    });

    res.json({
      success: true,
      count: cities.length,
      data: cities,
    });
  } catch (error) {
    console.error("Get cities error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch cities",
    });
  }
};

const getCityById = async (req, res) => {
  try {
    const { id } = req.params;

    const city = await prisma.city.findUnique({
      where: {
        id,
      },
      include: {
        activities: true,
      },
    });

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    res.json({
      success: true,
      data: city,
    });
  } catch (error) {
    console.error("Get city error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch city",
    });
  }
};

const getCityActivities = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, maxCost } = req.query;

    const where = {
      cityId: id,
    };

    if (category) {
      where.category = {
        equals: category,
        mode: "insensitive",
      };
    }

    if (maxCost) {
      const parsedCost = Number(maxCost);

      if (!Number.isNaN(parsedCost)) {
        where.estimatedCost = {
          lte: parsedCost,
        };
      }
    }

    const activities = await prisma.activity.findMany({
      where,
      orderBy: {
        estimatedCost: "asc",
      },
    });

    res.json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    console.error("Get activities error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch activities",
    });
  }
};

module.exports = {
  getCities,
  getCityById,
  getCityActivities,
};