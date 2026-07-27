const Doctor = require("../models/Doctor");

const normalizeArray = (value) => Array.isArray(value) ? [...new Set(value.map((item) => String(item).trim()).filter(Boolean))] : [];
const cleanProfile = (body) => ({
  fullName: String(body.fullName || "").trim(),
  specialization: String(body.specialization || "").trim(),
  qualification: String(body.qualification || "").trim(),
  experience: Number(body.experience),
  consultationFee: Number(body.consultationFee),
  about: String(body.about || "").trim(),
  profileImage: String(body.profileImage || "").trim(),
  hospital: String(body.hospital || "").trim(),
  city: String(body.city || "").trim(),
  languages: normalizeArray(body.languages),
  services: normalizeArray(body.services),
  availableDays: normalizeArray(body.availableDays),
  availableTime: String(body.availableTime || "").trim(),
  isAvailable: body.isAvailable !== false,
});

const validateProfile = (data) => {
  if (!data.fullName || !data.specialization || !data.qualification) return "Full name, specialization and qualification are required";
  if (!Number.isFinite(data.experience) || data.experience < 0) return "Experience must be a valid non-negative number";
  if (!Number.isFinite(data.consultationFee) || data.consultationFee < 0) return "Consultation fee must be a valid non-negative number";
  return null;
};

const createDoctorProfile = async (req, res) => {
  try {
    const existing = await Doctor.findOne({ user: req.user._id });
    if (existing) return res.status(409).json({ success: false, message: "Doctor profile already exists" });
    const data = cleanProfile(req.body); const error = validateProfile(data);
    if (error) return res.status(400).json({ success: false, message: error });
    const doctor = await Doctor.create({ user: req.user._id, ...data });
    res.status(201).json({ success: true, message: "Doctor profile created successfully", doctor });
  } catch (error) { console.error("CREATE DOCTOR ERROR:", error); res.status(500).json({ success: false, message: "Failed to create doctor profile" }); }
};

const getAllDoctors = async (req, res) => {
  try {
    const { search = "", specialization = "", minExperience, maxFee, city = "" } = req.query;
    const query = { isApproved: true, isAvailable: true };
    if (search.trim()) query.$or = [{ fullName: { $regex: search.trim(), $options: "i" } }, { specialization: { $regex: search.trim(), $options: "i" } }];
    if (specialization && specialization !== "All") query.specialization = specialization;
    if (city.trim()) query.city = { $regex: city.trim(), $options: "i" };
    if (minExperience !== undefined && minExperience !== "") query.experience = { ...(query.experience || {}), $gte: Number(minExperience) };
    if (maxFee !== undefined && maxFee !== "") query.consultationFee = { $lte: Number(maxFee) };
    const doctors = await Doctor.find(query).populate("user", "name email phone").sort({ rating: -1, createdAt: -1 });
    res.json({ success: true, doctors });
  } catch (error) { console.error("GET DOCTORS ERROR:", error); res.status(500).json({ success: false, message: "Failed to load doctors" }); }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.params.id, isApproved: true }).populate("user", "name email phone");
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    res.json({ success: true, doctor });
  } catch (error) { res.status(400).json({ success: false, message: "Invalid doctor id" }); }
};

const getMyDoctorProfile = async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id }).populate("user", "name email phone");
  if (!doctor) return res.status(404).json({ success: false, message: "Doctor profile not found" });
  res.json({ success: true, doctor });
};

const updateDoctorProfile = async (req, res) => {
  try {
    const data = cleanProfile(req.body); const error = validateProfile(data);
    if (error) return res.status(400).json({ success: false, message: error });
    const doctor = await Doctor.findOneAndUpdate({ user: req.user._id }, { $set: data, $setOnInsert: { user: req.user._id } }, { new: true, upsert: true, runValidators: true }).populate("user", "name email phone");
    res.json({ success: true, message: "Profile saved successfully", doctor });
  } catch (error) { console.error("UPDATE DOCTOR ERROR:", error); res.status(500).json({ success: false, message: error.message || "Failed to save doctor profile" }); }
};

const getAllDoctorsAdmin = async (req, res) => { const doctors = await Doctor.find().populate("user", "name email phone createdAt isActive").sort({ createdAt: -1 }); res.json({ success: true, doctors }); };
const approveDoctor = async (req, res) => { const doctor = await Doctor.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true }).populate("user", "name email"); if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" }); res.json({ success: true, message: "Doctor approved successfully", doctor }); };
const rejectDoctor = async (req, res) => { const doctor = await Doctor.findByIdAndUpdate(req.params.id, { isApproved: false }, { new: true }).populate("user", "name email"); if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" }); res.json({ success: true, message: "Doctor rejected successfully", doctor }); };

module.exports = { createDoctorProfile, getAllDoctors, getDoctorById, getMyDoctorProfile, updateDoctorProfile, getAllDoctorsAdmin, approveDoctor, rejectDoctor };
