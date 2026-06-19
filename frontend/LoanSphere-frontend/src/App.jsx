import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ApplyLoan from "./pages/ApplyLoan";
import LoanHistory from "./pages/LoanHistory";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
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
      <ApplyLoan />
    </ProtectedRoute>
  }
/>

<Route
  path="/loan-history"
  element={
    <ProtectedRoute>
      <LoanHistory />
    </ProtectedRoute>
  }
/> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;