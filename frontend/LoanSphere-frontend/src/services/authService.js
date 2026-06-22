import api from "../api/axiosConfig";

export const registerUser = (userData) => {
  return api.post("/api/auth/register", userData);
};

export const loginUser = (loginData) => {
  return api.post("/api/auth/login", loginData);
};

export const getCurrentUser = () => {
  return api.get("/api/auth/me");
};