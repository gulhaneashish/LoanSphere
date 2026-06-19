import { useEffect, useState } from "react";
import { getDashboard } from "../services/loanService";
import Navbar from "../components/Navbar";
function Dashboard() {

  const [dashboard, setDashboard] = useState({});

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await getDashboard();
      setDashboard(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-4">
 <Navbar />

      <h2>Loan Dashboard</h2>

      <div className="row">

        <div className="col-md-3">
          <div className="card p-3">
            <h5>Total Applications</h5>
            <h3>{dashboard.totalApplications}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3">
            <h5>Approved Loans</h5>
            <h3>{dashboard.approvedLoans}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3">
            <h5>Rejected Loans</h5>
            <h3>{dashboard.rejectedLoans}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3">
            <h5>Total Amount</h5>
            <h3>{dashboard.totalLoanAmount}</h3>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;