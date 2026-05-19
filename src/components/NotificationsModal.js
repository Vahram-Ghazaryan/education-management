import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, Info, AlertCircle, AlertTriangle, Clock, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function NotificationsModal({ isOpen, onClose, onRefresh }) {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchNotifications = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('edu_token');
      const res = await fetch(`/api/notifications?page=${page}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        setTotalItems(data.totalItems);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications(1);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('edu_token');
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('edu_token');
      const res = await fetch('/api/notifications/read-all', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="text-green-500" size={20} />;
      case 'warning': return <AlertTriangle className="text-yellow-500" size={20} />;
      case 'error': return <AlertCircle className="text-red-500" size={20} />;
      default: return <Info className="text-blue-500" size={20} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const translateText = (jsonStr) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.key) {
        return t(parsed.key, parsed.params || {});
      }
    } catch (e) {

    }
    return jsonStr;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          { }
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-purple-950/40 backdrop-blur-md"
          />


          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-[2rem] border border-purple-100 shadow-2xl shadow-purple-950/20 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] z-10"
          >

            <div className="flex items-center justify-between px-6 py-5 border-b border-purple-50 bg-gradient-to-r from-purple-50/50 to-indigo-50/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 shadow-inner">
                  <Bell size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-purple-950 tracking-tight">
                    {t('notifications.title', 'Notifications')}
                  </h3>
                  <p className="text-xs text-purple-500 font-semibold">
                    {totalItems} {t('notifications.total', 'total')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl transition-all"
                  >
                    {t('notifications.markAllAsRead', 'Mark all as read')}
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-purple-50 text-purple-400 hover:text-purple-600 rounded-xl transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>


            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loading ? (
                <div className="py-20 text-center">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mb-3" />
                  <p className="text-purple-400 font-bold uppercase tracking-widest text-[10px]">
                    {t('common.loading', 'Loading...')}
                  </p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 text-purple-300">
                    <Bell size={28} />
                  </div>
                  <h4 className="text-base font-bold text-purple-950 mb-1">
                    {t('notifications.empty', 'No notifications yet')}
                  </h4>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => !notification.isRead && markAsRead(notification.id)}
                      className={`p-4 rounded-2xl border flex items-start gap-4 transition-all cursor-pointer 
                        ${!notification.isRead
                          ? 'bg-purple-50/40 border-purple-100 shadow-sm shadow-purple-100/50 hover:bg-purple-50/60'
                          : 'bg-white border-gray-100 hover:bg-gray-50/50'
                        }`}
                    >
                      <div className="flex-shrink-0 mt-0.5 bg-white p-2 rounded-xl shadow-inner border border-purple-50">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <h4 className={`text-sm font-bold truncate ${!notification.isRead ? 'text-purple-950' : 'text-purple-900/60'}`}>
                            {translateText(notification.title)}
                          </h4>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!notification.isRead && (
                              <span className="px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-600 text-[9px] font-black uppercase tracking-wider">
                                {t('notifications.new', 'New')}
                              </span>
                            )}
                            <span className="text-[10px] font-semibold text-purple-400 flex items-center gap-1">
                              <Clock size={10} />
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <p className={`text-xs leading-relaxed ${!notification.isRead ? 'text-purple-800' : 'text-purple-500/70'}`}>
                          {translateText(notification.message)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>


            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-purple-50 bg-purple-50/30 flex items-center justify-between">
                <span className="text-xs text-purple-500 font-semibold">
                  {t('notifications.showingResults', 'Showing {{start}} to {{end}} of {{total}} results', {
                    start: (currentPage - 1) * 5 + 1,
                    end: Math.min(currentPage * 5, totalItems),
                    total: totalItems
                  })}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1 || loading}
                    onClick={() => fetchNotifications(currentPage - 1)}
                    className="p-1.5 rounded-lg border border-purple-100 bg-white text-purple-600 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs text-purple-950 font-bold px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages || loading}
                    onClick={() => fetchNotifications(currentPage + 1)}
                    className="p-1.5 rounded-lg border border-purple-100 bg-white text-purple-600 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
