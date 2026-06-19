import { useEffect, useState } from "react";
import { getAllLoans } from "../services/loanService";

function LoanHistory() {

  const [loans, setLoans] = useState([]);

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    const response = await getAllLoans();
    setLoans(response.data);
  };

  return (
    <div className="container mt-4">

      <h2>Loan History</h2>

      <table className="table table-bordered">

        <thead>
          <tr>
            <th>ID</th>
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
              <td>{loan.applicationId}</td>
              <td>{loan.loanAmount}</td>
              <td>{loan.status}</td>
              <td>{loan.riskLevel}</td>
              <td>{loan.eligibilityScore}</td>
              <td>{loan.monthlyEmi}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default LoanHistory;