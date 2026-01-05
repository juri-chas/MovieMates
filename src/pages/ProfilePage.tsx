import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/profile.css";

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="not-logged">
        <h2>Not logged in</h2>
        <p>You must log in to view the profile.</p>
        <a href="/login">Go to login</a>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Profile</h1>

        <div className="profile-field">
          <strong>Name</strong>: {user.profileName}
        </div>

        <div className="profile-field">
          <strong>Email</strong>: {user.email}
        </div>

        <div className="profile-field">
          <strong>Email verified</strong>: {user.emailVerified ? "Yes" : "No"}
        </div>

        <div className="profile-actions">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}
