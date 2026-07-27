const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const publicUser = (user) => ({
  id: user._id,
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || "",
  role: user.role,
  avatar: user.avatar || "",
  isActive: user.isActive,
  createdAt: user.createdAt,
});

const generateToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const registerUser = async (req, res) => {
  try {
    const { name, email, phone = "", password, role = "patient" } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedRole = role === "doctor" ? "doctor" : "patient";

    if (!String(name || "").trim() || !normalizedEmail || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }
    if (String(name).trim().length < 2) return res.status(400).json({ success: false, message: "Name must contain at least 2 characters" });
    if (String(password).length < 6) return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) return res.status(400).json({ success: false, message: "Please enter a valid email address" });

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(409).json({ success: false, message: "User already exists with this email" });

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      phone: String(phone || "").trim(),
      password: await bcrypt.hash(password, 12),
      role: normalizedRole,
    });

    res.status(201).json({ success: true, message: "Account created successfully", token: generateToken(user._id), user: publicUser(user) });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    if (error.code === 11000) return res.status(409).json({ success: false, message: "Email is already registered" });
    res.status(500).json({ success: false, message: "Server error while registering" });
  }
};

const loginUser = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ success: false, message: "Invalid email or password" });
    if (!user.isActive) return res.status(403).json({ success: false, message: "Your account has been disabled" });

    user.lastSeen = new Date();
    await user.save();
    res.json({ success: true, message: "Login successful", token: generateToken(user._id), user: publicUser(user) });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ success: false, message: "Server error while logging in" });
  }
};

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, user });
};

const updateCurrentUser = async (req, res) => {
  try {
    const updates = {};
    if (req.body.name !== undefined) {
      const name = String(req.body.name).trim();
      if (name.length < 2) return res.status(400).json({ success: false, message: "Name must contain at least 2 characters" });
      updates.name = name;
    }
    if (req.body.phone !== undefined) updates.phone = String(req.body.phone).trim();
    if (req.body.avatar !== undefined) updates.avatar = String(req.body.avatar).trim();

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select("-password");
    res.json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};

module.exports = { registerUser, loginUser, getCurrentUser, updateCurrentUser };
