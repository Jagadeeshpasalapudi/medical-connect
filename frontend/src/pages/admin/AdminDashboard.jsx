import { useEffect, useState } from "react";

import API from "../../services/api";

import {
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { toast } from "sonner";


import "../../styles/admin.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  const [monthlyData, setMonthlyData] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await API.get("/admin/stats");
      setStats(response.data.stats);
      setMonthlyData((response.data.monthlyAppointments || []).map((item) => ({ month: `Month ${item._id}`, appointments: item.count })));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load admin dashboard");
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="admin-loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      {/* HEADER */}

      <div className="admin-page-header">
        <div>
          <span>MEDICONNECT ADMINISTRATION</span>

          <h1>Platform overview</h1>

          <p>Monitor and manage your healthcare platform.</p>
        </div>

        <div className="admin-live-status">
          <span></span>
          System operational
        </div>
      </div>

      {/* STAT CARDS */}

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon blue">
            <HiOutlineUsers />
          </div>

          <div>
            <span>Total Patients</span>

            <strong>{stats?.totalUsers || 0}</strong>

            <small>Registered users</small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon purple">
            <HiOutlineUserGroup />
          </div>

          <div>
            <span>Total Doctors</span>

            <strong>{stats?.totalDoctors || 0}</strong>

            <small>Medical professionals</small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon orange">
            <HiOutlineClock />
          </div>

          <div>
            <span>Pending Doctors</span>

            <strong>{stats?.pendingDoctors || 0}</strong>

            <small>Awaiting approval</small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon green">
            <HiOutlineCalendar />
          </div>

          <div>
            <span>Appointments</span>

            <strong>{stats?.totalAppointments || 0}</strong>

            <small>Total bookings</small>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}

      <div className="admin-content-grid">
        {/* CHART */}

        <div className="admin-panel chart-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Appointment activity</h2>

              <p>Monthly booking overview</p>
            </div>

            <HiOutlineCalendar />
          </div>

          <div className="admin-chart">
            {monthlyData.length === 0 ? (
              <div className="chart-empty">No appointment data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip />

                  <Bar dataKey="appointments" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* QUICK STATUS */}

        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Platform health</h2>

              <p>Current system summary</p>
            </div>
          </div>

          <div className="health-list">
            <div className="health-item">
              <div className="health-icon green">
                <HiOutlineCheckCircle />
              </div>

              <div>
                <strong>Approved doctors</strong>

                <span>Available on platform</span>
              </div>

              <b>{stats?.approvedDoctors || 0}</b>
            </div>

            <div className="health-item">
              <div className="health-icon orange">
                <HiOutlineExclamationCircle />
              </div>

              <div>
                <strong>Pending approvals</strong>

                <span>Require review</span>
              </div>

              <b>{stats?.pendingDoctors || 0}</b>
            </div>

            <div className="health-item">
              <div className="health-icon blue">
                <HiOutlineCalendar />
              </div>

              <div>
                <strong>Active appointments</strong>

                <span>Awaiting completion</span>
              </div>

              <b>{stats?.pendingAppointments || 0}</b>
            </div>

            <div className="health-item">
              <div className="health-icon purple">
                <HiOutlineCheckCircle />
              </div>

              <div>
                <strong>Completed consultations</strong>

                <span>Successfully completed</span>
              </div>

              <b>{stats?.completedAppointments || 0}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
