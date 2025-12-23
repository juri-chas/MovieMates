import type { useState } from "react";
import { useAuth } from "../hooks/useAuth";


export function LoginPage() {
  <h1>Login</h1>
  const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        login(email, password);
      }}
    >
      <input
        type="email"
        placeholder="Email"
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
}
