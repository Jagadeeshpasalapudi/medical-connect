import {
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
  HiOutlineCurrencyRupee,
  HiOutlineArrowRight,
} from "react-icons/hi";

import { useNavigate } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  const initials = doctor.fullName
    ?.split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2);

  return (
    <article className="doctor-card">
      <div className="doctor-card-top">
        <div className="doctor-card-avatar">
          {doctor.profileImage ? (
            <img src={doctor.profileImage} alt={doctor.fullName} />
          ) : (
            initials
          )}
        </div>

        <div className="doctor-card-rating">
          <span>★</span>

          {doctor.rating || "New"}

          {doctor.totalReviews > 0 && <small>({doctor.totalReviews})</small>}
        </div>
      </div>

      <div className="doctor-card-content">
        <h3>Dr. {doctor.fullName}</h3>

        <p className="doctor-specialization">{doctor.specialization}</p>

        <p className="doctor-qualification">{doctor.qualification}</p>

        <div className="doctor-card-details">
          <span>
            <HiOutlineBriefcase />
            {doctor.experience} years experience
          </span>

          <span>
            <HiOutlineLocationMarker />

            {doctor.city || "Available online"}
          </span>
        </div>

        <div className="doctor-card-bottom">
          <div className="doctor-fee">
            <span>Consultation fee</span>

            <strong>
              <HiOutlineCurrencyRupee />

              {doctor.consultationFee}
            </strong>
          </div>

          <button
            className="doctor-view-button"
            onClick={() => navigate(`/doctors/${doctor._id}`)}
          >
            <HiOutlineArrowRight />
          </button>
        </div>
      </div>
    </article>
  );
};

export default DoctorCard;
