import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineVideoCamera,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock as HiPending,
} from "react-icons/hi";

const AppointmentCard = ({
  appointment,
  userRole = "patient",
  onCancel,
  onAccept,
  onReject,
  onComplete,
  onClick,
}) => {
  if (!appointment) return null;

  const {
    _id,
    appointmentDate,
    appointmentTime,
    consultationType,
    reason,
    symptoms,
    status,
    doctorNotes,
    patientNotes,
    cancellationReason,
    createdAt,
    patient,
    doctor,
  } = appointment;

  // ==========================================
  // DOCTOR INFORMATION
  // ==========================================

  const doctorName = doctor?.user?.name || doctor?.name || "Doctor";

  const doctorEmail = doctor?.user?.email || doctor?.email || "";

  const doctorSpecialization = doctor?.specialization || "Medical Specialist";

  const doctorImage =
    doctor?.profileImage || doctor?.image || doctor?.user?.profileImage || "";

  // ==========================================
  // PATIENT INFORMATION
  // ==========================================

  const patientName = patient?.name || "Patient";

  const patientEmail = patient?.email || "";

  const patientImage = patient?.profileImage || patient?.image || "";

  // ==========================================
  // STATUS CONFIGURATION
  // ==========================================

  const statusConfig = {
    pending: {
      label: "Pending",
      className: "pending",
      icon: HiPending,
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
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    try {
      return new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return date;
    }
  };

  // ==========================================
  // FORMAT CREATED DATE
  // ==========================================

  const formatCreatedDate = (date) => {
    if (!date) return "";

    try {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  // ==========================================
  // CONSULTATION ICON
  // ==========================================

  const isOnline = consultationType === "Online Consultation";

  // ==========================================
  // CARD
  // ==========================================

  return (
    <article className={`appointment-card ${status}`} onClick={onClick}>
      {/* =====================================
          TOP
      ===================================== */}

      <div className="appointment-card-top">
        <div className="appointment-card-label">
          <span className="appointment-card-overline">APPOINTMENT</span>

          <span className="appointment-card-id">#{_id?.slice(-8)}</span>
        </div>

        <div className={`appointment-status ${currentStatus.className}`}>
          <StatusIcon />

          <span>{currentStatus.label}</span>
        </div>
      </div>

      {/* =====================================
          PERSON
      ===================================== */}

      <div className="appointment-person-section">
        {userRole === "doctor" || userRole === "admin" ? (
          <>
            <div className="appointment-avatar">
              {patientImage ? (
                <img src={patientImage} alt={patientName} />
              ) : (
                <span>{patientName.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div className="appointment-person-info">
              <span className="appointment-person-label">PATIENT</span>

              <h3>{patientName}</h3>

              {patientEmail && <p>{patientEmail}</p>}
            </div>
          </>
        ) : (
          <>
            <div className="appointment-avatar doctor-avatar">
              {doctorImage ? (
                <img src={doctorImage} alt={doctorName} />
              ) : (
                <span>
                  {doctorName.replace("Dr. ", "").charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="appointment-person-info">
              <span className="appointment-person-label">YOUR DOCTOR</span>

              <h3>Dr. {doctorName}</h3>

              <p>{doctorSpecialization}</p>
            </div>
          </>
        )}
      </div>

      {/* =====================================
          APPOINTMENT DETAILS
      ===================================== */}

      <div className="appointment-details">
        <div className="appointment-detail">
          <div className="appointment-detail-icon">
            <HiOutlineCalendar />
          </div>

          <div>
            <span>DATE</span>

            <strong>{formatDate(appointmentDate)}</strong>
          </div>
        </div>

        <div className="appointment-detail">
          <div className="appointment-detail-icon">
            <HiOutlineClock />
          </div>

          <div>
            <span>TIME</span>

            <strong>{appointmentTime}</strong>
          </div>
        </div>

        <div className="appointment-detail">
          <div className="appointment-detail-icon">
            {isOnline ? <HiOutlineVideoCamera /> : <HiOutlineLocationMarker />}
          </div>

          <div>
            <span>CONSULTATION</span>

            <strong>{consultationType}</strong>
          </div>
        </div>
      </div>

      {/* =====================================
          REASON
      ===================================== */}

      <div className="appointment-reason">
        <span>REASON FOR VISIT</span>

        <p>{reason}</p>
      </div>

      {/* =====================================
          SYMPTOMS
      ===================================== */}

      {symptoms && (
        <div className="appointment-notes">
          <span>SYMPTOMS</span>

          <p>{symptoms}</p>
        </div>
      )}

      {/* =====================================
          PATIENT NOTES
      ===================================== */}

      {patientNotes && (
        <div className="appointment-notes">
          <span>PATIENT NOTES</span>

          <p>{patientNotes}</p>
        </div>
      )}

      {/* =====================================
          DOCTOR NOTES
      ===================================== */}

      {doctorNotes && (
        <div className="appointment-notes">
          <span>DOCTOR NOTES</span>

          <p>{doctorNotes}</p>
        </div>
      )}

      {/* =====================================
          CANCELLATION REASON
      ===================================== */}

      {cancellationReason && (
        <div className="appointment-cancellation">
          <span>CANCELLATION REASON</span>

          <p>{cancellationReason}</p>
        </div>
      )}

      {/* =====================================
          FOOTER
      ===================================== */}

      <div className="appointment-card-footer">
        <span className="appointment-created">
          {createdAt && `Booked ${formatCreatedDate(createdAt)}`}
        </span>

        <div className="appointment-actions">
          {/* PATIENT CANCEL */}

          {userRole === "patient" && status === "pending" && (
            <button
              className="appointment-cancel-button"
              onClick={(event) => {
                event.stopPropagation();

                if (onCancel) {
                  onCancel(_id);
                }
              }}
            >
              Cancel
            </button>
          )}

          {/* DOCTOR ACCEPT / REJECT */}

          {userRole === "doctor" && status === "pending" && (
            <>
              <button
                className="appointment-reject-button"
                onClick={(event) => {
                  event.stopPropagation();

                  if (onReject) {
                    onReject(_id);
                  }
                }}
              >
                Reject
              </button>

              <button
                className="appointment-accept-button"
                onClick={(event) => {
                  event.stopPropagation();

                  if (onAccept) {
                    onAccept(_id);
                  }
                }}
              >
                Accept
              </button>
            </>
          )}

          {/* DOCTOR COMPLETE */}

          {userRole === "doctor" && status === "confirmed" && (
            <button
              className="appointment-complete-button"
              onClick={(event) => {
                event.stopPropagation();

                if (onComplete) {
                  onComplete(_id);
                }
              }}
            >
              Mark Completed
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default AppointmentCard;
