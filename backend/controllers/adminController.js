const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalDoctors, approvedDoctors, pendingDoctors, totalAppointments, pendingAppointments, completedAppointments] = await Promise.all([
      User.countDocuments({ role: "patient" }), Doctor.countDocuments(), Doctor.countDocuments({ isApproved: true }), Doctor.countDocuments({ isApproved: false }), Appointment.countDocuments(), Appointment.countDocuments({ status: "pending" }), Appointment.countDocuments({ status: "completed" }),
    ]);
    const monthlyAppointments = await Appointment.aggregate([{ $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]);
    res.json({ success: true, stats: { totalUsers, totalDoctors, approvedDoctors, pendingDoctors, totalAppointments, pendingAppointments, completedAppointments }, monthlyAppointments });
  } catch (error) { console.error("ADMIN STATS ERROR:", error); res.status(500).json({ success: false, message: "Failed to load dashboard statistics" }); }
};

const getAllDoctors = async (req, res) => { try { const doctors = await Doctor.find().populate("user", "name email phone createdAt isActive").sort({ createdAt: -1 }); res.json({ success: true, doctors }); } catch (e) { res.status(500).json({ success: false, message: "Failed to load doctors" }); } };
const updateDoctorApproval = async (req, res, approved) => { const doctor = await Doctor.findByIdAndUpdate(req.params.id, { isApproved: approved }, { new: true }).populate("user", "name email"); if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" }); res.json({ success: true, message: approved ? "Doctor approved successfully" : "Doctor rejected successfully", doctor }); };
const approveDoctor = (req, res) => updateDoctorApproval(req, res, true);
const rejectDoctor = (req, res) => updateDoctorApproval(req, res, false);
const getAllUsers = async (req, res) => { try { const users = await User.find({ role: { $ne: "admin" } }).select("-password").sort({ createdAt: -1 }); res.json({ success: true, users }); } catch (e) { res.status(500).json({ success: false, message: "Failed to load users" }); } };
const deleteUser = async (req, res) => { try { const user = await User.findById(req.params.id); if (!user) return res.status(404).json({ success: false, message: "User not found" }); await Promise.all([User.findByIdAndDelete(req.params.id), Doctor.findOneAndDelete({ user: req.params.id }), Appointment.deleteMany({ patient: req.params.id })]); res.json({ success: true, message: "User deleted successfully" }); } catch (e) { res.status(500).json({ success: false, message: "Failed to delete user" }); } };
const toggleUserStatus = async (req, res) => { try { const user = await User.findById(req.params.id); if (!user || user.role === "admin") return res.status(404).json({ success: false, message: "User not found" }); user.isActive = !user.isActive; await user.save(); res.json({ success: true, message: user.isActive ? "User activated" : "User disabled", user: user.toObject({ transform: (_, ret) => { delete ret.password; return ret; } }) }); } catch (e) { res.status(500).json({ success: false, message: "Failed to update user status" }); } };
const getAllAppointments = async (req, res) => { try { const appointments = await Appointment.find().populate("patient", "name email phone").populate({ path: "doctor", populate: { path: "user", select: "name email" } }).sort({ appointmentDate: 1, appointmentTime: 1, createdAt: -1 }); res.json({ success: true, appointments }); } catch (e) { res.status(500).json({ success: false, message: "Failed to load appointments" }); } };
const updateAppointmentStatus = async (req, res) => { try { const { status, doctorNotes = "" } = req.body; const allowed = ["pending", "confirmed", "rejected", "completed", "cancelled"]; if (!allowed.includes(status)) return res.status(400).json({ success: false, message: "Invalid appointment status" }); const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status, doctorNotes }, { new: true, runValidators: true }).populate("patient", "name email phone").populate({ path: "doctor", populate: { path: "user", select: "name email" } }); if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" }); res.json({ success: true, message: "Appointment updated successfully", appointment }); } catch (e) { res.status(500).json({ success: false, message: "Failed to update appointment" }); } };
module.exports = { getDashboardStats, getAllDoctors, approveDoctor, rejectDoctor, getAllUsers, deleteUser, toggleUserStatus, getAllAppointments, updateAppointmentStatus };
