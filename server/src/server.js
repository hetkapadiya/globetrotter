require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Routes
const cityRoutes = require("./routes/cityRoutes");
const tripRoutes = require("./routes/tripRoutes");
const authRoutes = require("./routes/authRoutes");
const activityRoutes = require("./routes/activityRoutes");

const app = express();

// =========================================================
// CORS
// =========================================================

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests from PowerShell, Postman, etc.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log(
        "Blocked CORS origin:",
        origin
      );

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,
  })
);

// =========================================================
// MIDDLEWARE
// =========================================================

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// =========================================================
// HEALTH CHECK
// =========================================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "GlobeTrotter API is running",
  });
});

// =========================================================
// API ROUTES
// =========================================================

app.use(
  "/api/cities",
  cityRoutes
);

app.use(
  "/api/trips",
  tripRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/activities",
  activityRoutes
);

// =========================================================
// 404 HANDLER
// =========================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =========================================================
// ERROR HANDLER
// =========================================================

app.use((err, req, res, next) => {
  console.error(
    "Server error:",
    err
  );

  if (
    err.message ===
    "Not allowed by CORS"
  ) {
    return res.status(403).json({
      success: false,
      message: "CORS origin not allowed",
    });
  }

  res.status(500).json({
    success: false,
    message:
      err.message ||
      "Internal server error",
  });
});

// =========================================================
// START SERVER
// =========================================================

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `GlobeTrotter API running on port ${PORT}`
    );

    console.log(
      "Allowed CORS origins:",
      allowedOrigins
    );
  }
);