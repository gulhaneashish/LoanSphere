import api from "../api/axiosConfig";

export const registerUser = (userData) => {
  return api.post("/api/auth/register", userData);
};

export const loginUser = (loginData) => {
  return api.post("/api/auth/login", loginData);
};