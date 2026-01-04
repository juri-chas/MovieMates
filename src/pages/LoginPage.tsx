import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { PasswordInput } from "../components/PasswordInput";
import { OAuthButtons } from "../components/OAuthButtons";

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
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
    </>
  );
}
