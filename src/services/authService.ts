// Server-backed authService with offline fallback.
// If VITE_API_BASE_URL is not set or backend is unreachable, uses local mock auth.

export type User = {
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

const TOKEN_KEY = "mm_token";
const USER_KEY = "mm_current_user";
const MOCK_USERS_KEY = "mm_mock_users";
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || "";

let backendAvailable: boolean | null = null;

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

// Inline fake auth for offline mode
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

    localStorage.setItem(USER_KEY, JSON.stringify(publicUser));
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

    localStorage.setItem(USER_KEY, JSON.stringify(publicUser));
    return publicUser;
  },

  logout: async () => {
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const s = localStorage.getItem(USER_KEY);
    return s ? (JSON.parse(s) as User) : null;
  },
};

async function checkBackendAvailable(): Promise<boolean> {
  if (backendAvailable !== null) return backendAvailable;

  if (!API_BASE) {
    backendAvailable = false;
    return false;
  }

  try {
    await fetch(API_BASE + "/auth/me", {
      method: "GET",
      headers: { Authorization: "Bearer test" },
    });
    backendAvailable = true;
    return true;
  } catch {
    backendAvailable = false;
    return false;
  }
}

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string>),
  };

  const token = localStorage.getItem(TOKEN_KEY);
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(API_BASE + path, { ...opts, headers });
  if (!res.ok) {
    const text = await res.text();
    let msg = text;
    try {
      const json = JSON.parse(text);
      msg = json.message || JSON.stringify(json);
    } catch {}
    throw new Error(msg || res.statusText);
  }
  return (await res.json()) as T;
}

export const register = async (data: RegisterData): Promise<User> => {
  const available = await checkBackendAvailable();
  if (!available) {
    return fakeAuthService.register(data);
  }

  // expected response: { user: User, token: string }
  const body = await request<{ user: User; token: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
  localStorage.setItem(TOKEN_KEY, body.token);
  localStorage.setItem(USER_KEY, JSON.stringify(body.user));
  return body.user;
};

export const login = async (email: string, password: string): Promise<User> => {
  const available = await checkBackendAvailable();
  if (!available) {
    return fakeAuthService.login(email, password);
  }

  // expected response: { user: User, token: string }
  const body = await request<{ user: User; token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem(TOKEN_KEY, body.token);
  localStorage.setItem(USER_KEY, JSON.stringify(body.user));
  return body.user;
};

export const logout = async (): Promise<void> => {
  const available = await checkBackendAvailable();
  if (!available) {
    return fakeAuthService.logout();
  }

  // optionally inform server; ignore failure
  try {
    await fetch(API_BASE + "/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` || "",
      },
    });
  } catch {
    // ignore
  }
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getCurrentUser = async (): Promise<User | null> => {
  const available = await checkBackendAvailable();
  if (!available) {
    return fakeAuthService.getCurrentUser();
  }

  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  try {
    // try to get fresh user from server
    const body = await request<User>('/auth/me');
    localStorage.setItem(USER_KEY, JSON.stringify(body));
    return body;
  } catch {
    // token invalid -> clear
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const getCachedUser = (): User | null => {
  const s = localStorage.getItem(USER_KEY);
  return s ? (JSON.parse(s) as User) : null;
};
