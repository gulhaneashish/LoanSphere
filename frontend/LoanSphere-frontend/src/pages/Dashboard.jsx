import { useEffect, useState } from "react";
import { getDashboard, getAllLoans } from "../services/loanService";
import Navbar from "../components/Navbar";
import { FiFileText, FiCheckCircle, FiXCircle, FiDollarSign } from "react-icons/fi";
import "./Dashboard.css";

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    totalApplications: 0,
    approvedLoans: 0,
    rejectedLoans: 0,
    totalLoanAmount: 0.0,
  });
  const [recentLoans, setRecentLoans] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Decode user email from JWT token in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload && payload.sub) {
          setUserEmail(payload.sub);
        }
      } catch (error) {
        console.error("Error decoding JWT token:", error);
      }
    }
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await getDashboard();
      if (response && response.data) {
        setDashboard(response.data);
      }

      const loansRes = await getAllLoans();
      if (loansRes && loansRes.data) {
        // Sort by application ID descending
        const sorted = loansRes.data.sort((a, b) => b.applicationId - a.applicationId);
        setRecentLoans(sorted.slice(0, 5)); // show top 5 recent loans
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 18) return "Good Afternoon";
    return "Good Evening";
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
        {/* Welcome Banner Card with Summary Info */}
        <div className="welcome-banner">
          <div className="row align-items-center g-3">
            <div className="col-12">
              <span className="user-badge">{userEmail || "Customer"}</span>
              <h2>
                {getGreeting()}, {userEmail ? userEmail.split("@")[0] : "User"}!
              </h2>
              <p>Here is your current financial portfolio and loan application status overview.</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards Grid */}
        <div className="row g-4">
          <div className="col-md-3">
            <div className="stat-card blue">
              <div className="stat-header">
                <h5>Total Applications</h5>
                <div className="stat-icon-wrapper">
                  <FiFileText />
                </div>
              </div>
              <div className="stat-info">
                <h3>{dashboard.totalApplications}</h3>
                <span className="stat-desc">Submitted requests</span>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-card emerald">
              <div className="stat-header">
                <h5>Approved Loans</h5>
                <div className="stat-icon-wrapper">
                  <FiCheckCircle />
                </div>
              </div>
              <div className="stat-info">
                <h3>{dashboard.approvedLoans}</h3>
                <span className="stat-desc" style={{ color: "#16a34a" }}>Disbursed & Active</span>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-card rose">
              <div className="stat-header">
                <h5>Rejected Loans</h5>
                <div className="stat-icon-wrapper">
                  <FiXCircle />
                </div>
              </div>
              <div className="stat-info">
                <h3>{dashboard.rejectedLoans}</h3>
                <span className="stat-desc" style={{ color: "#dc2626" }}>Requires attention</span>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-card purple">
              <div className="stat-header">
                <h5>Total Loan Value</h5>
                <div className="stat-icon-wrapper">
                  <FiDollarSign />
                </div>
              </div>
              <div className="stat-info">
                <h3>${dashboard.totalLoanAmount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                <span className="stat-desc">Approved principal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Applications Overview Card */}
        <div className="dashboard-table-card">
          <h4>Recent Loan Applications</h4>
          
          {recentLoans.length === 0 ? (
            <div className="empty-state-wrapper">
              <FiFileText className="empty-state-icon" />
              <h5>No Active Loan Applications</h5>
              <p>You haven't submitted any loan requests yet. When you submit a request, your applications and their credit status will appear here.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-custom">
                <thead>
                  <tr>
                    <th>App ID</th>
                    <th>User ID</th>
                    <th>Loan Type</th>
                    <th>Amount</th>
                    <th>Risk Level</th>
                    <th>Monthly EMI</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLoans.map((loan) => (
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

export default Dashboard;