export const OAuthButtons = () => {
  return (
    <>
      <button onClick={() => window.location.href = "/auth/discord"}>
        Sign in with Discord
      </button>
      <button onClick={() => window.location.href = "/auth/google"}>
        Sign in with Google
      </button>
      <button onClick={() => window.location.href = "/auth/facebook"}>
        Sign in with Facebook
      </button>
    </>
  );
};
