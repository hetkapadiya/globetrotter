require("dotenv").config();

const express = require("express");
const cors = require("cors");

const cityRoutes = require("./routes/cityRoutes");
const tripRoutes = require("./routes/tripRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "GlobeTrotter API is running",
  });
});

app.use("/api/cities", cityRoutes);
app.use("/api/trips", tripRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`GlobeTrotter API running on http://localhost:${PORT}`);
});