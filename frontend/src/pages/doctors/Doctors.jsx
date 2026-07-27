import { useEffect, useState } from "react";

import API from "../../services/api";

import { toast } from "sonner";

import DoctorCard from "../../components/doctors/DoctorCard";

import DoctorFilters from "../../components/doctors/DoctorFilters";


const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    specialization: "All",
    minExperience: "",
    maxFee: "",
  });

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const response = await API.get(`/doctors?${params.toString()}`);

      setDoctors(response.data.doctors);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    const interval = setInterval(fetchDoctors, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="doctors-page">
      <div className="doctors-hero">
        <div className="doctors-hero-content">
          <span className="doctors-eyebrow">FIND YOUR CARE TEAM</span>

          <h1>
            Find the right doctor
            <br />
            <span>for your health.</span>
          </h1>

          <p>
            Connect with trusted healthcare professionals and book your
            consultation with confidence.
          </p>
        </div>

        <div className="doctors-hero-decoration">
          <div className="hero-circle large"></div>
          <div className="hero-circle medium"></div>
          <div className="hero-circle small"></div>
        </div>
      </div>

      <DoctorFilters
        filters={filters}
        setFilters={setFilters}
        onSearch={fetchDoctors}
      />

      <div className="doctors-results-header">
        <div>
          <h2>Recommended doctors</h2>

          <p>{doctors.length} healthcare professionals available</p>
        </div>

        <select className="doctor-sort">
          <option>Recommended</option>

          <option>Highest Rated</option>

          <option>Most Experienced</option>

          <option>Lowest Fee</option>
        </select>
      </div>

      {loading ? (
        <div className="doctors-loading">
          <div className="loader-ring"></div>

          <p>Finding the best doctors...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="doctors-empty">
          <div>🩺</div>

          <h3>No doctors found</h3>

          <p>Try changing your search filters.</p>
        </div>
      ) : (
        <div className="doctors-grid">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;
