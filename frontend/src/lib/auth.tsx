"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import api from "./api";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      api
        .get("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => Cookies.remove("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    Cookies.set("token", res.data.access_token, { expires: 1 });
    setUser(res.data.user);
  };

  const signup = async (name: string, email: string, password: string) => {
    const res = await api.post("/auth/signup", { name, email, password });
    Cookies.set("token", res.data.access_token, { expires: 1 });
    setUser(res.data.user);
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    window.location.href = "/auth/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
