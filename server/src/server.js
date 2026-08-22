const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "GlobeTrotter API is running",
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`GlobeTrotter API running on http://localhost:${PORT}`);
});