const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    appointmentDate: {
      type: String,
      required: true,
    },

    appointmentTime: {
      type: String,
      required: true,
    },

    consultationType: {
      type: String,
      enum: ["Online Consultation", "In-Person Visit"],
      default: "Online Consultation",
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    symptoms: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected", "completed", "cancelled"],
      default: "pending",
    },

    doctorNotes: {
      type: String,
      default: "",
    },

    patientNotes: {
      type: String,
      default: "",
    },

    cancellationReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Appointment", appointmentSchema);
