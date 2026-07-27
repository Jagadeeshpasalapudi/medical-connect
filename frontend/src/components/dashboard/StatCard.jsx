const StatCard = ({ title, value, description, icon, type }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className={`stat-icon ${type}`}>{icon}</div>

        <span className="stat-trend">+12.5%</span>
      </div>

      <div className="stat-card-value">{value}</div>

      <div className="stat-card-title">{title}</div>

      <div className="stat-card-description">{description}</div>
    </div>
  );
};

export default StatCard;
