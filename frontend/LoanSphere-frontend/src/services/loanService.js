import api from "../api/axiosConfig";

export const getDashboard = (userId) => {
  return api.get(`/api/loan/dashboard?userId=${userId}`);
};

export const getAllLoans = () => {
  return api.get("/api/loan");
};

export const applyLoan = (loanData) => {
  return api.post("/api/loan/apply", loanData);
};

export const getAdminDashboard = () => {
  return api.get("/api/admin/loan/dashboard");
};

export const getPendingLoans = () => {
  return api.get("/api/admin/loan/pending");
};

export const approveLoan = (id) => {
  return api.put(`/api/admin/loan/${id}/accept`);
};

export const rejectLoan = (id) => {
  return api.put(`/api/admin/loan/${id}/cancel`);
};