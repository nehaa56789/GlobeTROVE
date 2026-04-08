import { useState, useCallback } from "react";
import { authAPI } from "../utils/api";

export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("gt_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token, user: u } = res.data;
    localStorage.setItem("gt_token", token);
    localStorage.setItem("gt_user", JSON.stringify(u));
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    const { token, user: u } = res.data;
    localStorage.setItem("gt_token", token);
    localStorage.setItem("gt_user", JSON.stringify(u));
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("gt_token");
    localStorage.removeItem("gt_user");
    setUser(null);
  }, []);

  return { user, login, register, logout };
}
