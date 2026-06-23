import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await loginUser(form);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      const backendMessage = error.response?.data;
      setErrorMsg(typeof backendMessage === "string" ? backendMessage : "Invalid email address or password.");
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
              <span className="feature-text">Automated credit eligibility scoring</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="login-right">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to manage your account</p>

          {errorMsg && (
            <div className="alert alert-danger py-2 text-center" role="alert" style={{ fontSize: "0.9rem", borderRadius: "10px" }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
              {loading ? "Signing in..." : "Login"} <FiArrowRight />
            </button>
          </form>

          <div className="form-footer">
            Don't have an account? 
            <Link to="/register">Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;