import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPendingLoans from "./pages/AdminPendingLoans";
import AdminUserDetails from "./pages/AdminUserDetails";
import Profile from "./pages/Profile";
import ApplyLoan from "./pages/ApplyLoan";
import LoanHistory from "./pages/LoanHistory";
import ProtectedRoute from "./components/ProtectedRoute";

function DashboardWrapper() {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" />;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload && payload.role === "ADMIN") {
      return <AdminDashboard />;
    }
  } catch (e) {
    console.error("Error parsing JWT payload in DashboardWrapper:", e);
  }
  return <Dashboard />;
}

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" />;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload && payload.role !== "ADMIN") {
      return <Navigate to="/dashboard" />;
    }
  } catch (e) {
    console.error("Error parsing JWT payload in AdminRoute:", e);
    return <Navigate to="/dashboard" />;
  }
  return children;
}

function CustomerRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" />;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload && payload.role === "ADMIN") {
      return <Navigate to="/dashboard" />;
    }
  } catch (e) {
    console.error("Error parsing JWT payload in CustomerRoute:", e);
    return <Navigate to="/dashboard" />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardWrapper />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply-loan"
          element={
            <ProtectedRoute>
              <CustomerRoute>
                <ApplyLoan />
              </CustomerRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/loan-history"
          element={
            <ProtectedRoute>
              <CustomerRoute>
                <LoanHistory />
              </CustomerRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/pending-loans"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminPendingLoans />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-details"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminUserDetails />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;