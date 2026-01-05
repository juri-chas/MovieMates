export default function ProfilePage() {
  return (
    <div className="profile-page">
      <section className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">👤</div>
          <div className="profile-info">
            <h1 className="profile-name">Guest User</h1>
            <p className="profile-username">@guest</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="profile-stat">
            <strong>0</strong>
            <span>Reviews</span>
          </div>
          <div className="profile-stat">
            <strong>0</strong>
            <span>Friends</span>
          </div>
          <div className="profile-stat">
            <strong>0</strong>
            <span>Lists</span>
          </div>
        </div>

        <div className="profile-section">
          <h2>About</h2>
          <p className="muted">
            This profile page is a placeholder. In a future version, users will
            be able to add friends, write reviews, and manage watchlists.
          </p>
        </div>
      </section>
    </div>
  );
}
