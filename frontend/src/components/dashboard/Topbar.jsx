import { HiOutlineBell, HiOutlineSearch, HiOutlineMenu } from "react-icons/hi";

import { useAuth } from "../../context/AuthContext";

const Topbar = () => {
  const { user } = useAuth();

  return (
    <header className="dashboard-topbar">
      <button className="mobile-menu-button">
        <HiOutlineMenu />
      </button>

      <div className="topbar-search">
        <HiOutlineSearch />

        <input type="text" placeholder="Search anything..." />
      </div>

      <div className="topbar-actions">
        <button className="notification-button">
          <HiOutlineBell />

          <span className="notification-dot"></span>
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
