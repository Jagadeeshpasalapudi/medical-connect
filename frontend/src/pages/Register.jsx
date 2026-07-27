import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlinePhone,
  HiOutlineArrowRight,
} from "react-icons/hi";

import { toast } from "sonner";

import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "patient",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill all required fields");

      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");

      return;
    }

    try {
      setLoading(true);

      const response = await register(formData);

      toast.success(response.message);

      if (response.user.role === "patient") {
        navigate("/patient/dashboard");
      }

      if (response.user.role === "doctor") {
        navigate("/doctor/dashboard");
      }

      if (response.user.role === "admin") {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background-shape shape-one"></div>
      <div className="auth-background-shape shape-two"></div>

      <div className="auth-container register-container">
        <div className="auth-brand-panel">
          <div className="brand-logo">
            <span className="brand-icon">+</span>

            <span>
              Medi<span>Connect</span>
            </span>
          </div>

          <div className="brand-content">
            <span className="eyebrow">START YOUR JOURNEY</span>

            <h1>
              Better health
              <span>starts here.</span>
            </h1>

            <p>Join a smarter healthcare experience built around you.</p>
          </div>

          <div className="benefit-list">
            <div>
              <span>✓</span>
              Trusted healthcare professionals
            </div>

            <div>
              <span>✓</span>
              Secure medical records
            </div>

            <div>
              <span>✓</span>
              Easy appointment management
            </div>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="form-header">
            <span className="form-tag">CREATE ACCOUNT</span>

            <h2>
              Let's get you
              <span>connected.</span>
            </h2>

            <p>Create your account in less than a minute.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label>Full name</label>

              <div className="input-wrapper">
                <HiOutlineUser />

                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                />

                <button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label>Email address</label>

              <div className="input-wrapper">
                <HiOutlineMail />

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Phone number</label>

              <div className="input-wrapper">
                <HiOutlinePhone />

                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>

              <div className="input-wrapper">
                <HiOutlineLockClosed />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label>I am a</label>

              <div className="role-selector">
                <label
                  className={
                    formData.role === "patient"
                      ? "role-option active"
                      : "role-option"
                  }
                >
                  <input
                    type="radio"
                    name="role"
                    value="patient"
                    checked={formData.role === "patient"}
                    onChange={handleChange}
                  />

                  <span>👤 Patient</span>
                </label>

                <label
                  className={
                    formData.role === "doctor"
                      ? "role-option active"
                      : "role-option"
                  }
                >
                  <input
                    type="radio"
                    name="role"
                    value="doctor"
                    checked={formData.role === "doctor"}
                    onChange={handleChange}
                  />

                  <span>👨‍⚕️ Doctor</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}

              {!loading && <HiOutlineArrowRight />}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
