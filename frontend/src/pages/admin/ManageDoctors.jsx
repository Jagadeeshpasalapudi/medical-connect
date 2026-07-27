import { useEffect, useState } from "react";

import API from "../../services/api";

import { HiOutlineCheck, HiOutlineX, HiOutlineSearch } from "react-icons/hi";

import { toast } from "sonner";


const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      const response = await API.get("/admin/doctors");

      setDoctors(response.data.doctors);
    } catch (error) {
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    const interval = setInterval(fetchDoctors, 15000);
    return () => clearInterval(interval);
  }, []);

  const updateDoctorStatus = async (id, action) => {
    try {
      await API.put(`/admin/doctors/${id}/${action}`);
      toast.success(action === "approve" ? "Doctor approved" : "Doctor rejected");
      fetchDoctors();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update doctor");
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const name = doctor.user?.name || doctor.fullName || "";

    const specialization = doctor.specialization || "";

    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      specialization.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="admin-management-page">
      <div className="admin-page-header">
        <div>
          <span>MEDICAL PROFESSIONALS</span>

          <h1>Manage doctors</h1>

          <p>Review and manage doctor registrations.</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search">
          <HiOutlineSearch />

          <input
            type="text"
            placeholder="Search doctors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-doctors-table">
        <div className="admin-table-header">
          <span>DOCTOR</span>

          <span>SPECIALIZATION</span>

          <span>EXPERIENCE</span>

          <span>STATUS</span>

          <span>ACTIONS</span>
        </div>

        {loading ? (
          <div className="table-empty">Loading doctors...</div>
        ) : filteredDoctors.length === 0 ? (
          <div className="table-empty">No doctors found</div>
        ) : (
          filteredDoctors.map((doctor) => (
            <div className="admin-table-row" key={doctor._id}>
              <div className="admin-doctor-cell">
                <div className="admin-doctor-avatar">
                  {(doctor.user?.name || doctor.fullName || "D")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <strong>Dr. {doctor.user?.name || doctor.fullName}</strong>

                  <span>{doctor.user?.email}</span>
                </div>
              </div>

              <div>{doctor.specialization}</div>

              <div>{doctor.experience} years</div>

              <div>
                <span
                  className={
                    doctor.isApproved
                      ? "status-badge approved"
                      : "status-badge pending"
                  }
                >
                  {doctor.isApproved ? "Approved" : "Pending"}
                </span>
              </div>

              <div className="admin-actions">
                {!doctor.isApproved && (
                  <button
                    className="approve-button"
                    onClick={() => updateDoctorStatus(doctor._id, "approve")}
                  >
                    <HiOutlineCheck />
                    Approve
                  </button>
                )}

                {doctor.isApproved && (
                  <button
                    className="reject-button"
                    onClick={() => updateDoctorStatus(doctor._id, "reject")}
                  >
                    <HiOutlineX />
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageDoctors;
