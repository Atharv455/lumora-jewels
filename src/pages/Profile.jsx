import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/helpers";
import "./Profile.css";

function Profile() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className="profile-page">
      <div className="page-head">
        <span className="eyebrow">Your Account</span>
        <h1>My Profile</h1>
      </div>

      <div className="container section">
        <div className="profile-card">
          <div className="profile-card__row">
            <span className="profile-card__label">Full Name</span>
            <span className="profile-card__value">{userProfile?.name || currentUser?.displayName || "—"}</span>
          </div>
          <div className="profile-card__row">
            <span className="profile-card__label">Email</span>
            <span className="profile-card__value">{currentUser?.email}</span>
          </div>
          <div className="profile-card__row">
            <span className="profile-card__label">Account Type</span>
            <span className="profile-card__value profile-card__badge">{userProfile?.role || "customer"}</span>
          </div>
          <div className="profile-card__row">
            <span className="profile-card__label">Member Since</span>
            <span className="profile-card__value">{formatDate(userProfile?.createdAt)}</span>
          </div>
          <div className="profile-card__row">
            <span className="profile-card__label">Total Orders</span>
            <span className="profile-card__value">0</span>
          </div>

          <button type="button" className="btn btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
