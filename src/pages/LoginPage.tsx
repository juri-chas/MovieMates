import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { PasswordInput } from "../components/PasswordInput";
import { OAuthButtons } from "../components/OAuthButtons";
import "../styles/login.css";

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error && <div className="login-error">{error}</div>}
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <PasswordInput value={password} onChange={setPassword} />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="login-links">
        <a href="/forgot-password">Forgot password?</a>
        <a href="/register">Create account?</a>
      </div>

      <div className="login-divider">
        <span>or</span>
      </div>

      <div className="login-oauth">
        <OAuthButtons />
      </div>
    </div>
  );
}
