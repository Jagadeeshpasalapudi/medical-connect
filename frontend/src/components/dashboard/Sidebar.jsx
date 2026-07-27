import { NavLink } from "react-router-dom";

import {
  HiOutlineHome,
  HiOutlineCalendar,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineChatAlt2,
  HiOutlineHeart,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineUsers,
  HiOutlineClipboardList,
} from "react-icons/hi";

import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();

  const patientLinks = [
    {
      name: "Overview",
      path: "/patient/dashboard",
      icon: HiOutlineHome,
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: HiOutlineCalendar,
    },
    {
      name: "Find Doctors",
      path: "/doctors",
      icon: HiOutlineUserGroup,
    },
  ];

  const doctorLinks = [
    {
      name: "Overview",
      path: "/doctor/dashboard",
      icon: HiOutlineHome,
    },
    {
      name: "Appointments",
      path: "/doctor/appointments",
      icon: HiOutlineCalendar,
    },
    {
      name: "My Profile",
      path: "/doctor/profile",
      icon: HiOutlineUserGroup,
    },
  ];

  const adminLinks = [
    {
      name: "Overview",
      path: "/admin/dashboard",
      icon: HiOutlineHome,
    },
    {
      name: "Manage Doctors",
      path: "/admin/doctors",
      icon: HiOutlineUserGroup,
    },
    {
      name: "Manage Users",
      path: "/admin/users",
      icon: HiOutlineUsers,
    },
    {
      name: "Appointments",
      path: "/admin/appointments",
      icon: HiOutlineCalendar,
    },
  ];

  const links =
    user?.role === "patient"
      ? patientLinks
      : user?.role === "doctor"
        ? doctorLinks
        : adminLinks;

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon">+</span>

        <span>
          Medi<span>Connect</span>
        </span>
      </div>

      <div className="sidebar-profile">
        <div className="sidebar-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <strong>{user?.name}</strong>

          <span>{user?.role}</span>
        </div>
      </div>

      <div className="sidebar-section-title">MENU</div>

      <nav className="sidebar-navigation">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <Icon />

              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <button
          type="button"
          className="sidebar-link"
          onClick={() => window.alert("Settings will be available in a future module.")}
        >
          <HiOutlineCog />
          <span>Settings</span>
        </button>

        <button className="sidebar-link logout-link" onClick={logout}>
          <HiOutlineLogout />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
