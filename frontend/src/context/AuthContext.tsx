'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';

/* ─── Types ─── */
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

/* ─── Constants ─── */
const TOKEN_KEY = 'auth_token';

/* ─── Helpers ─── */
function getApiBase() {
  return process.env.NEXT_PUBLIC_API_URL || '';
}

function getSavedToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function saveToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch { /* storage full or access denied */ }
}

function removeToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch { /* ignored */ }
}

/* ─── Context ─── */
const AuthContext = createContext<AuthContextValue | null>(null);

/* ─── Provider ─── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* Fetch current user from saved token */
  const fetchMe = useCallback(async (t: string) => {
    try {
      const res = await fetch(`${getApiBase()}/api/auth/me`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (!res.ok) throw new Error('Unauthorized');
      const data = await res.json();
      setUser(data.user);
      setToken(t);
    } catch {
      removeToken();
      setUser(null);
      setToken(null);
    }
  }, []);

  /* Restore session on mount */
  useEffect(() => {
    const saved = getSavedToken();
    if (saved) {
      fetchMe(saved).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchMe]);

  /* Login */
  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${getApiBase()}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: '로그인에 실패했습니다.' }));
      throw new Error(err.error || err.message || '로그인에 실패했습니다.');
    }
    const data = await res.json();
    saveToken(data.token);
    setToken(data.token);
    setUser(data.user);
  }, []);

  /* Logout */
  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      isAdmin: user?.role === 'admin',
      login,
      logout,
    }),
    [user, token, isLoading, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/* ─── Hook ─── */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
