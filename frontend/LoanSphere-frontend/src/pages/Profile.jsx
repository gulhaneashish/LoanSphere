import { useState, useEffect } from "react";
import { createProfile, getProfile } from "../services/profileService";
import { getCurrentUser } from "../services/authService";
import Navbar from "../components/Navbar";
import { FiUser, FiBriefcase, FiPhone, FiCreditCard, FiFileText } from "react-icons/fi";
import "./Dashboard.css";

function Profile() {
  const [profile, setProfile] = useState({
    userId: "",
    fullName: "",
    age: "",
    salary: "",
    employmentType: "",
    experienceYears: "",
    panNumber: "",
    aadhaarNumber: "",
    mobileNumber: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const initProfile = async () => {
      setLoading(true);
      setMessage({ type: "", text: "" });
      try {
        // 1. Get current logged-in user details to resolve userId
        const userRes = await getCurrentUser();
        const userId = userRes.data.userId;
        const defaultName = userRes.data.name || "";
        
        // 2. Fetch financial profile for this userId
        try {
          const profileRes = await getProfile(userId);
          if (profileRes && profileRes.data) {
            setProfile({
              userId: profileRes.data.userId || userId,
              fullName: profileRes.data.fullName || defaultName,
              age: profileRes.data.age || "",
              salary: profileRes.data.salary || "",
              employmentType: profileRes.data.employmentType || "",
              experienceYears: profileRes.data.experienceYears || "",
              panNumber: profileRes.data.panNumber || "",
              aadhaarNumber: profileRes.data.aadhaarNumber || "",
              mobileNumber: profileRes.data.mobileNumber || ""
            });
            setProfileExists(true);
          }
        } catch (profileError) {
          // Profile doesn't exist yet, initialize form with userId and prefilled name
          setProfile({
            userId: userId,
            fullName: defaultName,
            age: "",
            salary: "",
            employmentType: "",
            experienceYears: "",
            panNumber: "",
            aadhaarNumber: "",
            mobileNumber: ""
          });
          setProfileExists(false);
        }
      } catch (authError) {
        console.error("Failed to load user session:", authError);
        setMessage({ type: "danger", text: "Session expired. Please log in again." });
      } finally {
        setLoading(false);
      }
    };

    initProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    // Payload validation
    if (!profile.userId || !profile.fullName || !profile.age || !profile.salary) {
      setMessage({ type: "danger", text: "Please fill in all required fields." });
      setSaving(false);
      return;
    }

    try {
      await createProfile(profile);
      setMessage({ 
        type: "success", 
        text: profileExists ? "Financial Profile updated successfully!" : "Financial Profile created successfully!" 
      });
      setProfileExists(true);
    } catch (error) {
      const backendError = error.response?.data;
      setMessage({
        type: "danger",
        text: typeof backendError === "string" ? backendError : "Failed to save profile. Please check your data."
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="container">
        {/* Welcome Banner Card */}
        <div className="welcome-banner">
          <h2>Financial Identity Profile</h2>
          <p>
            Review or set up your core financial credentials. These details are used to compute loan
            eligibility, credit score rankings, and risk levels automatically.
          </p>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type} mb-4 py-3 text-center`} role="alert" style={{ borderRadius: "12px", fontSize: "0.95rem" }}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading Profile...</span>
            </div>
            <p className="mt-3 text-muted">Loading your profile setup...</p>
          </div>
        ) : (
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "12px" }}>
            <h4 className="fw-bold mb-4 text-primary">
              {profileExists ? "📁 Update Financial Profile" : "📝 Setup Financial Profile"}
            </h4>
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                {/* Full Name */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Full Name *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><FiUser className="text-muted" /></span>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g. John Doe"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    />
                  </div>
                </div>

                {/* Age */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Age *</label>
                  <input
                    type="number"
                    required
                    className="form-control"
                    placeholder="e.g. 30"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  />
                </div>

                {/* Salary */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Annual Salary *</label>
                  <input
                    type="number"
                    required
                    className="form-control"
                    placeholder="e.g. 85000"
                    value={profile.salary}
                    onChange={(e) => setProfile({ ...profile, salary: e.target.value })}
                  />
                </div>

                {/* Employment Type */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Employment Type</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><FiBriefcase className="text-muted" /></span>
                    <select
                      className="form-select"
                      value={profile.employmentType}
                      onChange={(e) => setProfile({ ...profile, employmentType: e.target.value })}
                    >
                      <option value="">Select Employment Type</option>
                      <option value="PRIVATE">Private Company Employee</option>
                      <option value="GOVERNMENT">Government Service</option>
                      <option value="SELF_EMPLOYED">Self Employed / Freelancer</option>
                    </select>
                  </div>
                </div>

                {/* Experience Years */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Experience (Years)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 5"
                    value={profile.experienceYears}
                    onChange={(e) => setProfile({ ...profile, experienceYears: e.target.value })}
                  />
                </div>

                {/* PAN Number */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold">PAN Card Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><FiCreditCard className="text-muted" /></span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. ABCDE1234F"
                      value={profile.panNumber}
                      onChange={(e) => setProfile({ ...profile, panNumber: e.target.value })}
                    />
                  </div>
                </div>

                {/* Aadhaar Number */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Aadhaar Card Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><FiFileText className="text-muted" /></span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 1234 5678 9012"
                      value={profile.aadhaarNumber}
                      onChange={(e) => setProfile({ ...profile, aadhaarNumber: e.target.value })}
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Mobile Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><FiPhone className="text-muted" /></span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. +1 555 123 4567"
                      value={profile.mobileNumber}
                      onChange={(e) => setProfile({ ...profile, mobileNumber: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 text-end">
                <button type="submit" className="btn btn-primary px-5" disabled={saving}>
                  {saving ? "Saving Profile..." : profileExists ? "Update Financial Profile" : "Save Financial Profile"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;