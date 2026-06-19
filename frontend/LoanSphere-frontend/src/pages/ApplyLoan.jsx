import { useState } from "react";
import { applyLoan } from "../services/loanService";

function ApplyLoan() {
  const [loan, setLoan] = useState({
    userId: "",
    loanAmount: "",
    loanTenure: "",
    loanType: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await applyLoan(loan);
      alert("Loan Applied Successfully");
    } catch (error) {
      alert("Loan Application Failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: "500px",
          borderRadius: "20px",
          border: "none",
        }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">🏦 Apply for Loan</h2>
          <p className="text-muted">
            Fill in the details to submit your loan application
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              User ID
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter User ID"
              onChange={(e) =>
                setLoan({
                  ...loan,
                  userId: e.target.value,
                })
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Loan Amount
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Loan Amount"
              onChange={(e) =>
                setLoan({
                  ...loan,
                  loanAmount: e.target.value,
                })
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Loan Tenure (Months)
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Loan Tenure"
              onChange={(e) =>
                setLoan({
                  ...loan,
                  loanTenure: e.target.value,
                })
              }
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">
              Loan Type
            </label>
            <select
              className="form-select"
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

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-bold"
            style={{
              borderRadius: "10px",
            }}
          >
            Apply Loan
          </button>
        </form>
      </div>
    </div>
  );
}

export default ApplyLoan;