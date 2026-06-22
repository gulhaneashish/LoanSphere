import { useEffect, useState } from "react";
import { getAllLoans } from "../services/loanService";
import { getCurrentUser } from "../services/authService";
import Navbar from "../components/Navbar";
import { FiFileText } from "react-icons/fi";
import "./Dashboard.css";

function LoanHistory() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndLoadData = async () => {
      try {
        const userRes = await getCurrentUser();
        if (userRes && userRes.data && userRes.data.userId) {
          loadLoans(userRes.data.userId);
        }
      } catch (error) {
        console.error("Error fetching user details in LoanHistory:", error);
      }
    };
    fetchUserAndLoadData();
  }, []);

  const loadLoans = async (userId) => {
    setLoading(true);
    try {
      const response = await getAllLoans();
      if (response && response.data) {
        // Filter by user ID first
        const userLoans = response.data.filter(loan => loan.userId === userId);
        // Sort descending by applicationId to show most recent first
        const sorted = userLoans.sort((a, b) => b.applicationId - a.applicationId);
        setLoans(sorted);
      }
    } catch (error) {
      console.error("Error loading loan history:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    if (!status) return "pending";
    const s = status.toLowerCase();
    if (s === "approved") return "approved";
    if (s === "rejected") return "rejected";
    return "pending";
  };

  const getRiskBadgeClass = (risk) => {
    if (!risk) return "unknown";
    const r = risk.toLowerCase();
    if (r === "low") return "low";
    if (r === "medium") return "medium";
    if (r === "high") return "high";
    return "unknown";
  };

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="container">
        {/* Welcome Banner Card */}
        <div className="welcome-banner">
          <h2>Loan Application History</h2>
          <p>
            Review all your active and previous loan applications, credit scores,
            automated risk evaluations, and dynamic monthly EMI calculations.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading loan history...</span>
            </div>
            <p className="mt-3 text-muted">Retrieving loan application history...</p>
          </div>
        ) : (
          <div className="dashboard-table-card">
            <h4>Application Records</h4>

            {loans.length === 0 ? (
              <div className="empty-state-wrapper">
                <FiFileText className="empty-state-icon" />
                <h5>No Loan Records Found</h5>
                <p>
                  You haven't submitted any loan requests yet. When you submit a request,
                  your complete transaction log and approval status will be recorded here.
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-custom">
                  <thead>
                    <tr>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Risk</th>
                      <th>Score</th>
                      <th>EMI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.map((loan) => (
                      <tr key={loan.applicationId}>
                        <td className="fw-semibold">
                          ₹{loan.loanAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td>
                          <span className={`badge-status ${getStatusBadgeClass(loan.status)}`}>
                            {loan.status || "PENDING"}
                          </span>
                        </td>
                        <td>
                          <span className={`badge-risk ${getRiskBadgeClass(loan.riskLevel)}`}>
                            {loan.riskLevel || "UNKNOWN"}
                          </span>
                        </td>
                        <td className="fw-semibold">{loan.eligibilityScore ?? "N/A"}</td>
                        <td className="fw-semibold">
                          ₹{loan.monthlyEmi?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LoanHistory;