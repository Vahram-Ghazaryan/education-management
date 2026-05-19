import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext(null);

const PUBLIC_ROUTES = ['/login', '/register'];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    const savedToken = localStorage.getItem('edu_token');
    if (savedToken) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((r) => {
          if (r.ok) return r.json();
          throw new Error('Invalid token');
        })
        .then((data) => {
          setUser(data.user);
          setToken(savedToken);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('edu_token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    if (loading) return;
    const isPublic = PUBLIC_ROUTES.includes(router.pathname);
    if (!user && !isPublic) {
      router.replace('/login');
    }
    if (user && isPublic) {
      router.replace('/');
    }
  }, [user, loading, router.pathname]);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    localStorage.setItem('edu_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (firstName, lastName, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    localStorage.setItem('edu_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('edu_token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
