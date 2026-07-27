const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// ===============================
// ROUTES
// ===============================

// Authentication
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

// Doctors
const doctorRoutes = require("./routes/doctorRoutes");

app.use("/api/doctors", doctorRoutes);

//Appointments
const appointmentRoutes = require("./routes/appointmentRoutes");

app.use("/api/appointments", appointmentRoutes);

// Dashboard
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use("/api/dashboard", dashboardRoutes);

//Admin
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/admin", adminRoutes);

// ===============================
// HEALTH CHECK
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MediConnect Healthcare API is running",
  });
});

// ===============================
// 404 HANDLER
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 MediConnect server running on port ${PORT}`);

  console.log(`🌐 http://localhost:${PORT}`);
});
