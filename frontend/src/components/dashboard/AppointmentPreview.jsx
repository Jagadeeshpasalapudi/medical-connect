import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineVideoCamera,
  HiOutlineLocationMarker,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from "react-icons/hi";

import { useNavigate } from "react-router-dom";

const AppointmentPreview = ({ appointment, userRole = "patient", onClick }) => {
  const navigate = useNavigate();

  if (!appointment) {
    return null;
  }

  const {
    _id,
    appointmentDate,
    appointmentTime,
    consultationType,
    status,
    patient,
    doctor,
  } = appointment;

  // ==========================================
  // PERSON DETAILS
  // ==========================================

  const doctorName = doctor?.user?.name || doctor?.name || "Doctor";

  const doctorSpecialization = doctor?.specialization || "Medical Specialist";

  const patientName = patient?.name || "Patient";

  const personName = userRole === "doctor" ? patientName : doctorName;

  const personSubtitle =
    userRole === "doctor" ? "Patient" : doctorSpecialization;

  const personImage =
    userRole === "doctor" ? patient?.profileImage : doctor?.user?.profileImage;

  // ==========================================
  // STATUS
  // ==========================================

  const statusConfig = {
    pending: {
      label: "Pending",
      className: "pending",
      icon: HiOutlineClock,
    },

    confirmed: {
      label: "Confirmed",
      className: "confirmed",
      icon: HiOutlineCheckCircle,
    },

    completed: {
      label: "Completed",
      className: "completed",
      icon: HiOutlineCheckCircle,
    },

    rejected: {
      label: "Rejected",
      className: "rejected",
      icon: HiOutlineXCircle,
    },

    cancelled: {
      label: "Cancelled",
      className: "cancelled",
      icon: HiOutlineXCircle,
    },
  };

  const currentStatus = statusConfig[status] || statusConfig.pending;

  const StatusIcon = currentStatus.icon;

  // ==========================================
  // DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    try {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return date;
    }
  };

  // ==========================================
  // VIEW APPOINTMENT
  // ==========================================

  const handleClick = () => {
    if (onClick) {
      onClick(appointment);
      return;
    }

    if (userRole === "doctor") {
      navigate("/doctor/appointments");
    } else {
      navigate("/patient/appointments");
    }
  };

  return (
    <article className="appointment-preview" onClick={handleClick}>
      {/* =====================================
      TOP
  ===================================== */}

      <div className="appointment-preview-top">
        <div className="appointment-preview-date">
          <span>{formatDate(appointmentDate)}</span>

          <strong>{appointmentTime}</strong>
        </div>

        <div
          className={`appointment-preview-status ${currentStatus.className}`}
        >
          <StatusIcon />

          <span>{currentStatus.label}</span>
        </div>
      </div>

      {/* =====================================
      PERSON
  ===================================== */}

      <div className="appointment-preview-person">
        <div className="appointment-preview-avatar">
          {personImage ? (
            <img src={personImage} alt={personName} />
          ) : (
            <span>
              {personName.replace("Dr. ", "").charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="appointment-preview-info">
          <strong>
            {userRole === "patient" ? `Dr. ${personName}` : personName}
          </strong>

          <span>{personSubtitle}</span>
        </div>

        <HiOutlineArrowRight className="appointment-preview-arrow" />
      </div>

      {/* =====================================
      CONSULTATION TYPE
  ===================================== */}

      <div className="appointment-preview-meta">
        <div>
          {consultationType === "Online Consultation" ? (
            <HiOutlineVideoCamera />
          ) : (
            <HiOutlineLocationMarker />
          )}

          <span>{consultationType}</span>
        </div>

        <div>
          <HiOutlineCalendar />

          <span>Appointment</span>
        </div>
      </div>
    </article>
  );
};

export default AppointmentPreview;
