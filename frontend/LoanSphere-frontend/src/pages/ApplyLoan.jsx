import { useState, useEffect } from "react";
import { applyLoan } from "../services/loanService";
import { getCurrentUser } from "../services/authService";
import { getProfile } from "../services/profileService";
import Navbar from "../components/Navbar";
import { FiDollarSign, FiClock, FiFileText } from "react-icons/fi";
import "./Dashboard.css";

function ApplyLoan() {
  const [loan, setLoan] = useState({
    userId: "",
    loanAmount: "",
    loanTenure: "",
    loanType: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [profileUpdated, setProfileUpdated] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setMessage({ type: "", text: "" });
      try {
        const userRes = await getCurrentUser();
        if (userRes && userRes.data && userRes.data.userId) {
          const userId = userRes.data.userId;
          setLoan((prev) => ({
            ...prev,
            userId: userId,
          }));

          // Check if profile exists / is updated
          try {
            await getProfile(userId);
            setProfileUpdated(true);
          } catch (profileError) {
            console.error("Profile check failed:", profileError);
            setProfileUpdated(false);
            setMessage({
              type: "danger",
              text: "Please add your profile details first",
            });
          }
        } else {
          setMessage({
            type: "danger",
            text: "Failed to retrieve user ID. Please log in again.",
          });
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setMessage({
          type: "danger",
          text: "Session expired or user service offline. Please log in again.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    if (!profileUpdated) {
      setMessage({
        type: "danger",
        text: "Please add your profile details first",
      });
      setSubmitting(false);
      return;
    }

    if (!loan.userId) {
      setMessage({
        type: "danger",
        text: "User session not active. Cannot submit loan application.",
      });
      setSubmitting(false);
      return;
    }

    if (!loan.loanAmount || !loan.loanTenure || !loan.loanType) {
      setMessage({
        type: "danger",
        text: "Please fill in all the required fields.",
      });
      setSubmitting(false);
      return;
    }

    // Client-side validations
    const amountVal = parseFloat(loan.loanAmount);
    if (isNaN(amountVal) || amountVal < 1000) {
      setMessage({
        type: "danger",
        text: "Minimum loan amount is ₹1,000.",
      });
      setSubmitting(false);
      return;
    }

    const tenureVal = parseInt(loan.loanTenure, 10);
    if (isNaN(tenureVal) || tenureVal < 1) {
      setMessage({
        type: "danger",
        text: "Minimum tenure is 1 month.",
      });
      setSubmitting(false);
      return;
    }

    try {
      await applyLoan(loan);
      setMessage({
        type: "success",
        text: "Loan application submitted successfully!",
      });
      // Reset form fields except userId
      setLoan((prev) => ({
        ...prev,
        loanAmount: "",
        loanTenure: "",
        loanType: "",
      }));
    } catch (error) {
      console.error("Loan application failed:", error);
      const backendError = error.response?.data;
      setMessage({
        type: "danger",
        text: typeof backendError === "string" ? backendError : "Loan application failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="container">
        {/* Welcome Banner Card */}
        <div className="welcome-banner">
          <h2>Apply for a New Loan</h2>
          <p>
            Submit your application details below. Our automated evaluation engine
            will compute your eligibility rank, interest rates, and approval status dynamically.
          </p>
        </div>

        {message.text && (
          <div
            className={`alert alert-${message.type} mb-4 py-3 text-center`}
            role="alert"
            style={{ borderRadius: "12px", fontSize: "0.95rem" }}
          >
            {message.text === "Please add your profile details first" ? (
              <span>
                Please add your profile details first. Go to{" "}
                <a href="/profile" className="alert-link">
                  Profile Details
                </a>{" "}
                to update.
              </span>
            ) : (
              message.text
            )}
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading session...</span>
            </div>
            <p className="mt-3 text-muted">Securing session and fetching credentials...</p>
          </div>
        ) : (
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "12px" }}>
                <h4 className="fw-bold mb-4 text-primary">📝 Loan Application Form</h4>
                
                <form onSubmit={handleSubmit}>
                  {/* Loan Amount */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Loan Amount (₹) *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light fw-semibold text-muted">
                        ₹
                      </span>
                      <input
                        type="number"
                        required
                        className="form-control"
                        placeholder="e.g. 50000"
                        value={loan.loanAmount}
                        onChange={(e) =>
                          setLoan({
                            ...loan,
                            loanAmount: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Loan Tenure */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Loan Tenure (Months) *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FiClock className="text-muted" />
                      </span>
                      <input
                        type="number"
                        required
                        className="form-control"
                        placeholder="e.g. 24"
                        value={loan.loanTenure}
                        onChange={(e) =>
                          setLoan({
                            ...loan,
                            loanTenure: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Loan Type */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Loan Type *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FiFileText className="text-muted" />
                      </span>
                      <select
                        className="form-select"
                        required
                        value={loan.loanType}
                        onChange={(e) =>
                          setLoan({
                            ...loan,
                            loanType: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Loan Type</option>
                        <option value="HOME_LOAN">🏠 Home Loan</option>
                        <option value="PERSONAL_LOAN">💰 Personal Loan</option>
                        <option value="CAR_LOAN">🚗 Car Loan</option>
                        <option value="EDUCATION_LOAN">🎓 Education Loan</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 text-end">
                    <button
                      type="submit"
                      className="btn btn-primary px-5 py-2 fw-bold"
                      disabled={submitting || !profileUpdated}
                      style={{ borderRadius: "8px" }}
                    >
                      {submitting ? "Submitting Application..." : "Submit Loan Application"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplyLoan;