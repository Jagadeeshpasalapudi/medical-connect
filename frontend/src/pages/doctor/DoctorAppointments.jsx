import { useEffect, useState } from "react";

import API from "../../services/api";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineCheck,
  HiOutlineX,
} from "react-icons/hi";

import { toast } from "sonner";


const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const response = await API.get("/appointments/doctor");
      setAppointments(response.data.appointments || []);
    } catch (error) { toast.error(error.response?.data?.message || "Failed to load appointments"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 15000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/appointments/${id}/status`, { status });
      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch (error) { toast.error(error.response?.data?.message || "Failed to update appointment"); }
  };

  if (loading) {
    return <div className="appointments-loading">Loading appointments...</div>;
  }

  return (
    <div className="appointments-page">
      <div className="appointments-page-header">
        <div>
          <span>PATIENT MANAGEMENT</span>

          <h1>Appointments</h1>

          <p>Manage your upcoming patient consultations.</p>
        </div>

        <div className="appointment-count">
          <strong>{appointments.length}</strong>

          <span>Total requests</span>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="appointments-empty">
          <div>🩺</div>

          <h2>No appointment requests</h2>

          <p>New patient appointments will appear here.</p>
        </div>
      ) : (
        <div className="doctor-appointments-list">
          {appointments.map((appointment) => {
            const patient = appointment.patient;

            return (
              <div className="doctor-appointment-card" key={appointment._id}>
                <div className="patient-info">
                  <div className="patient-avatar">
                    {patient.name
                      ?.split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)}
                  </div>

                  <div>
                    <h3>{patient.name}</h3>

                    <p>{patient.email}</p>
                  </div>
                </div>

                <div className="patient-appointment-details">
                  <div>
                    <HiOutlineCalendar />

                    <span>{appointment.appointmentDate}</span>
                  </div>

                  <div>
                    <HiOutlineClock />

                    <span>{appointment.appointmentTime}</span>
                  </div>

                  <div>
                    <strong>Reason</strong>

                    <span>{appointment.reason}</span>
                  </div>
                </div>

                <div className="doctor-appointment-actions">
                  <span className={`appointment-status ${appointment.status}`}>
                    {appointment.status}
                  </span>

                  {appointment.status === "pending" && (
                    <div className="appointment-action-buttons">
                      <button
                        className="accept-appointment"
                        onClick={() =>
                          updateStatus(appointment._id, "confirmed")
                        }
                      >
                        <HiOutlineCheck />
                        Accept
                      </button>

                      <button
                        className="reject-appointment"
                        onClick={() =>
                          updateStatus(appointment._id, "rejected")
                        }
                      >
                        <HiOutlineX />
                        Reject
                      </button>
                    </div>
                  )}

                  {appointment.status === "confirmed" && (
                    <button
                      className="complete-appointment"
                      onClick={() => updateStatus(appointment._id, "completed")}
                    >
                      Mark Completed
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

export default DoctorAppointments;
