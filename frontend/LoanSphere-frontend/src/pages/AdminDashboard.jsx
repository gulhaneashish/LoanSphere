import { useEffect, useState } from "react";
import { getAdminDashboard, getAllLoans } from "../services/loanService";
import Navbar from "../components/Navbar";
import { FiFileText, FiCheckCircle, FiXCircle, FiDollarSign, FiClock } from "react-icons/fi";
import "./Dashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalLoans: 0,
    approvedLoans: 0,
    rejectedLoans: 0,
    pendingLoans: 0,
    cancelledLoans: 0,
    totalLoanAmount: 0.0,
  });
  const [allLoans, setAllLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const statsRes = await getAdminDashboard();
      if (statsRes && statsRes.data) {
        setStats(statsRes.data);
      }

      const loansRes = await getAllLoans();
      if (loansRes && loansRes.data) {
        // Sort by application ID descending
        const sorted = loansRes.data.sort((a, b) => b.applicationId - a.applicationId);
        setAllLoans(sorted);
      }
    } catch (error) {
      console.error("Error loading admin dashboard details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "approved";
      case "REJECTED":
        return "rejected";
      case "PENDING":
        return "pending";
      default:
        return "unknown";
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
        {/* Welcome Banner Card with Summary Info */}
        <div className="welcome-banner">
          <div className="row align-items-center g-3">
            <div className="col-12">
              <span className="user-badge">Administrator Portal</span>
              <h2>Welcome Back, Admin!</h2>
              <p>Monitor global portfolio metrics, manage pending loan applications, and view registered user profiles.</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="row g-4 mt-3">
          <div className="col-md-3 col-sm-6">
            <div className="metric-card">
              <div className="metric-icon" style={{ backgroundColor: "rgba(99, 102, 241, 0.1)", color: "#6366f1" }}>
                <FiFileText size={24} />
              </div>
              <div className="metric-details">
                <h3>{stats.totalLoans}</h3>
                <p>Total Applications</p>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="metric-card">
              <div className="metric-icon" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
                <FiCheckCircle size={24} />
              </div>
              <div className="metric-details">
                <h3>{stats.approvedLoans}</h3>
                <p>Approved Loans</p>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="metric-card">
              <div className="metric-icon" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}>
                <FiXCircle size={24} />
              </div>
              <div className="metric-details">
                <h3>{stats.rejectedLoans}</h3>
                <p>Rejected Loans</p>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="metric-card">
              <div className="metric-icon" style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }}>
                <FiClock size={24} />
              </div>
              <div className="metric-details">
                <h3>{stats.pendingLoans}</h3>
                <p>Pending Reviews</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12">
            <div className="metric-card bg-white border-1">
              <div className="metric-icon" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
                <FiDollarSign size={24} />
              </div>
              <div className="metric-details">
                <h3>${(stats.totalLoanAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                <p>Total Funds Disbursed (Approved Loans)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Loan History Table */}
        <div className="history-section mt-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="section-title m-0">Global Loan Application History</h4>
              <p className="section-subtitle m-0">All applications submitted across the system</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : allLoans.length === 0 ? (
            <div className="no-loans-card text-center py-5">
              <p className="text-muted mb-0">No loan applications exist in the system yet.</p>
            </div>
          ) : (
            <div className="table-responsive table-container-custom">
              <table className="table table-hover table-custom m-0">
                <thead>
                  <tr>
                    <th>App ID</th>
                    <th>User ID</th>
                    <th>Loan Type</th>
                    <th>Amount</th>
                    <th>Risk Level</th>
                    <th>Monthly EMI</th>
                    <th>Admin Action</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allLoans.map((loan) => (
                    <tr key={loan.applicationId}>
                      <td className="fw-semibold">#{loan.applicationId}</td>
                      <td>{loan.userId}</td>
                      <td>
                        {loan.loanType ? loan.loanType.replace("_", " ") : "N/A"}
                      </td>
                      <td className="fw-semibold">
                        ${loan.loanAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span className={`badge-risk ${getRiskBadgeClass(loan.riskLevel)}`}>
                          {loan.riskLevel || "UNKNOWN"}
                        </span>
                      </td>
                      <td className="fw-semibold">
                        ${loan.monthlyEmi?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span className={`badge-status ${getStatusBadgeClass(loan.adminAction === "CANCELLED" ? "rejected" : loan.adminAction === "ACCEPTED" ? "approved" : "pending")}`}>
                          {loan.adminAction || "PENDING"}
                        </span>
                      </td>
                      <td>
                        <span className={`badge-status ${getStatusBadgeClass(loan.status)}`}>
                          {loan.status || "PENDING"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
