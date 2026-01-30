/* eslint-disable react-refresh/only-export-components */
import type { AxiosError } from "axios";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/axios";

type ApiErrorResponse = {
  success: false;
  error?: {
    message: string;
    statusCode: number;
    details?: Record<string, string>;
  };
  message?: string; // Fallback for legacy
  errors?: Record<string, string>; // Fallback for legacy
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type LoginResult =
  | { success: true; data: AuthUser }
  | { success: false; message: string };

type RegisterResult =
  | { success: true; data: AuthUser }
  | { success: false; message: string; errors?: Record<string, string> };

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<LoginResult>;
  register: (data: any) => Promise<RegisterResult>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<void> => {
    try {
      const response = await api.get("/auth/me");
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string,
    rememberMe?: boolean,
  ): Promise<LoginResult> => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
        rememberMe,
      });

      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, data: response.data.user };
      } else {
        return { success: false, message: "Login failed" };
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.response?.data?.error?.message ??
        axiosError.response?.data?.message ??
        "Login failed";

      return {
        success: false,
        message,
      };
    }
  };

  const register = async (data: any): Promise<RegisterResult> => {
    try {
      const response = await api.post("/auth/register", data);

      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, data: response.data.user };
      } else {
        return { success: false, message: "Registration failed" };
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.response?.data?.error?.message ??
        axiosError.response?.data?.message ??
        "Registration failed";

      const errors =
        axiosError.response?.data?.error?.details ??
        axiosError.response?.data?.errors;

      return {
        success: false,
        message,
        errors,
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
