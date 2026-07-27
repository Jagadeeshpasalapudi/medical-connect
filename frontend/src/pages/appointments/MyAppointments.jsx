import { useEffect, useState } from "react";

import API from "../../services/api";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineX,
} from "react-icons/hi";

import { toast } from "sonner";


const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const response = await API.get("/appointments/patient");
      setAppointments(response.data.appointments || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load appointments");
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 15000);
    return () => clearInterval(interval);
  }, []);

  const cancelAppointment = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await API.put(`/appointments/${id}/cancel`, { cancellationReason: "Cancelled by patient" });
      toast.success("Appointment cancelled");
      fetchAppointments();
    } catch (error) { toast.error(error.response?.data?.message || "Failed to cancel appointment"); }
  };

  const getStatusClass = (status) => {
    return `appointment-status ${status}`;
  };

  if (loading) {
    return <div className="appointments-loading">Loading appointments...</div>;
  }

  return (
    <div className="appointments-page">
      <div className="appointments-page-header">
        <div>
          <span>YOUR HEALTHCARE JOURNEY</span>

          <h1>My appointments</h1>

          <p>Manage your upcoming and previous consultations.</p>
        </div>

        <div className="appointment-count">
          <strong>{appointments.length}</strong>

          <span>Total appointments</span>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="appointments-empty">
          <div>🗓️</div>

          <h2>No appointments yet</h2>

          <p>Your upcoming appointments will appear here.</p>
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.map((appointment) => {
            const doctor = appointment.doctor;

            return (
              <div className="appointment-card" key={appointment._id}>
                <div className="appointment-doctor">
                  <div className="appointment-avatar">
                    {doctor.profileImage ? (
                      <img src={doctor.profileImage} alt={doctor.fullName} />
                    ) : (
                      doctor.fullName
                        ?.split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)
                    )}
                  </div>

                  <div>
                    <h3>Dr. {doctor.fullName}</h3>

                    <p>{doctor.specialization}</p>

                    <span>{doctor.qualification}</span>
                  </div>
                </div>

                <div className="appointment-info">
                  <div>
                    <HiOutlineCalendar />

                    <span>{appointment.appointmentDate}</span>
                  </div>

                  <div>
                    <HiOutlineClock />

                    <span>{appointment.appointmentTime}</span>
                  </div>

                  <div>
                    <HiOutlineLocationMarker />

                    <span>{appointment.consultationType}</span>
                  </div>
                </div>

                <div className="appointment-right">
                  <span className={getStatusClass(appointment.status)}>
                    {appointment.status}
                  </span>

                  {["pending", "confirmed"].includes(appointment.status) && (
                    <button
                      className="cancel-appointment-button"
                      onClick={() => cancelAppointment(appointment._id)}
                    >
                      <HiOutlineX />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
