import { HiOutlineMenuAlt2, HiOutlineBell } from "react-icons/hi";

import { useAuth } from "../../context/AuthContext";

const Topbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="dashboard-topbar">
      {/* Mobile menu button */}
      <button
        type="button"
        className="mobile-menu-button"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <HiOutlineMenuAlt2 />
      </button>

      {/* Search */}
      <div className="topbar-search">
        <span>Search dashboard...</span>
      </div>

      {/* Right actions */}
      <div className="topbar-actions">
        <button type="button" className="notification-button">
          <HiOutlineBell />

          <span className="notification-dot" />
        </button>

        <div className="topbar-user">
          <div className="topbar-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="topbar-user-info">
            <strong>{user?.name}</strong>

            <span>{user?.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
