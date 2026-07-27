import { useEffect, useState } from "react";

import API from "../../services/api";

import { HiOutlineX, HiOutlineCalendar, HiOutlineClock } from "react-icons/hi";

import { toast } from "sonner";


const BookingModal = ({ doctor, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    appointmentDate: "",
    appointmentTime: "",
    consultationType: "Online Consultation",
    reason: "",
    symptoms: "",
    patientNotes: "",
  });

  const [bookedSlots, setBookedSlots] = useState([]);

  const [loading, setLoading] = useState(false);

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
  ];

  const getTodayDate = () => {
    const today = new Date();

    return today.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (formData.appointmentDate) {
      fetchBookedSlots();
    }
  }, [formData.appointmentDate]);

  const fetchBookedSlots = async () => {
    try {
      const response = await API.get("/appointments/booked-slots", { params: { doctorId: doctor._id, date: formData.appointmentDate } });
      setBookedSlots(response.data.bookedSlots || []);
    } catch (error) { console.error(error); }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.appointmentDate ||
      !formData.appointmentTime ||
      !formData.reason
    ) {
      toast.error("Please fill all required fields");

      return;
    }

    try {
      setLoading(true);


      await API.post("/appointments", { doctorId: doctor._id, ...formData });

      toast.success("Appointment booked successfully");

      onSuccess();

      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to book appointment",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="booking-modal-header">
          <div>
            <span>BOOK APPOINTMENT</span>

            <h2>Dr. {doctor.fullName}</h2>

            <p>{doctor.specialization}</p>
          </div>

          <button onClick={onClose} className="close-booking-modal">
            <HiOutlineX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="booking-form-row">
            <div className="booking-field">
              <label>
                <HiOutlineCalendar />
                Select date
              </label>

              <input
                type="date"
                name="appointmentDate"
                min={getTodayDate()}
                value={formData.appointmentDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="booking-field">
              <label>Consultation type</label>

              <select
                name="consultationType"
                value={formData.consultationType}
                onChange={handleChange}
              >
                <option>Online Consultation</option>

                <option>In-Person Visit</option>
              </select>
            </div>
          </div>

          <div className="booking-field">
            <label>
              <HiOutlineClock />
              Select time slot
            </label>

            <div className="time-slots">
              {timeSlots.map((time) => {
                const isBooked = bookedSlots.includes(time);

                const isSelected = formData.appointmentTime === time;

                return (
                  <button
                    type="button"
                    key={time}
                    disabled={isBooked}
                    className={`
                        time-slot
                        ${isSelected ? "selected" : ""}
                        ${isBooked ? "booked" : ""}
                      `}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        appointmentTime: time,
                      })
                    }
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="booking-field">
            <label>What is the reason for your visit?</label>

            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Example: Regular checkup"
              required
            />
          </div>

          <div className="booking-field">
            <label>Describe your symptoms</label>

            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              placeholder="Tell the doctor about your symptoms..."
              rows="4"
            />
          </div>

          <div className="booking-field">
            <label>Additional notes</label>

            <textarea
              name="patientNotes"
              value={formData.patientNotes}
              onChange={handleChange}
              placeholder="Anything else the doctor should know?"
              rows="3"
            />
          </div>

          <div className="booking-summary">
            <div>
              <span>Consultation fee</span>

              <strong>₹{doctor.consultationFee}</strong>
            </div>

            <div>
              <span>Appointment</span>

              <strong>{formData.appointmentDate || "Select date"}</strong>
            </div>
          </div>

          <button
            type="submit"
            className="confirm-booking-button"
            disabled={loading || !formData.appointmentTime}
          >
            {loading ? "Booking..." : "Confirm Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
