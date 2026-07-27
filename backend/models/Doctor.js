const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
    },

    qualification: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },

    about: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    hospital: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    languages: [
      {
        type: String,
      },
    ],

    services: [
      {
        type: String,
      },
    ],

    availableDays: [
      {
        type: String,
      },
    ],

    availableTime: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Doctor", doctorSchema);
