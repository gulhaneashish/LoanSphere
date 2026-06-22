import { useEffect, useState } from "react";
import { getAllProfiles } from "../services/profileService";
import Navbar from "../components/Navbar";
import { FiUsers, FiBriefcase, FiCreditCard } from "react-icons/fi";
import "./Dashboard.css";

function AdminUserDetails() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const res = await getAllProfiles();
      if (res && res.data) {
        setProfiles(res.data);
      }
    } catch (error) {
      console.error("Error loading user profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="container mt-4 pt-2">
        <div className="welcome-banner" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}>
          <span className="user-badge" style={{ backgroundColor: "#38bdf8", color: "#0f172a" }}>Directory</span>
          <h2>Registered User Details</h2>
          <p>View complete financial profiles, employment histories, and official identifications of system users.</p>
        </div>

        <div className="history-section mt-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="section-title m-0">Customer Profiles Directory</h4>
              <p className="section-subtitle m-0">Detailed list of user profiles registered on the platform</p>
            </div>
            <div className="badge bg-primary text-white px-3 py-2 fw-semibold d-flex align-items-center gap-1" style={{ borderRadius: "8px" }}>
              <FiUsers /> Total: {profiles.length}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : profiles.length === 0 ? (
            <div className="no-loans-card text-center py-5 bg-white border rounded-3">
              <p className="text-muted mb-0">No registered user profiles found.</p>
            </div>
          ) : (
            <div className="table-responsive table-container-custom">
              <table className="table table-hover table-custom m-0">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Full Name</th>
                    <th>Age</th>
                    <th>Mobile</th>
                    <th>Employment Type</th>
                    <th>Exp. (Yrs)</th>
                    <th>Annual Salary</th>
                    <th>PAN Card</th>
                    <th>Aadhaar Number</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((profile) => (
                    <tr key={profile.id || profile.userId}>
                      <td className="fw-semibold">{profile.userId}</td>
                      <td className="fw-bold text-dark">{profile.fullName || "N/A"}</td>
                      <td>{profile.age ? `${profile.age} Yrs` : "N/A"}</td>
                      <td>{profile.mobileNumber || "N/A"}</td>
                      <td>
                        <span className="badge bg-light text-dark border fw-bold" style={{ fontSize: "0.75rem" }}>
                          {profile.employmentType || "N/A"}
                        </span>
                      </td>
                      <td>{profile.experienceYears !== undefined ? `${profile.experienceYears} Yrs` : "N/A"}</td>
                      <td className="fw-bold text-success">
                        {profile.salary ? `₹${profile.salary.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "N/A"}
                      </td>
                      <td className="font-monospace fw-semibold" style={{ fontSize: "0.85rem", letterSpacing: "0.5px" }}>
                        {profile.panNumber || "N/A"}
                      </td>
                      <td className="font-monospace" style={{ fontSize: "0.85rem" }}>
                        {profile.aadhaarNumber || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUserDetails;
