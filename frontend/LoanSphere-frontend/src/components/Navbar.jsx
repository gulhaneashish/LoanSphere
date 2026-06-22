import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  let userRole = "CUSTOMER";
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload && payload.role) {
        userRole = payload.role;
      }
    } catch (e) {
      console.error("Error decoding token in Navbar:", e);
    }
  }

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom">
      <div className="container">
        <Link className="navbar-brand navbar-brand-custom" to="/dashboard">
          🏦 LoanSphere
        </Link>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <div className="navbar-nav align-items-center gap-2">
            {userRole === "ADMIN" ? (
              <>
                <Link
                  className={`nav-link nav-link-custom ${isActive("/dashboard") ? "active" : ""}`}
                  to="/dashboard"
                >
                  Dashboard
                </Link>

                <Link
                  className={`nav-link nav-link-custom ${isActive("/pending-loans") ? "active" : ""}`}
                  to="/pending-loans"
                >
                  Pending Reviews
                </Link>

                <Link
                  className={`nav-link nav-link-custom ${isActive("/user-details") ? "active" : ""}`}
                  to="/user-details"
                >
                  User Directory
                </Link>
              </>
            ) : (
              <>
                <Link
                  className={`nav-link nav-link-custom ${isActive("/dashboard") ? "active" : ""}`}
                  to="/dashboard"
                >
                  Dashboard
                </Link>

                <Link
                  className={`nav-link nav-link-custom ${isActive("/profile") ? "active" : ""}`}
                  to="/profile"
                >
                  Profile
                </Link>

                <Link
                  className={`nav-link nav-link-custom ${isActive("/apply-loan") ? "active" : ""}`}
                  to="/apply-loan"
                >
                  Apply Loan
                </Link>

                <Link
                  className={`nav-link nav-link-custom ${isActive("/loan-history") ? "active" : ""}`}
                  to="/loan-history"
                >
                  Loan History
                </Link>
              </>
            )}

            <button className="btn btn-logout ms-lg-3" onClick={logout}>
              <FiLogOut className="me-1" /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;