import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "#f5f7fb",
      }}
    >
      <h1>Welcome, {user?.name} 👋</h1>

      <p>Role: {user?.role}</p>

      <button
        onClick={logout}
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
