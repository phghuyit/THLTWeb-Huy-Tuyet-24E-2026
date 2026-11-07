"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/authService";

const TOKEN_KEY = "stylerent.auth.token";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restoreLogin() {
      try {
        if (!window.localStorage.getItem(TOKEN_KEY)) return;
        const currentUser = await authService.getCurrentUser();
        if (!cancelled) setUser(currentUser?.data || currentUser);
      } catch (error) {
        if (error.response?.status === 401) window.localStorage.removeItem(TOKEN_KEY);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    restoreLogin();
    return () => { cancelled = true; };
  }, []);

  async function login(credentials) {
    const result = await authService.login(credentials);
    window.localStorage.setItem(TOKEN_KEY, result.token);
    setUser(result.data || result);
  }

  async function logout() {
    try {
      await authService.logout();
    } catch (error) {
      if (error.response?.status !== 401) throw error;
    }
    window.localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }

  const updateUser = (updatedData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : updatedData));
  };

  async function refreshUser() {
    try {
      const res = await authService.getCurrentUser();
      const userData = res?.data || res;
      setUser(userData);
      return userData;
    } catch (error) {
      return null;
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAuth phải nằm trong AuthProvider");
  return auth;
}
