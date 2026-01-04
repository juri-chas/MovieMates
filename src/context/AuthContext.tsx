import { createContext, useState, useEffect, type ReactNode } from "react";
import * as authService from "../services/authService";


type User = {
  id: string;
  profileName: string;
  email: string;
  emailVerified: boolean;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
};

// Add forgot password and reset password types if needed
type RegisterData = {
  profileName: string;
  email: string;
  password: string;
};

// Contitions for password
type PasswordConditions = {
  minLength: number;
  requireUpperCase: boolean;
  requireLowerCase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  requireAtLeastEightChars: boolean;
  requireNotOldPassword: boolean;
};

export const passwordConditions: PasswordConditions = {
  minLength: 8,
  requireUpperCase: true,
  requireLowerCase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  requireAtLeastEightChars: true,
  requireNotOldPassword: true
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const existing = authService.getCurrentUser();
    if (existing) setUser(existing);
  }, []);

  const login = async (_email: string, _password: string) => {
    const u = await authService.login(_email, _password);
    setUser(u);
  };

  const register = async (data: RegisterData) => {
    const u = await authService.register(data);
    setUser(u);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};