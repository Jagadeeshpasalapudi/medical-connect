const express = require("express");
const { protect, roleOnly } = require("../middleware/authMiddleware");
const {
  getPatientDashboard,
  getDoctorDashboard,
} = require("../controllers/dashboardController");

const router = express.Router();

router.get("/patient", protect, roleOnly("patient"), getPatientDashboard);
router.get("/doctor", protect, roleOnly("doctor"), getDoctorDashboard);

module.exports = router;
