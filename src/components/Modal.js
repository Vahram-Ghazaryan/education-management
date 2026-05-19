import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, onSubmit, submitLabel, loading = false, submitDisabled = false }) {
  const { t } = useTranslation();
  const defaultSubmitLabel = submitLabel || t('common.save');
  const backdropRef = useRef(null);
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes('MAC'));
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            ref={backdropRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
            className="absolute inset-0 bg-purple-950/20 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-white rounded-[2rem] shadow-2xl shadow-purple-900/10 w-full max-w-lg overflow-hidden border border-purple-100"
          >

            <div className="px-8 pt-8 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-purple-950 tracking-tight uppercase">{title}</h2>
                <div className="h-1 w-8 bg-purple-600 rounded-full mt-1" />
              </div>
              <button
                onClick={onClose}
                className="p-2 text-purple-300 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>


            <form
              onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit(); }}
              noValidate
              className="px-8 pb-8 pt-4 space-y-5"
            >
              <div className="space-y-4">
                {children}
              </div>


              <div className="flex justify-end gap-3 pt-4">
                {!isMac && onSubmit && (
                  <button
                    type="submit"
                    disabled={loading || submitDisabled}
                    className="px-8 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl transition-all shadow-lg shadow-purple-200"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                        {t('common.saving')}
                      </span>
                    ) : defaultSubmitLabel}
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                >
                  {t('common.cancel')}
                </button>
                {isMac && onSubmit && (
                  <button
                    type="submit"
                    disabled={loading || submitDisabled}
                    className="px-8 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl transition-all shadow-lg shadow-purple-200"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                        {t('common.saving')}
                      </span>
                    ) : defaultSubmitLabel}
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-[10px] font-black uppercase tracking-widest text-purple-400 mb-1.5 ml-1">
        {label}{required && <span className="text-purple-600 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[10.5px] text-red-500 font-bold mt-1 ml-1 animate-fade-in">{error}</p>}
    </div>
  );
}

export function Input({ className = '', error, ...props }) {
  return (
    <input
      className={`w-full bg-purple-50/50 border ${error ? 'border-red-300 focus:ring-red-500 bg-red-50/10' : 'border-purple-100 focus:ring-purple-600'} rounded-xl px-4 py-2.5 text-sm font-bold text-purple-950 placeholder:text-purple-300 focus:outline-none focus:ring-2 focus:bg-white transition-all ${className}`}
      {...props}
    />
  );
}

export function Select({ className = '', error, children, ...props }) {
  return (
    <select
      className={`w-full bg-purple-50/50 border ${error ? 'border-red-300 focus:ring-red-500 bg-red-50/10' : 'border-purple-100 focus:ring-purple-600'} rounded-xl px-4 py-2.5 text-sm font-bold text-purple-950 focus:outline-none focus:ring-2 focus:bg-white transition-all appearance-none cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({ className = '', error, ...props }) {
  return (
    <textarea
      rows={3}
      className={`w-full bg-purple-50/50 border ${error ? 'border-red-300 focus:ring-red-500 bg-red-50/10' : 'border-purple-100 focus:ring-purple-600'} rounded-xl px-4 py-2.5 text-sm font-bold text-purple-950 placeholder:text-purple-300 focus:outline-none focus:ring-2 focus:bg-white transition-all resize-none ${className}`}
      {...props}
    />
  );
}
