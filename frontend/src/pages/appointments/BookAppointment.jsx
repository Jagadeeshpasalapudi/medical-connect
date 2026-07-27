import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
import { toast } from "sonner";

import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineVideoCamera,
  HiOutlineLocationMarker,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
} from "react-icons/hi";

import { useAuth } from "../../context/AuthContext";

import "../../styles/appointments.css";

const BookAppointment = () => {
  const { user, loading: authLoading } = useAuth();

  const navigate = useNavigate();

  const { doctorId } = useParams();

  const [doctor, setDoctor] = useState(null);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    appointmentDate: "",

    appointmentTime: "",

    consultationType: "Online Consultation",

    reason: "",

    symptoms: "",

    patientNotes: "",
  });

  // ==========================================
  // FETCH DOCTOR
  // ==========================================

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/doctors/${doctorId}`);
      setDoctor(response.data.doctor || response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load doctor");
      navigate("/doctors");
    } finally { setLoading(false); }
  };

  // ==========================================
  // LOAD DOCTOR
  // ==========================================

  useEffect(() => {
    if (doctorId && user) {
      fetchDoctor();
    }
  }, [doctorId, user]);

  // ==========================================
  // INPUT HANDLER
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,

      [name]: value,
    }));
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.appointmentDate) return toast.error("Please select an appointment date");
    if (!formData.appointmentTime) return toast.error("Please select an appointment time");
    if (!formData.reason.trim()) return toast.error("Please enter the reason for your visit");
    try {
      setSubmitting(true);
      await API.post("/appointments", { doctorId, ...formData });
      toast.success("Appointment booked successfully");
      navigate("/appointments");
    } catch (error) { toast.error(error.response?.data?.message || "Failed to book appointment"); }
    finally { setSubmitting(false); }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (authLoading || loading) {
    return (
      <div className="appointments-loading">
        <div className="appointments-spinner"></div>
        <p>Loading doctor information...</p>
      </div>
    );
  }

  if (!doctor) {
    return null;
  }

  const doctorName = doctor.fullName || "Doctor";

  const doctorImage = doctor.profileImage || "";

  const doctorSpecialization = doctor.specialization || "Medical Specialist";

  const doctorQualification = doctor.qualification || "";

  const doctorExperience = doctor.experience || 0;

  const doctorFee = doctor.consultationFee || 0;

  const doctorCity = doctor.city || "Location not specified";

  const isAvailable = doctor.isAvailable;

  return (
    <div className="book-appointment-page">
        {/* ====================================
        HEADER
    ==================================== */}

        <div className="book-appointment-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <HiOutlineArrowLeft />
            Back
          </button>

          <div>
            <span className="appointments-eyebrow">PATIENT PORTAL</span>

            <h1>Book Appointment</h1>

            <p>
              Schedule your consultation with a trusted healthcare professional.
            </p>
          </div>
        </div>

        {/* ====================================
        CONTENT
    ==================================== */}

        <div className="book-appointment-layout">
          {/* ==================================
          DOCTOR CARD
      ================================== */}

          <aside className="booking-doctor-card">
            <div className="booking-doctor-cover"></div>

            <div className="booking-doctor-content">
              <div className="booking-doctor-avatar">
                {doctorImage ? (
                  <img src={doctorImage} alt={doctorName} />
                ) : (
                  <span>{doctorName.charAt(0).toUpperCase()}</span>
                )}
              </div>

              <h2>Dr. {doctorName}</h2>

              <p className="booking-doctor-specialization">
                {doctorSpecialization}
              </p>

              <div className="booking-doctor-rating">
                <HiOutlineCheckCircle />

                <span>Verified Doctor</span>
              </div>

              <div className="booking-doctor-details">
                <div>
                  <span>QUALIFICATION</span>

                  <strong>{doctorQualification}</strong>
                </div>

                <div>
                  <span>EXPERIENCE</span>

                  <strong>{doctorExperience}+ Years</strong>
                </div>

                <div>
                  <span>LOCATION</span>

                  <strong>{doctorCity}</strong>
                </div>

                <div>
                  <span>CONSULTATION FEE</span>

                  <strong>₹{doctorFee}</strong>
                </div>
              </div>

              <div
                className={
                  isAvailable
                    ? "doctor-availability available"
                    : "doctor-availability unavailable"
                }
              >
                <span></span>

                {isAvailable
                  ? "Currently accepting appointments"
                  : "Currently unavailable"}
              </div>
            </div>
          </aside>

          {/* ==================================
          BOOKING FORM
      ================================== */}

          <section className="booking-form-card">
            <div className="booking-form-header">
              <div>
                <span>STEP 1 OF 1</span>

                <h2>Appointment Details</h2>

                <p>Choose a convenient time for your consultation.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* DATE */}

              <div className="booking-form-group">
                <label>
                  <HiOutlineCalendar />
                  Appointment Date
                  <span>*</span>
                </label>

                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* TIME */}

              <div className="booking-form-group">
                <label>
                  <HiOutlineClock />
                  Appointment Time
                  <span>*</span>
                </label>

                <input
                  type="time"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* CONSULTATION TYPE */}

              <div className="booking-form-group">
                <label>
                  Consultation Type
                  <span>*</span>
                </label>

                <div className="consultation-type-options">
                  <label
                    className={
                      formData.consultationType === "Online Consultation"
                        ? "consultation-option active"
                        : "consultation-option"
                    }
                  >
                    <input
                      type="radio"
                      name="consultationType"
                      value="Online Consultation"
                      checked={
                        formData.consultationType === "Online Consultation"
                      }
                      onChange={handleChange}
                    />

                    <HiOutlineVideoCamera />

                    <span>
                      <strong>Online Consultation</strong>

                      <small>Video call from anywhere</small>
                    </span>
                  </label>

                  <label
                    className={
                      formData.consultationType === "In-Person Visit"
                        ? "consultation-option active"
                        : "consultation-option"
                    }
                  >
                    <input
                      type="radio"
                      name="consultationType"
                      value="In-Person Visit"
                      checked={formData.consultationType === "In-Person Visit"}
                      onChange={handleChange}
                    />

                    <HiOutlineLocationMarker />

                    <span>
                      <strong>In-Person Visit</strong>

                      <small>Visit the clinic</small>
                    </span>
                  </label>
                </div>
              </div>

              {/* REASON */}

              <div className="booking-form-group">
                <label>
                  Reason for Visit
                  <span>*</span>
                </label>

                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="What would you like to consult the doctor about?"
                  rows="4"
                  maxLength="500"
                  required
                />

                <small className="input-hint">
                  {formData.reason.length}/500 characters
                </small>
              </div>

              {/* SYMPTOMS */}

              <div className="booking-form-group">
                <label>
                  Symptoms
                  <span className="optional">Optional</span>
                </label>

                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  placeholder="Describe any symptoms you are experiencing..."
                  rows="3"
                  maxLength="500"
                />
              </div>

              {/* PATIENT NOTES */}

              <div className="booking-form-group">
                <label>
                  Additional Notes
                  <span className="optional">Optional</span>
                </label>

                <textarea
                  name="patientNotes"
                  value={formData.patientNotes}
                  onChange={handleChange}
                  placeholder="Anything else you would like the doctor to know?"
                  rows="3"
                  maxLength="500"
                />
              </div>

              {/* SUMMARY */}

              <div className="booking-summary">
                <div>
                  <span>CONSULTATION FEE</span>

                  <strong>₹{doctorFee}</strong>
                </div>

                <div>
                  <span>APPOINTMENT</span>

                  <strong>
                    {formData.appointmentDate
                      ? formData.appointmentDate
                      : "Not selected"}

                    {" · "}

                    {formData.appointmentTime
                      ? formData.appointmentTime
                      : "Not selected"}
                  </strong>
                </div>
              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="book-submit-button"
                disabled={submitting || !isAvailable}
              >
                {submitting ? (
                  <>
                    <span className="button-spinner"></span>
                    Booking Appointment...
                  </>
                ) : (
                  <>
                    <HiOutlineCheckCircle />
                    Confirm Appointment
                  </>
                )}
              </button>

              <p className="booking-disclaimer">
                By booking this appointment, you agree to provide accurate
                information for your consultation.
              </p>
            </form>
          </section>
        </div>
    </div>
  );
};

export default BookAppointment;
