import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineArrowRight,
} from "react-icons/hi";

import { toast } from "sonner";

import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");

      return;
    }

    try {
      setLoading(true);

      const response = await login(formData.email, formData.password);

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
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background-shape shape-one"></div>
      <div className="auth-background-shape shape-two"></div>

      <div className="auth-container">
        <div className="auth-brand-panel">
          <div className="brand-logo">
            <span className="brand-icon">+</span>

            <span>
              Medi<span>Connect</span>
            </span>
          </div>

          <div className="brand-content">
            <span className="eyebrow">YOUR HEALTH. OUR PRIORITY.</span>

            <h1>
              Healthcare that
              <span>feels personal.</span>
            </h1>

            <p>
              Connect with trusted healthcare professionals, manage your health
              and take control of your wellness journey.
            </p>
          </div>

          <div className="trust-row">
            <div className="trust-avatars">
              <span>👨‍⚕️</span>
              <span>👩‍⚕️</span>
              <span>🧑‍⚕️</span>
            </div>

            <div>
              <strong>10,000+ patients</strong>

              <small>Trust MediConnect every day</small>
            </div>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="mobile-logo">
            <div className="brand-logo">
              <span className="brand-icon">+</span>
              Medi
              <span>Connect</span>
            </div>
          </div>

          <div className="form-header">
            <span className="form-tag">WELCOME BACK</span>

            <h2>
              Sign in to your
              <span>health journey.</span>
            </h2>

            <p>Enter your details to continue to MediConnect.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
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
              <div className="label-row">
                <label>Password</label>

                <button type="button" className="forgot-btn">
                  Forgot password?
                </button>
              </div>

              <div className="input-wrapper">
                <HiOutlineLockClosed />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}

              {!loading && <HiOutlineArrowRight />}
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <p className="auth-switch">
            Don't have an account?
            <Link to="/register">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
