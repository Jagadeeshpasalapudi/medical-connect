const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

const getPatientDashboard = async (req, res) => {
  try {
    const patientId = req.user._id;
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [upcomingAppointments, completedAppointments, totalAppointments, doctors] =
      await Promise.all([
        Appointment.countDocuments({
          patient: patientId,
          appointmentDate: { $gte: today },
          status: { $in: ["pending", "confirmed"] },
        }),
        Appointment.countDocuments({
          patient: patientId,
          status: "completed",
        }),
        Appointment.countDocuments({ patient: patientId }),
        Doctor.countDocuments({ isApproved: true, isAvailable: true }),
      ]);

    const appointments = await Appointment.find({
      patient: patientId,
      appointmentDate: { $gte: today },
      status: { $in: ["pending", "confirmed"] },
    })
      .populate({
        path: "doctor",
        populate: { path: "user", select: "name email" },
      })
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        upcomingAppointments,
        completedAppointments,
        totalAppointments,
        availableDoctors: doctors,
      },
      appointments,
    });
  } catch (error) {
    console.error("PATIENT DASHBOARD ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to load dashboard" });
  }
};

const getDoctorDashboard = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });

    if (!doctor) {
      return res.json({
        success: true,
        profileComplete: false,
        stats: { todayAppointments: 0, totalAppointments: 0, completedAppointments: 0, monthlyAppointments: 0, rating: 0, totalReviews: 0 },
        appointments: [],
        doctor: null,
      });
    }

    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [todayAppointments, totalAppointments, completedAppointments, monthlyAppointments] =
      await Promise.all([
        Appointment.countDocuments({
          doctor: doctor._id,
          appointmentDate: today,
          status: { $in: ["pending", "confirmed"] },
        }),
        Appointment.countDocuments({ doctor: doctor._id }),
        Appointment.countDocuments({
          doctor: doctor._id,
          status: "completed",
        }),
        Appointment.countDocuments({
          doctor: doctor._id,
          status: { $in: ["confirmed", "completed"] },
          createdAt: { $gte: monthStart },
        }),
      ]);

    const appointments = await Appointment.find({
      doctor: doctor._id,
      appointmentDate: { $gte: today },
      status: { $in: ["pending", "confirmed"] },
    })
      .populate("patient", "name email phone")
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .limit(10);

    res.json({
      success: true,
      stats: {
        todayAppointments,
        totalAppointments,
        completedAppointments,
        monthlyAppointments,
        rating: doctor.rating,
        totalReviews: doctor.totalReviews,
      },
      appointments,
      doctor,
    });
  } catch (error) {
    console.error("DOCTOR DASHBOARD ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to load dashboard" });
  }
};

module.exports = { getPatientDashboard, getDoctorDashboard };
