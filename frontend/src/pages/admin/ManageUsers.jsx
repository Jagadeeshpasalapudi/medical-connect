import { useEffect, useState } from "react";

import API from "../../services/api";

import { HiOutlineTrash, HiOutlineSearch } from "react-icons/hi";

import { toast } from "sonner";


const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await API.get("/admin/users");

      setUsers(response.data.users);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 15000);
    return () => clearInterval(interval);
  }, []);

  const deleteUser = async (id) => {
    const confirmed = window.confirm("Delete this user?");

    if (!confirmed) return;

    try {
      await API.delete(`/admin/users/${id}`);

      toast.success("User deleted");

      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const toggleUserStatus = async (id) => {
    try {
      const response = await API.put(`/admin/users/${id}/toggle-status`);
      setUsers((items) => items.map((item) => item._id === id ? { ...item, isActive: response.data.user.isActive } : item));
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user status");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="admin-management-page">
      <div className="admin-page-header">
        <div>
          <span>USER MANAGEMENT</span>

          <h1>Manage patients</h1>

          <p>View and manage registered patients.</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search">
          <HiOutlineSearch />

          <input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-users-table">
        {filteredUsers.map((user) => (
          <div className="admin-user-row" key={user._id}>
            <div className="admin-user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="admin-user-details">
              <strong>{user.name}</strong>

              <span>{user.email}</span>
            </div>

            <span className="user-role-badge">{user.role}</span>

            <span className="user-date">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>

            <button type="button" className="secondary-admin-button" onClick={() => toggleUserStatus(user._id)}>
              {user.isActive ? "Disable" : "Activate"}
            </button>

            <button
              className="delete-user-button"
              onClick={() => deleteUser(user._id)}
            >
              <HiOutlineTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
