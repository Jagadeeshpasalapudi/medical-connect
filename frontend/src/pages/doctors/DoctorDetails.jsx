import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import API from "../../services/api";

import {
  HiOutlineArrowLeft,
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineCheckCircle,
} from "react-icons/hi";

import { toast } from "sonner";

import BookingModal from "../../components/appointments/BookingModal";

const DoctorDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);

  const [loading, setLoading] = useState(true);

  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await API.get(`/doctors/${id}`);

        setDoctor(response.data.doctor);
      } catch (error) {
        toast.error("Doctor not found");

        navigate("/doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="doctors-loading">
        <div className="loader-ring"></div>
      </div>
    );
  }

  if (!doctor) {
    return null;
  }

  const initials = doctor.fullName
    ?.split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="doctor-details-page">
      <button
        className="back-doctors-button"
        onClick={() => navigate("/doctors")}
      >
        <HiOutlineArrowLeft />
        Back to doctors
      </button>

      <div className="doctor-details-card">
        <div className="doctor-details-header">
          <div className="doctor-details-avatar">
            {doctor.profileImage ? (
              <img src={doctor.profileImage} alt={doctor.fullName} />
            ) : (
              initials
            )}
          </div>

          <div className="doctor-details-main">
            <div className="verified-doctor">
              <HiOutlineCheckCircle />
              Verified Doctor
            </div>

            <h1>Dr. {doctor.fullName}</h1>

            <h2>{doctor.specialization}</h2>

            <p>{doctor.qualification}</p>

            <div className="doctor-detail-meta">
              <span>
                <HiOutlineBriefcase />
                {doctor.experience} years experience
              </span>

              <span>
                <HiOutlineLocationMarker />

                {doctor.city || "Online consultation"}
              </span>

              <span>★ {doctor.rating || "New"}</span>
            </div>
          </div>

          <div className="doctor-details-price">
            <span>Consultation fee</span>

            <strong>₹{doctor.consultationFee}</strong>

            <small>per consultation</small>
          </div>
        </div>

        <div className="doctor-details-body">
          <div className="doctor-details-left">
            <section className="doctor-info-section">
              <h3>About Dr. {doctor.fullName}</h3>

              <p>
                {doctor.about ||
                  "This doctor has not added an about description yet."}
              </p>
            </section>

            <section className="doctor-info-section">
              <h3>Services & Expertise</h3>

              <div className="doctor-services">
                {doctor.services?.length > 0 ? (
                  doctor.services.map((service) => (
                    <span key={service}>
                      <HiOutlineCheckCircle />

                      {service}
                    </span>
                  ))
                ) : (
                  <span>General consultation</span>
                )}
              </div>
            </section>

            <section className="doctor-info-section">
              <h3>Languages</h3>

              <div className="doctor-languages">
                {doctor.languages?.length > 0 ? (
                  doctor.languages.map((language) => (
                    <span key={language}>{language}</span>
                  ))
                ) : (
                  <span>English</span>
                )}
              </div>
            </section>
          </div>

          <div className="doctor-booking-card">
            <div className="booking-card-title">
              <h3>Book an appointment</h3>

              <p>Choose a convenient time for your consultation.</p>
            </div>

            <div className="booking-option">
              <HiOutlineCalendar />

              <div>
                <strong>Available days</strong>

                <span>
                  {doctor.availableDays?.join(", ") || "Contact doctor"}
                </span>
              </div>
            </div>

            <div className="booking-option">
              <HiOutlineClock />

              <div>
                <strong>Consultation hours</strong>

                <span>{doctor.availableTime || "Contact doctor"}</span>
              </div>
            </div>

            <button
              className="book-appointment-button"
              onClick={() => setShowBookingModal(true)}
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
      {showBookingModal && (
        <BookingModal
          doctor={doctor}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            toast.success("Your appointment request has been sent");
          }}
        />
      )}
    </div>
  );
};

export default DoctorDetails;
