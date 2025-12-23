import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { OAuthButtons } from "../components/OAuthButtons";
import { PasswordInput } from "../components/PasswordInput";

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        login(email, password);
      }}
    >
      <h1>Login</h1>
      <p>Test</p>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <PasswordInput value={password} onChange={setPassword} />

      <button type="submit">Login</button>

      <a href="/forgot-password">Glömt lösenord?</a>
      <a href="/register">Skapa konto?</a>

      <OAuthButtons />
    </form>
  );
}
