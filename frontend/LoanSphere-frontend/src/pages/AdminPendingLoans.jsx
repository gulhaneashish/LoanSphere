import { useEffect, useState } from "react";
import { getPendingLoans, approveLoan, rejectLoan } from "../services/loanService";
import Navbar from "../components/Navbar";
import { FiCheck, FiX, FiAlertCircle, FiTrendingUp, FiCheckCircle } from "react-icons/fi";
import "./Dashboard.css";

function AdminPendingLoans() {
  const [pendingLoans, setPendingLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [feedbackMsg, setFeedbackMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    loadPendingLoans();
  }, []);

  const loadPendingLoans = async () => {
    try {
      setLoading(true);
      const res = await getPendingLoans();
      if (res && res.data) {
        setPendingLoans(res.data);
      }
    } catch (error) {
      console.error("Error loading pending loans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    setFeedbackMsg({ type: "", text: "" });
    try {
      if (action === "approve") {
        await approveLoan(id);
        setFeedbackMsg({ type: "success", text: `Application #${id} approved successfully.` });
      } else {
        await rejectLoan(id);
        setFeedbackMsg({ type: "warning", text: `Application #${id} rejected.` });
      }
      // Refresh pending list
      await loadPendingLoans();
    } catch (error) {
      console.error(`Error processing loan ${action}:`, error);
      setFeedbackMsg({ type: "danger", text: `Failed to ${action} loan application.` });
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const getRecommendation = (loan) => {
    const risk = loan.riskLevel?.toUpperCase();
    const score = loan.eligibilityScore || 0;
    
    if (risk === "LOW" || risk === "MEDIUM" || score >= 60) {
      return {
        text: "RECOMMENDED: APPROVE",
        class: "text-success border-success bg-success-subtle",
        badge: "bg-success text-white"
      };
    } else if (risk === "HIGH" || score < 60) {
      return {
        text: "RECOMMENDED: REJECT",
        class: "text-danger border-danger bg-danger-subtle",
        badge: "bg-danger text-white"
      };
    } else {
      return {
        text: "MANUAL REVIEW REQUIRED",
        class: "text-secondary border-secondary bg-secondary-subtle",
        badge: "bg-secondary text-white"
      };
    }
  };

  const getRiskBadgeClass = (risk) => {
    switch (risk?.toUpperCase()) {
      case "LOW":
        return "low";
      case "MEDIUM":
        return "medium";
      case "HIGH":
        return "high";
      default:
        return "unknown";
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="container mt-4 pt-2">
        <div className="welcome-banner" style={{ background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)" }}>
          <span className="user-badge" style={{ backgroundColor: "#f59e0b", color: "#1e293b" }}>Approval Queue</span>
          <h2>Pending Loan Reviews</h2>
          <p>Analyze submitted applications, inspect AI eligibility scores, and approve or reject applications.</p>
        </div>

        {feedbackMsg.text && (
          <div className={`alert alert-${feedbackMsg.type} mt-3 text-center py-2`} role="alert" style={{ borderRadius: "10px" }}>
            {feedbackMsg.text}
          </div>
        )}

        <div className="mt-4">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : pendingLoans.length === 0 ? (
            <div className="no-loans-card text-center py-5 bg-white border rounded-3 shadow-sm">
              <FiCheckCircle size={48} className="text-success mb-3" />
              <h4>All Caught Up!</h4>
              <p className="text-muted mb-0">There are no pending loan applications requiring review.</p>
            </div>
          ) : (
            <div className="row g-4">
              {pendingLoans.map((loan) => {
                const rec = getRecommendation(loan);
                return (
                  <div className="col-12" key={loan.applicationId}>
                    <div className="card shadow-sm border rounded-3 p-4 bg-white">
                      <div className="row align-items-center">
                        <div className="col-lg-3">
                          <div className="d-flex align-items-center mb-2">
                            <span className="badge bg-slate-900 text-white me-2">App #{loan.applicationId}</span>
                            <span className={`badge-risk ${getRiskBadgeClass(loan.riskLevel)}`}>
                              {loan.riskLevel || "UNKNOWN"} RISK
                            </span>
                          </div>
                          <h5 className="mb-1 text-dark fw-bold">User ID: {loan.userId}</h5>
                          <p className="text-muted m-0" style={{ fontSize: "0.9rem" }}>
                            Applied: {loan.createdAt ? new Date(loan.createdAt).toLocaleDateString() : "N/A"}
                          </p>
                        </div>

                        <div className="col-lg-3 border-start-lg ps-lg-4">
                          <div className="mb-1">
                            <span className="text-muted d-block" style={{ fontSize: "0.8rem", textTransform: "uppercase" }}>Loan Details</span>
                            <span className="fw-semibold text-dark">
                              {loan.loanType ? loan.loanType.replace("_", " ") : "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted d-block" style={{ fontSize: "0.8rem", textTransform: "uppercase" }}>Amount / Term</span>
                            <span className="fw-bold text-dark fs-5">
                              ₹{loan.loanAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-muted" style={{ fontSize: "0.9rem" }}>
                              {" "}for {loan.loanTenure} Months
                            </span>
                          </div>
                        </div>

                        <div className="col-lg-3 border-start-lg ps-lg-4">
                          <div className="mb-2">
                            <span className="text-muted d-block" style={{ fontSize: "0.8rem", textTransform: "uppercase" }}>System Score</span>
                            <div className="d-flex align-items-center">
                              <span className="fw-bold fs-5 me-2 text-dark">{loan.eligibilityScore || 0}</span>
                              <div className="progress w-70" style={{ height: "6px" }}>
                                <div 
                                  className="progress-bar bg-primary" 
                                  role="progressbar" 
                                  style={{ width: `${loan.eligibilityScore || 0}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className={`border rounded px-2 py-1 d-inline-flex align-items-center ${rec.class}`} style={{ fontSize: "0.8rem", fontWeight: "700" }}>
                            <FiTrendingUp className="me-1" /> {rec.text}
                          </div>
                        </div>

                        <div className="col-lg-3 text-lg-end mt-3 mt-lg-0 border-start-lg ps-lg-4">
                          <div className="d-flex d-lg-block justify-content-end gap-2">
                            <button 
                              className="btn btn-success d-inline-flex align-items-center justify-content-center px-4 py-2 me-lg-2"
                              style={{ borderRadius: "8px", fontWeight: "600" }}
                              onClick={() => handleAction(loan.applicationId, "approve")}
                              disabled={actionLoading[loan.applicationId]}
                            >
                              <FiCheck className="me-1" /> Approve
                            </button>
                            <button 
                              className="btn btn-danger d-inline-flex align-items-center justify-content-center px-4 py-2"
                              style={{ borderRadius: "8px", fontWeight: "600" }}
                              onClick={() => handleAction(loan.applicationId, "reject")}
                              disabled={actionLoading[loan.applicationId]}
                            >
                              <FiX className="me-1" /> Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPendingLoans;
