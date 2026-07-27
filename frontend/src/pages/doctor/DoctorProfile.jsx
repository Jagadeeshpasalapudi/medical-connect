import { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "sonner";

const initialForm = {
  fullName: "",
  specialization: "",
  qualification: "",
  experience: "",
  consultationFee: "",
  about: "",
  profileImage: "",
  hospital: "",
  city: "",
  languages: [],
  services: [],
  availableDays: [],
  availableTime: "",
  isAvailable: true,
};

const specializations = [
  "Cardiologist", "Dermatologist", "Neurologist", "Orthopedic",
  "Pediatrician", "Dentist", "Psychiatrist", "General Physician",
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DoctorProfile = () => {
  const [formData, setFormData] = useState(initialForm);
  const [languageInput, setLanguageInput] = useState("");
  const [serviceInput, setServiceInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("/doctors/profile/me");
        setFormData({ ...initialForm, ...response.data.doctor, languages: response.data.doctor.languages || [], services: response.data.doctor.services || [], availableDays: response.data.doctor.availableDays || [] });
      } catch (error) {
        if (error.response?.status !== 404) {
          toast.error(error.response?.data?.message || "Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addItem = (field, value, clear) => {
    const clean = value.trim();
    if (!clean || formData[field].includes(clean)) return;
    setFormData((current) => ({ ...current, [field]: [...current[field], clean] }));
    clear("");
  };

  const removeItem = (field, item) => {
    setFormData((current) => ({
      ...current,
      [field]: current[field].filter((value) => value !== item),
    }));
  };

  const toggleDay = (day) => {
    setFormData((current) => ({
      ...current,
      availableDays: current.availableDays.includes(day)
        ? current.availableDays.filter((value) => value !== day)
        : [...current.availableDays, day],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      await API.put("/doctors/profile/me", {
        ...formData,
        experience: Number(formData.experience),
        consultationFee: Number(formData.consultationFee),
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="doctors-loading"><div className="loader-ring"></div></div>;

  return (
    <div className="doctor-profile-page">
      <div className="doctor-profile-header">
        <div>
          <span>PROFESSIONAL PROFILE</span>
          <h1>Complete your doctor profile</h1>
          <p>Every field below is saved to your MongoDB doctor profile.</p>
        </div>
      </div>

      <form className="doctor-profile-form" onSubmit={handleSubmit}>
        <div className="profile-form-section">
          <h2>Professional information</h2>
          <div className="profile-form-grid">
            <div className="form-field"><label>Full name</label><input name="fullName" value={formData.fullName} onChange={handleChange} required /></div>
            <div className="form-field"><label>Specialization</label><select name="specialization" value={formData.specialization} onChange={handleChange} required><option value="">Select specialization</option>{specializations.map((item) => <option key={item}>{item}</option>)}</select></div>
            <div className="form-field"><label>Qualification</label><input name="qualification" value={formData.qualification} onChange={handleChange} required /></div>
            <div className="form-field"><label>Years of experience</label><input type="number" name="experience" min="0" value={formData.experience} onChange={handleChange} required /></div>
            <div className="form-field"><label>Consultation fee</label><input type="number" name="consultationFee" min="0" value={formData.consultationFee} onChange={handleChange} required /></div>
            <div className="form-field"><label>Profile image URL</label><input name="profileImage" value={formData.profileImage} onChange={handleChange} placeholder="https://..." /></div>
            <div className="form-field"><label>Hospital / Clinic</label><input name="hospital" value={formData.hospital} onChange={handleChange} /></div>
            <div className="form-field"><label>City</label><input name="city" value={formData.city} onChange={handleChange} /></div>
            <div className="form-field"><label>Consultation hours</label><input name="availableTime" value={formData.availableTime} onChange={handleChange} placeholder="10:00 AM - 5:00 PM" /></div>
          </div>
        </div>

        <div className="profile-form-section">
          <h2>Languages</h2>
          <div className="inline-add-field"><input value={languageInput} onChange={(e) => setLanguageInput(e.target.value)} placeholder="e.g. English" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem("languages", languageInput, setLanguageInput))} /><button type="button" onClick={() => addItem("languages", languageInput, setLanguageInput)}>Add</button></div>
          <div className="tag-list">{formData.languages.map((item) => <span key={item}>{item}<button type="button" onClick={() => removeItem("languages", item)}>×</button></span>)}</div>
        </div>

        <div className="profile-form-section">
          <h2>Services & expertise</h2>
          <div className="inline-add-field"><input value={serviceInput} onChange={(e) => setServiceInput(e.target.value)} placeholder="e.g. ECG consultation" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem("services", serviceInput, setServiceInput))} /><button type="button" onClick={() => addItem("services", serviceInput, setServiceInput)}>Add</button></div>
          <div className="tag-list">{formData.services.map((item) => <span key={item}>{item}<button type="button" onClick={() => removeItem("services", item)}>×</button></span>)}</div>
        </div>

        <div className="profile-form-section">
          <h2>Available days</h2>
          <div className="day-selector">{days.map((day) => <label key={day}><input type="checkbox" checked={formData.availableDays.includes(day)} onChange={() => toggleDay(day)} />{day}</label>)}</div>
        </div>

        <div className="profile-form-section">
          <h2>About your practice</h2>
          <div className="form-field"><label>About you</label><textarea name="about" value={formData.about} onChange={handleChange} rows="6" /></div>
          <label className="availability-toggle"><input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} /> Accepting new appointments</label>
        </div>

        <button type="submit" className="save-profile-button" disabled={saving}>{saving ? "Saving..." : "Save Profile"}</button>
      </form>
    </div>
  );
};

export default DoctorProfile;
