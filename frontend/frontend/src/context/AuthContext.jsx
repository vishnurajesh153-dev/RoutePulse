import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

const SESSION_KEY = 'rp_session_v1';

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [role,    setRole]    = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Restore session from localStorage on mount ──────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const { user: u, role: r } = JSON.parse(raw);
        setUser(u);
        setRole(r);
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  function persist(u, r) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ user: u, role: r }));
    setUser(u);
    setRole(r);
  }

  // ── Auth actions ────────────────────────────────────────────
  const login = useCallback(async (email, password, asAdmin = false) => {
    const res = await authService.login(email, password, asAdmin);
    if (res.success) persist(res.user, res.role);
    return res;
  }, []);

  const register = useCallback(async (name, email, password, asAdmin = false, inviteCode = '') => {
    const res = await authService.register(name, email, password, asAdmin, inviteCode);
    if (res.success) persist(res.user, res.role);
    return res;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setRole(null);
    window.location.hash = '/signin';
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
