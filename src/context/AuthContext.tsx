import { createContext, useContext, useState, type ReactNode } from "react";


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

  const login = async (email: string, password: string) => {
    // API call
  };

  const register = async (data: RegisterData) => {
    // API call
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};