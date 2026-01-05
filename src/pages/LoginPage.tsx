export default function LoginPage() {
  return (
    <div className="login-page">
      <section className="login-card">
        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle muted">
          Login is not implemented yet. This page represents a future
          authentication flow.
        </p>

        <form className="login-form">
          <div className="login-field">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" disabled />
          </div>

          <div className="login-field">
            <label>Password</label>
            <input type="password" placeholder="••••••••" disabled />
          </div>

          <button className="login-btn" disabled>
            Log in
          </button>
        </form>

        <p className="login-footer muted">
          Don’t have an account? <span>Create one</span>
        </p>
      </section>
    </div>
  );
}
