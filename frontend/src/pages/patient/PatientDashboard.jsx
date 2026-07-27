import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineCalendar,
  HiOutlineHeart,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { toast } from "sonner";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/dashboard/StatCard";
import AppointmentPreview from "../../components/dashboard/AppointmentPreview";

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({ stats: null, appointments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await API.get("/dashboard/patient");
        setData(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="admin-loading">Loading dashboard...</div>;

  const stats = data.stats || {};

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <div>
          <span className="dashboard-eyebrow">PATIENT OVERVIEW</span>
          <h1>Good morning, <span>{user?.name?.split(" ")[0]} 👋</span></h1>
          <p>Your live healthcare overview from your MediConnect account.</p>
        </div>
        <button
          className="primary-dashboard-button"
          onClick={() => navigate("/doctors")}
        >
          + Book Appointment
        </button>
      </div>

      <div className="stats-grid">
        <StatCard title="Upcoming Appointments" value={stats.upcomingAppointments || 0} description="Pending or confirmed" type="blue" icon={<HiOutlineCalendar />} />
        <StatCard title="Completed Visits" value={stats.completedAppointments || 0} description="Completed consultations" type="green" icon={<HiOutlineHeart />} />
        <StatCard title="Total Appointments" value={stats.totalAppointments || 0} description="All your bookings" type="purple" icon={<HiOutlineCalendar />} />
        <StatCard title="Available Doctors" value={stats.availableDoctors || 0} description="Approved and available" type="orange" icon={<HiOutlineUserGroup />} />
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-panel appointments-panel">
          <div className="panel-header">
            <div>
              <h2>Upcoming appointments</h2>
              <p>Your real appointments from the database</p>
            </div>
            <button className="text-button" onClick={() => navigate("/appointments")}>View all</button>
          </div>

          <div className="appointments-list">
            {data.appointments.length ? data.appointments.map((appointment) => (
              <AppointmentPreview key={appointment._id} appointment={appointment} />
            )) : (
              <div className="dashboard-empty-state">
                No upcoming appointments. Find a doctor to book your first consultation.
              </div>
            )}
          </div>
        </section>

        <section className="dashboard-panel health-panel">
          <div className="panel-header">
            <div>
              <h2>Health overview</h2>
              <p>Personal health metrics will appear here when recorded.</p>
            </div>
          </div>
          <div className="dashboard-empty-state">
            No health metrics have been recorded yet.
          </div>
        </section>
      </div>
    </div>
  );
};

export default PatientDashboard;
