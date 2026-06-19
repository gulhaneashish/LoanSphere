import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">

        <Link
          className="navbar-brand"
          to="/dashboard"
        >
          LoanSphere
        </Link>

        <div className="navbar-nav">

          <Link
            className="nav-link"
            to="/dashboard"
          >
            Dashboard
          </Link>

          <Link
            className="nav-link"
            to="/profile"
          >
            Profile
          </Link>

          <Link
            className="nav-link"
            to="/apply-loan"
          >
            Apply Loan
          </Link>

          <Link
            className="nav-link"
            to="/loan-history"
          >
            Loan History
          </Link>

          <button
            className="btn btn-danger ms-3"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;