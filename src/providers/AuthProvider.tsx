import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "./AuthContext";
import { User } from "../types/auth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const persistUser = (u: User | null) => {
    setUser(u);
    try {
      if (u) localStorage.setItem("auth", JSON.stringify(u));
      else localStorage.removeItem("auth");
    } catch {}
  };

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await api.get("/api/v1");
      const u: User = res.data?.user ?? res.data;
      persistUser(u);
    } catch (err: any) {
      console.warn("fetchUser failed:", err);
      persistUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError("");
    try {
      try { await api.get("/sanctum/csrf-cookie"); } catch { /* ok if it does not exist*/ }
      const res = await api.post("/api/v1/login", { correo: email, password });
      const token = res.data?.token ?? res.data?.access_token;
      if (token) {
        localStorage.setItem("auth_token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      await fetchUser();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message ?? "Error en login");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError("");
    try {
      await api.post("/api/v1/logout");
    } catch (err) {
      console.warn("Logout request failed:", err);
    } finally {
      try { localStorage.removeItem("auth_token"); } catch {}
      delete api.defaults.headers.common["Authorization"];
      persistUser(null);
      setIsLoading(false);
      navigate("/login");
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("auth");
      if (stored) setUser(JSON.parse(stored));
    } catch { localStorage.removeItem("auth"); }

    (async () => {
      try {
        const t = localStorage.getItem("auth_token");
        if (t) {
          api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
          await fetchUser();
          return;
        }
      } catch {}
      await fetchUser();
    })();
  }, []);

  const value = { user, isLoading, error, login, logout, fetchUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
