import { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "sonner";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineSearch,
  HiOutlineRefresh,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClipboardList,
} from "react-icons/hi";

import AppointmentCard from "../../components/appointments/AppointmentCard";
import { useAuth } from "../../context/AuthContext";

import "../../styles/appointments.css";

const ManageAppointments = () => {
  const { user, loading: authLoading } = useAuth();

  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [activeFilter, setActiveFilter] = useState("all");

  // ==========================================
  // FETCH APPOINTMENTS
  // ==========================================

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const response = await API.get(user?.role === "admin" ? "/admin/appointments" : "/appointments/doctor");

      setAppointments(response.data.appointments || response.data || []);
    } catch (error) {
      console.error("Fetch appointments error:", error);

      toast.error(
        error.response?.data?.message || "Failed to load appointments",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    if (!user || !["doctor", "admin"].includes(user.role)) return undefined;
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 15000);
    return () => clearInterval(interval);
  }, [user]);

  // ==========================================
  // UPDATE APPOINTMENT STATUS
  // ==========================================

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const endpoint = user?.role === "admin" ? `/admin/appointments/${appointmentId}/status` : `/appointments/${appointmentId}/status`;
      await API.put(endpoint, { status });

      setAppointments((previousAppointments) =>
        previousAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? {
                ...appointment,
                status,
              }
            : appointment,
        ),
      );

      const messages = {
        confirmed: "Appointment confirmed successfully",

        rejected: "Appointment rejected",

        completed: "Appointment marked as completed",
      };

      toast.success(messages[status] || "Appointment updated successfully");
    } catch (error) {
      console.error("Update appointment error:", error);

      toast.error(
        error.response?.data?.message || "Failed to update appointment",
      );
    }
  };

  // ==========================================
  // ACCEPT
  // ==========================================

  const handleAccept = (appointmentId) => {
    updateAppointmentStatus(appointmentId, "confirmed");
  };

  // ==========================================
  // REJECT
  // ==========================================

  const handleReject = (appointmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this appointment?",
    );

    if (!confirmed) {
      return;
    }

    updateAppointmentStatus(appointmentId, "rejected");
  };

  // ==========================================
  // COMPLETE
  // ==========================================

  const handleComplete = (appointmentId) => {
    updateAppointmentStatus(appointmentId, "completed");
  };

  // ==========================================
  // FILTER
  // ==========================================

  const filterOptions = [
    {
      label: "All",
      value: "all",
    },

    {
      label: "Pending",
      value: "pending",
    },

    {
      label: "Confirmed",
      value: "confirmed",
    },

    {
      label: "Completed",
      value: "completed",
    },

    {
      label: "Rejected",
      value: "rejected",
    },

    {
      label: "Cancelled",
      value: "cancelled",
    },
  ];

  // ==========================================
  // FILTERED APPOINTMENTS
  // ==========================================

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesStatus =
      activeFilter === "all" || appointment.status === activeFilter;

    const patientName = appointment.patient?.name || "";

    const searchValue = `${patientName} ${
      appointment.reason || ""
    } ${appointment.appointmentDate || ""}`.toLowerCase();

    const matchesSearch = searchValue.includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // ==========================================
  // STATISTICS
  // ==========================================

  const pendingCount = appointments.filter(
    (appointment) => appointment.status === "pending",
  ).length;

  const confirmedCount = appointments.filter(
    (appointment) => appointment.status === "confirmed",
  ).length;

  const completedCount = appointments.filter(
    (appointment) => appointment.status === "completed",
  ).length;

  const totalCount = appointments.length;

  // ==========================================
  // LOADING
  // ==========================================

  if (authLoading || loading) {
    return (
      <div className="appointments-loading">
            <div className="appointments-spinner"></div>

            <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="appointments-page">
        {/* ====================================
        HEADER
    ==================================== */}

        <div className="appointments-page-header">
          <div>
            <span className="appointments-eyebrow">DOCTOR PORTAL</span>

            <h1>Manage Appointments</h1>

            <p>Review and manage your patient appointments.</p>
          </div>

          <button
            className="appointments-refresh-button"
            onClick={fetchAppointments}
          >
            <HiOutlineRefresh />
            Refresh
          </button>
        </div>

        {/* ====================================
        STATS
    ==================================== */}

        <div className="appointments-stats-grid">
          <div className="appointment-stat-card">
            <div className="appointment-stat-icon total">
              <HiOutlineClipboardList />
            </div>

            <div>
              <span>TOTAL</span>

              <strong>{totalCount}</strong>
            </div>
          </div>

          <div className="appointment-stat-card">
            <div className="appointment-stat-icon pending">
              <HiOutlineClock />
            </div>

            <div>
              <span>PENDING</span>

              <strong>{pendingCount}</strong>
            </div>
          </div>

          <div className="appointment-stat-card">
            <div className="appointment-stat-icon confirmed">
              <HiOutlineCheckCircle />
            </div>

            <div>
              <span>CONFIRMED</span>

              <strong>{confirmedCount}</strong>
            </div>
          </div>

          <div className="appointment-stat-card">
            <div className="appointment-stat-icon completed">
              <HiOutlineCalendar />
            </div>

            <div>
              <span>COMPLETED</span>

              <strong>{completedCount}</strong>
            </div>
          </div>
        </div>

        {/* ====================================
        TOOLBAR
    ==================================== */}

        <div className="appointments-toolbar">
          <div className="appointments-search">
            <HiOutlineSearch />

            <input
              type="text"
              placeholder="Search patients or appointments..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="appointments-filters">
            {filterOptions.map((filter) => (
              <button
                key={filter.value}
                className={activeFilter === filter.value ? "active" : ""}
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* ====================================
        APPOINTMENTS
    ==================================== */}

        {filteredAppointments.length === 0 ? (
          <div className="appointments-empty">
            <div className="appointments-empty-icon">
              <HiOutlineCalendar />
            </div>

            <h3>No appointments found</h3>

            <p>
              {searchTerm
                ? "Try changing your search."
                : "You currently have no appointments in this category."}
            </p>
          </div>
        ) : (
          <div className="appointments-grid">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                userRole={user?.role === "admin" ? "admin" : "doctor"}
                onAccept={handleAccept}
                onReject={handleReject}
                onComplete={handleComplete}
              />
            ))}
          </div>
        )}
    </div>
  );
};

export default ManageAppointments;
