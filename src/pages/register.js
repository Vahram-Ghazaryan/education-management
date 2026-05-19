import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { School, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const { t, i18n } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('auth.passwordsMismatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('auth.passwordMinLength'));
      return;
    }

    setLoading(true);
    try {
      await register(firstName, lastName, email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #1e1b4b 100%)' }}>
        <div className="animate-spin w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{t('auth.signUp')} – EduAdmin</title>
      </Head>
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #1e1b4b 100%)' }}
      >
        { }
        {mounted && (
          <div className="absolute top-6 right-6 z-50">
            <select
              className="bg-white/10 text-white border border-white/20 rounded-xl py-2 px-3 text-sm font-bold outline-none cursor-pointer backdrop-blur-md hover:bg-white/20 transition-colors"
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              value={i18n.language?.startsWith('hy') ? 'hy' : 'en'}
            >
              <option value="en" className="text-purple-900">EN</option>
              <option value="hy" className="text-purple-900">HY</option>
            </select>
          </div>
        )}

        { }
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, -40, 50, 0], y: [0, 60, -20, 0], scale: [1, 1.15, 0.85, 1] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[5%] right-[20%] w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)' }}
          />
          <motion.div
            animate={{ x: [0, 60, -40, 0], y: [0, -50, 30, 0], scale: [1, 0.9, 1.1, 1] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-[10%] left-[5%] w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)' }}
          />
          <motion.div
            animate={{ x: [0, -30, 40, 0], y: [0, 40, -50, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[60%] right-[50%] w-56 h-56 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)' }}
          />
        </div>

        { }
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />


        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-md mx-4"
        >
          <div className="rounded-3xl border border-white/10 shadow-2xl shadow-purple-950/50 overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(40px)' }}
          >

            <div className="pt-10 pb-6 px-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-purple-500/30"
              >
                <School size={32} className="text-white" />
              </motion.div>
              <h1 className="text-2xl font-black text-white tracking-tight mb-1">{t('auth.createAccount')}</h1>
              <p className="text-purple-300 text-sm font-medium">{t('auth.createAccountSubtitle')}</p>
            </div>


            <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-300 text-sm font-semibold text-center"
                >
                  {error}
                </motion.div>
              )}


              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-purple-300 uppercase tracking-widest block pl-1">
                    {t('auth.firstNameLabel')}
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                    <input
                      id="register-firstname"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={t('auth.firstNamePlaceholder')}
                      required
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-purple-400/50 font-semibold text-sm focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-purple-300 uppercase tracking-widest block pl-1">
                    {t('auth.lastNameLabel')}
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                    <input
                      id="register-lastname"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={t('auth.lastNamePlaceholder')}
                      required
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-purple-400/50 font-semibold text-sm focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>


              <div className="space-y-2">
                <label className="text-[11px] font-black text-purple-300 uppercase tracking-widest block pl-1">
                  {t('auth.emailLabel')}
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.emailPlaceholder')}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-purple-400/50 font-semibold text-sm focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-200"
                  />
                </div>
              </div>


              <div className="space-y-2">
                <label className="text-[11px] font-black text-purple-300 uppercase tracking-widest block pl-1">
                  {t('auth.passwordLabel')}
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.minChars')}
                    required
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-purple-400/50 font-semibold text-sm focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>


              <div className="space-y-2">
                <label className="text-[11px] font-black text-purple-300 uppercase tracking-widest block pl-1">
                  {t('auth.confirmPasswordLabel')}
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                  <input
                    id="register-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-purple-400/50 font-semibold text-sm focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-200"
                  />
                </div>
              </div>


              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-600/30 mt-2"
                style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {t('auth.createAccount')}
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>


              <p className="text-center text-purple-300 text-sm font-medium pt-1">
                {t('auth.hasAccount')}{' '}
                <Link href="/login" className="text-purple-200 hover:text-white font-bold transition-colors underline underline-offset-4 decoration-purple-400/40 hover:decoration-purple-300">
                  {t('auth.signIn')}
                </Link>
              </p>
            </form>
          </div>


          <p className="text-center text-purple-400/50 text-xs font-bold mt-6 uppercase tracking-widest">
            EduAdmin © 2026
          </p>
        </motion.div>
      </div>
    </>
  );
}
