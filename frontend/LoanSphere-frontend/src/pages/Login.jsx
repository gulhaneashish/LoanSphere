import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(form);

      localStorage.setItem(
        "token",
        response.data.token
      );

      navigate("/dashboard");
    } catch (error) {
      alert("Login Failed");
    }
  };

  return (
    <div className="login-container">

      {/* Left Side */}
      <div className="login-left">
        <h1>🏦 LoanSphere</h1>

        <h3>Smart Loan Management System</h3>

        <p>
          Manage your loans efficiently with a secure
          and intelligent banking platform.
        </p>

        <div className="features">
          <p>✔ Apply for Loans Online</p>
          <p>✔ Track Loan Status</p>
          <p>✔ Secure Authentication</p>
          <p>✔ Instant Loan Updates</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="login-right">

        <div className="login-card">
          <h2>Welcome Back</h2>

          <p className="subtitle">
            Sign in to continue
          </p>

          <form onSubmit={handleSubmit}>

            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email Address"
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            <input
              type="password"
              className="form-control mb-4"
              placeholder="Password"
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />

            <button
              type="submit"
              className="btn btn-primary w-100"
            >
              Login
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}

export default Login;