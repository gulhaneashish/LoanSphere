import { useState } from "react";
import { createProfile } from "../services/profileService";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createProfile(profile);
      alert("Profile Created Successfully");
    } catch (error) {
      alert("Failed to Create Profile");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Profile</h2>

      <form onSubmit={handleSubmit}>

        <input
          className="form-control mb-2"
          placeholder="User ID"
          onChange={(e) =>
            setProfile({
              ...profile,
              userId: e.target.value
            })
          }
        />

        <input
          className="form-control mb-2"
          placeholder="Full Name"
          onChange={(e) =>
            setProfile({
              ...profile,
              fullName: e.target.value
            })
          }
        />

        <input
          className="form-control mb-2"
          placeholder="Age"
          onChange={(e) =>
            setProfile({
              ...profile,
              age: e.target.value
            })
          }
        />

        <input
          className="form-control mb-2"
          placeholder="Salary"
          onChange={(e) =>
            setProfile({
              ...profile,
              salary: e.target.value
            })
          }
        />

        <button className="btn btn-success">
          Save Profile
        </button>

      </form>
    </div>
  );
}

export default Profile;