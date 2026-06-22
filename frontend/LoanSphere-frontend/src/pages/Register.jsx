import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import "./Login.css";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    setLoading(true);

    try {
      await registerUser(form);
      setStatus({ type: "success", message: "Account created successfully! Redirecting..." });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      const backendMessage = error.response?.data;
      setStatus({
        type: "danger",
        message: typeof backendMessage === "string" ? backendMessage : "Registration failed. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Branding Panel */}
      <div className="login-left">
        <div className="brand-wrapper">
          <h1>🏦 LoanSphere</h1>
          <h3>Smart Loan Management System</h3>
          <p className="desc">
            Experience next-generation financial services. Apply, monitor, and
            manage your loans seamlessly with a secure, automated banking platform.
          </p>

          <div className="features">
            <div className="feature-item">
              <div className="feature-icon">
                <FiCheckCircle />
              </div>
              <span className="feature-text">Apply for Loans Online instantly</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <FiCheckCircle />
              </div>
              <span className="feature-text">Track application status in real-time</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <FiCheckCircle />
              </div>
              <span className="feature-text">AI-powered credit eligibility scoring</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="login-right">
        <div className="login-card">
          <h2>Create Account</h2>
          <p className="subtitle">Sign up for a new customer profile</p>

          {status.message && (
            <div className={`alert alert-${status.type} py-2 text-center`} role="alert" style={{ fontSize: "0.9rem", borderRadius: "10px" }}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group-custom">
              <input
                type="text"
                required
                className="form-control-custom"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
              <FiUser className="input-icon" />
            </div>

            <div className="input-group-custom">
              <input
                type="email"
                required
                className="form-control-custom"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />
              <FiMail className="input-icon" />
            </div>

            <div className="input-group-custom">
              <input
                type="password"
                required
                className="form-control-custom"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />
              <FiLock className="input-icon" />
            </div>

            <button type="submit" className="btn-gradient" disabled={loading}>
              {loading ? "Registering..." : "Register"} <FiArrowRight />
            </button>
          </form>

          <div className="form-footer">
            Already have an account? 
            <Link to="/">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;