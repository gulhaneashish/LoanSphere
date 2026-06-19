import api from "../api/axiosConfig";

export const getDashboard = () => {
  return api.get("/api/loan/dashboard");
};

export const getAllLoans = () => {
  return api.get("/api/loan");
};

export const applyLoan = (loanData) => {
  return api.post("/api/loan/apply", loanData);
};