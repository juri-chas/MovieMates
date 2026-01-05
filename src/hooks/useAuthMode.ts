import { useEffect, useState } from "react";

type User = {
  id: string;
  profileName: string;
  email: string;
  emailVerified: boolean;
};

type RegisterData = {
  profileName: string;
  email: string;
  password: string;
};

// Mock user storage for offline mode
const MOCK_USERS_KEY = "mm_mock_users";
const MOCK_CURRENT_KEY = "mm_mock_current";

// Initialize with default test users for offline mode
const getDefaultMockUsers = () => [
  {
    id: "1",
    profileName: "Test User",
    email: "test@example.com",
    password: "Test123!",
    emailVerified: true,
  },
  {
    id: "2",
    profileName: "Demo User",
    email: "demo@example.com",
    password: "Demo123!",
    emailVerified: false,
  },
];

// Fake auth service for offline mode
const fakeAuthService = {
  register: async (data: RegisterData): Promise<User> => {
    const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) ?? JSON.stringify(getDefaultMockUsers()));
    if (users.find((u: any) => u.email === data.email)) {
      throw new Error("Email already registered");
    }

    const newUser = {
      id: Date.now().toString(),
      profileName: data.profileName,
      email: data.email,
      password: data.password,
      emailVerified: false,
    };

    users.push(newUser);
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));

    const publicUser: User = {
      id: newUser.id,
      profileName: newUser.profileName,
      email: newUser.email,
      emailVerified: newUser.emailVerified,
    };

    localStorage.setItem(MOCK_CURRENT_KEY, JSON.stringify(publicUser));
    return publicUser;
  },

  login: async (email: string, password: string): Promise<User> => {
    const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) ?? JSON.stringify(getDefaultMockUsers()));
    const found = users.find((u: any) => u.email === email && u.password === password);
    if (!found) throw new Error("Invalid credentials (offline mode)");

    const publicUser: User = {
      id: found.id,
      profileName: found.profileName,
      email: found.email,
      emailVerified: found.emailVerified,
    };

    localStorage.setItem(MOCK_CURRENT_KEY, JSON.stringify(publicUser));
    return publicUser;
  },

  logout: () => {
    localStorage.removeItem(MOCK_CURRENT_KEY);
  },

  getCurrentUser: (): User | null => {
    const s = localStorage.getItem(MOCK_CURRENT_KEY);
    return s ? (JSON.parse(s) as User) : null;
  },
};

export const useAuthMode = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const apiBase = (import.meta.env.VITE_API_BASE_URL as string) || "";
        if (!apiBase) {
          // No backend URL configured, use offline mode
          setIsOnline(false);
          setIsChecking(false);
          return;
        }

        // Try to reach the backend
        const response = await fetch(`${apiBase}/auth/me`, {
          method: "GET",
          headers: { Authorization: `Bearer dummy` },
        });

        // If we get any response (even 401), backend is reachable
        setIsOnline(response.status !== 0);
      } catch (err) {
        // Network error or backend unreachable
        setIsOnline(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkBackendConnection();
  }, []);

  return { isOnline, isChecking, mode: isOnline ? "real" : "fake", authService: isOnline ? null : fakeAuthService };
};

export { fakeAuthService };
