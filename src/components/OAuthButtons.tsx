export const OAuthButtons = () => {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <a href="/api/auth/google?redirect=/auth/callback">
        <button type="button">Logga in med Google</button>
      </a>
      <a href="/api/auth/github?redirect=/auth/callback">
        <button type="button">Logga in med GitHub</button>
      </a>
    </div>
  );
};