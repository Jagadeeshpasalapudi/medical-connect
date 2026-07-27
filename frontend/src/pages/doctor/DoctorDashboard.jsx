import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineCalendar,
  HiOutlineUsers,
  HiOutlineStar,
} from "react-icons/hi";
import { toast } from "sonner";
import API from "../../services/api";import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/dashboard/StatCard";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({ stats: null, appointments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await API.get("/dashboard/doctor");
        setData(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="admin-loading">Loading dashboard...</div>;

  const stats = data.stats || {};

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <div>
          <span className="dashboard-eyebrow">DOCTOR OVERVIEW</span>
          <h1>Good morning, <span>Dr. {user?.name} 👋</span></h1>
          <p>Your live practice overview from your appointment data.</p>
        </div>
        <button className="primary-dashboard-button" onClick={() => navigate("/doctor/profile")}>
          Manage Profile
        </button>
      </div>

      <div className="stats-grid">
        <StatCard title="Today's Appointments" value={stats.todayAppointments || 0} description="Pending or confirmed today" type="blue" icon={<HiOutlineCalendar />} />
        <StatCard title="Total Appointments" value={stats.totalAppointments || 0} description="All-time bookings" type="green" icon={<HiOutlineCalendar />} />
        <StatCard title="Completed Visits" value={stats.completedAppointments || 0} description="Completed consultations" type="purple" icon={<HiOutlineUsers />} />
        <StatCard title="Average Rating" value={stats.totalReviews ? Number(stats.rating || 0).toFixed(1) : "N/A"} description={`${stats.totalReviews || 0} reviews`} type="orange" icon={<HiOutlineStar />} />
      </div>

      <section className="dashboard-panel appointments-panel">
        <div className="panel-header">
          <div>
            <h2>Upcoming schedule</h2>
            <p>Live appointments assigned to you</p>
          </div>
          <button className="text-button" onClick={() => navigate("/doctor/appointments")}>View all</button>
        </div>

        <div className="appointments-list">
          {data.appointments.length ? data.appointments.map((appointment) => (
            <div className="schedule-item" key={appointment._id}>
              <span className="schedule-time">{appointment.appointmentDate} · {appointment.appointmentTime}</span>
              <div className="schedule-patient">
                <div className="patient-avatar">{appointment.patient?.name?.slice(0, 2).toUpperCase() || "PT"}</div>
                <div>
                  <strong>{appointment.patient?.name || "Patient"}</strong>
                  <span>{appointment.reason}</span>
                </div>
              </div>
              <span className={`schedule-status ${appointment.status}`}>{appointment.status}</span>
            </div>
          )) : (
            <div className="dashboard-empty-state">No upcoming appointments.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DoctorDashboard;
