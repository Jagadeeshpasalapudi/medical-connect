import { HiOutlineSearch, HiOutlineAdjustments } from "react-icons/hi";

const DoctorFilters = ({ filters, setFilters, onSearch }) => {
  const specializations = [
    "All",
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Orthopedic",
    "Pediatrician",
    "Dentist",
    "Psychiatrist",
  ];

  return (
    <div className="doctor-filters">
      <div className="doctor-search-box">
        <HiOutlineSearch />

        <input
          type="text"
          placeholder="Search doctor or specialization..."
          value={filters.search}
          onChange={(e) =>
            setFilters({
              ...filters,
              search: e.target.value,
            })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
        />
      </div>

      <div className="doctor-filter-select">
        <HiOutlineAdjustments />

        <select
          value={filters.specialization}
          onChange={(e) =>
            setFilters({
              ...filters,
              specialization: e.target.value,
            })
          }
        >
          {specializations.map((specialization) => (
            <option key={specialization} value={specialization}>
              {specialization}
            </option>
          ))}
        </select>
      </div>

      <select
        className="doctor-filter-select simple"
        value={filters.minExperience}
        onChange={(e) =>
          setFilters({
            ...filters,
            minExperience: e.target.value,
          })
        }
      >
        <option value="">Experience</option>

        <option value="5">5+ years</option>

        <option value="10">10+ years</option>

        <option value="15">15+ years</option>
      </select>

      <select
        className="doctor-filter-select simple"
        value={filters.maxFee}
        onChange={(e) =>
          setFilters({
            ...filters,
            maxFee: e.target.value,
          })
        }
      >
        <option value="">Consultation Fee</option>

        <option value="500">Under ₹500</option>

        <option value="1000">Under ₹1,000</option>

        <option value="2000">Under ₹2,000</option>
      </select>

      <button className="doctor-search-button" onClick={onSearch}>
        Search
      </button>
    </div>
  );
};

export default DoctorFilters;
