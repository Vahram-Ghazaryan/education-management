import { useState, useEffect } from 'react';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import '../lib/i18n';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';

const inter = Inter({ subsets: ['latin'] });

if (typeof window !== 'undefined' && !window.__fetchOverridden) {
  window.__fetchOverridden = true;
  const originalFetch = window.fetch;
  window.fetch = async (url, options = {}) => {
    if (url.startsWith('/api/') && !url.includes('/api/auth/login') && !url.includes('/api/auth/register')) {
      const token = localStorage.getItem('edu_token');
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`
        };
      }
    }
    return originalFetch(url, options);
  };
}

function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #1e1b4b 100%)' }}>
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full mx-auto" />
        </div>
      </div>
    );
  }

  return children;
}

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <link rel="icon" href="/favicon.png?v=2" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" type="image/x-icon" />
      </Head>
      <AuthGuard>
        <main className={inter.className}>
          <Component {...pageProps} />
        </main>
      </AuthGuard>
    </AuthProvider>
  );
}
