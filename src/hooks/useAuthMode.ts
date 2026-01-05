import { useEffect, useState } from "react";

export const useAuthMode = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const apiBase = (import.meta.env.VITE_API_BASE_URL as string) || "";
        if (!apiBase) {
          setIsOnline(false);
          setIsChecking(false);
          return;
        }

        const response = await fetch(`${apiBase}/auth/me`, {
          method: "GET",
          headers: { Authorization: "Bearer dummy" },
        });

        setIsOnline(response.status !== 0);
      } catch {
        setIsOnline(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkBackendConnection();
  }, []);

  return {
    isOnline,
    isChecking,
    mode: isOnline ? "real" : "fake",
  };
};
