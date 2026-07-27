import {
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineStar,
  HiOutlineAcademicCap,
  HiOutlineCheckCircle,
  HiOutlineMail,
  HiOutlinePhone,
} from "react-icons/hi";

const DoctorProfileHeader = ({
  doctor,
  onBookAppointment,
  showBookButton = true,
}) => {
  if (!doctor) {
    return null;
  }

  const {
    fullName,
    specialization,
    qualification,
    experience,
    consultationFee,
    profileImage,
    hospital,
    city,
    rating,
    totalReviews,
    isApproved,
    isAvailable,
    user,
  } = doctor;

  const doctorName = fullName || "Doctor";

  const doctorEmail = user?.email || "";

  const doctorPhone = user?.phone || "";

  const location = city || hospital || "Location not specified";

  const handleBookAppointment = () => {
    if (!isAvailable) {
      return;
    }

    if (onBookAppointment) {
      onBookAppointment(doctor);
    }
  };

  return (
    <section className="doctor-profile-header">
      {/* =====================================
          COVER
      ===================================== */}

      <div className="doctor-profile-cover">
        <div className="doctor-profile-cover-glow"></div>
      </div>

      {/* =====================================
          CONTENT
      ===================================== */}

      <div className="doctor-profile-content">
        {/* ===================================
            AVATAR
        =================================== */}

        <div className="doctor-profile-avatar-wrapper">
          <div className="doctor-profile-avatar">
            {profileImage ? (
              <img src={profileImage} alt={`Dr. ${doctorName}`} />
            ) : (
              <span>{doctorName.charAt(0).toUpperCase()}</span>
            )}
          </div>

          {isApproved && (
            <div className="doctor-verified-badge" title="Verified Doctor">
              <HiOutlineCheckCircle />
            </div>
          )}
        </div>

        {/* ===================================
            MAIN INFORMATION
        =================================== */}

        <div className="doctor-profile-main">
          {/* TITLE */}

          <div className="doctor-profile-title-row">
            <div>
              <div className="doctor-profile-eyebrow">
                {isApproved && (
                  <>
                    <HiOutlineCheckCircle />

                    <span>VERIFIED DOCTOR</span>
                  </>
                )}
              </div>

              <h1>Dr. {doctorName}</h1>

              <p className="doctor-profile-specialization">{specialization}</p>
            </div>

            {showBookButton && (
              <button
                className={
                  isAvailable
                    ? "doctor-book-button"
                    : "doctor-book-button disabled"
                }
                onClick={handleBookAppointment}
                disabled={!isAvailable}
              >
                <HiOutlineCalendar />

                {isAvailable ? "Book Appointment" : "Currently Unavailable"}
              </button>
            )}
          </div>

          {/* =================================
              QUICK INFORMATION
          ================================= */}

          <div className="doctor-profile-quick-info">
            <div className="doctor-quick-item">
              <HiOutlineAcademicCap />

              <div>
                <span>QUALIFICATION</span>

                <strong>{qualification}</strong>
              </div>
            </div>

            <div className="doctor-quick-item">
              <HiOutlineClock />

              <div>
                <span>EXPERIENCE</span>

                <strong>{experience}+ Years</strong>
              </div>
            </div>

            <div className="doctor-quick-item">
              <HiOutlineLocationMarker />

              <div>
                <span>LOCATION</span>

                <strong>{location}</strong>
              </div>
            </div>

            <div className="doctor-quick-item">
              <HiOutlineStar />

              <div>
                <span>PATIENT RATING</span>

                <strong>
                  {Number(rating || 0).toFixed(1)}

                  <small>/ 5.0</small>
                </strong>
              </div>
            </div>
          </div>

          {/* =================================
              STATS
          ================================= */}

          <div className="doctor-profile-stats">
            <div className="doctor-profile-stat">
              <strong>{experience}+</strong>

              <span>Years Experience</span>
            </div>

            <div className="doctor-profile-stat">
              <strong>{totalReviews}</strong>

              <span>Patient Reviews</span>
            </div>

            <div className="doctor-profile-stat">
              <strong>₹{consultationFee}</strong>

              <span>Consultation Fee</span>
            </div>

            <div className="doctor-profile-stat availability-stat">
              <strong className={isAvailable ? "available" : "unavailable"}>
                {isAvailable ? "Available" : "Offline"}
              </strong>

              <span>Consultation Status</span>
            </div>
          </div>

          {/* =================================
              CONTACT INFORMATION
          ================================= */}

          {(doctorEmail || doctorPhone) && (
            <div className="doctor-profile-contact">
              {doctorEmail && (
                <div>
                  <HiOutlineMail />

                  <span>{doctorEmail}</span>
                </div>
              )}

              {doctorPhone && (
                <div>
                  <HiOutlinePhone />

                  <span>{doctorPhone}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DoctorProfileHeader;
