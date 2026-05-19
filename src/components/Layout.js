import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import NotificationsModal from './NotificationsModal';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Layers,
  BookOpen,
  BarChart3,
  Bell,
  Search,
  LogOut,
  ChevronDown
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/teachers', label: 'Teachers', icon: Users },
  { href: '/students', label: 'Students', icon: GraduationCap },
  { href: '/classes', label: 'Classes', icon: Layers },
  { href: '/subjects', label: 'Subjects', icon: BookOpen },
  { href: '/grades', label: 'Grades', icon: BarChart3 },
];

export default function Layout({ children }) {
  const { pathname } = useRouter();
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const [query, setQuery] = useState('');
  const [data, setData] = useState({ students: [], teachers: [], classes: [], subjects: [] });
  const [loading, setLoading] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const notificationsRef = useRef(null);

  useEffect(() => {
    if (searchOpen) {
      setLoading(true);
      Promise.all([
        fetch('/api/students').then(r => r.ok ? r.json() : []),
        fetch('/api/teachers').then(r => r.ok ? r.json() : []),
        fetch('/api/classes').then(r => r.ok ? r.json() : []),
        fetch('/api/subjects').then(r => r.ok ? r.json() : [])
      ]).then(([students, teachers, classes, subjects]) => {
        setData({ students, teachers, classes, subjects });
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchNotifications = () => {
    if (user) {
      const token = localStorage.getItem('edu_token');
      fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.ok ? r.json() : { notifications: [] })
        .then(data => setNotifications(data.notifications || []))
        .catch(console.error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const markNotificationAsRead = async (id) => {
    try {
      const token = localStorage.getItem('edu_token');
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
      }
    } catch (err) {
      console.error(err);
    }
  };

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

  const filteredStudents = query ? data.students.filter(s =>
    `${s.firstName} ${s.lastName} ${s.email}`.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4) : [];

  const filteredTeachers = query ? data.teachers.filter(t =>
    `${t.firstName} ${t.lastName} ${t.email}`.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4) : [];

  const filteredClasses = query ? data.classes.filter(c =>
    `${c.name} ${c.grade}`.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4) : [];

  const filteredSubjects = query ? data.subjects.filter(s =>
    `${s.name} ${s.description}`.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4) : [];

  const navigationItems = [
    { href: '/', name: t('nav.dashboard', 'Dashboard'), desc: t('search.desc.dashboard') },
    { href: '/teachers', name: t('nav.teachers', 'Teachers'), desc: t('search.desc.teachers') },
    { href: '/students', name: t('nav.students', 'Students'), desc: t('search.desc.students') },
    { href: '/classes', name: t('nav.classes', 'Classes'), desc: t('search.desc.classes') },
    { href: '/subjects', name: t('nav.subjects', 'Subjects'), desc: t('search.desc.subjects') },
    { href: '/grades', name: t('nav.grades', 'Grades'), desc: t('search.desc.grades') },
  ].filter(item =>
    !query || item.name.toLowerCase().includes(query.toLowerCase())
  );

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes('MAC'));
  }, []);
  const userInitials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() : '?';

  return (
    <div className="min-h-screen bg-purple-50">
      { }
      <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-purple-950 to-purple-800 shadow-lg shadow-purple-900/40">
        <div className="w-full sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-8">
            { }
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
              <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-200">
                <GraduationCap size={22} />
              </div>
              <div className="hidden xl:block">
                <p className="text-white font-bold text-sm leading-tight">EduAdmin</p>
                <p className="text-purple-300 text-xs">School Management</p>
              </div>
            </Link>

            { }
            <div className="flex items-center gap-1 flex-1 py-1 min-w-0 justify-center">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`relative flex items-center gap-2 px-2 lg:px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200
                      ${active
                        ? 'bg-white/20 text-white shadow-inner'
                        : 'text-purple-200 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    <span className="text-base"><Icon size={20} /></span>
                    <span className="hidden md:inline">{t(`nav.${label.toLowerCase()}`, label)}</span>
                    {active && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-purple-600 rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            { }
            <div className="flex items-center flex-shrink-0">
              <select
                className="bg-purple-800 text-purple-200 border-none rounded-lg py-1 px-2 text-xs font-bold outline-none cursor-pointer"
                onChange={(e) => changeLanguage(e.target.value)}
                value={i18n.language || 'en'}
              >
                <option value="en">EN</option>
                <option value="hy">HY</option>
              </select>
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-purple-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Search size={20} />
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[9px] font-black text-purple-300 bg-purple-900/60 rounded-md border border-purple-800 uppercase tracking-widest">
                  {isMac ? '⌘K' : 'Ctrl K'}
                </kbd>
              </button>


              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors relative"
                >
                  <Bell size={20} />
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-purple-100 shadow-xl shadow-purple-950/10 overflow-hidden z-50 flex flex-col max-h-[400px]"
                    >
                      <div className="px-4 py-3 border-b border-purple-50 flex justify-between items-center bg-purple-50/50">
                        <p className="text-sm font-bold text-purple-950">{t('notifications.title', 'Notifications')}</p>
                        {notifications.filter(n => !n.isRead).length > 0 && (
                          <span className="text-[10px] font-black uppercase text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                            {notifications.filter(n => !n.isRead).length} {t('notifications.new', 'New')}
                          </span>
                        )}
                      </div>

                      <div className="overflow-y-auto flex-1">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center">
                            <p className="text-sm font-semibold text-purple-400">{t('notifications.empty', 'No notifications yet')}</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-purple-50">
                            {notifications.slice(0, 5).map(notification => (
                              <div
                                key={notification.id}
                                onClick={() => {
                                  if (!notification.isRead) markNotificationAsRead(notification.id);
                                }}
                                className={`p-4 cursor-pointer hover:bg-purple-50/50 transition-colors ${!notification.isRead ? 'bg-purple-50/30' : ''}`}
                              >
                                <p className={`text-sm font-bold ${!notification.isRead ? 'text-purple-950' : 'text-purple-900/70'}`}>
                                  {translateText(notification.title)}
                                </p>
                                <p className={`text-xs mt-1 line-clamp-2 ${!notification.isRead ? 'text-purple-800' : 'text-purple-600/70'}`}>
                                  {translateText(notification.message)}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="p-2 border-t border-purple-50 bg-gray-50/50">
                        <button
                          onClick={() => {
                            setNotificationsOpen(false);
                            setNotificationsModalOpen(true);
                          }}
                          className="w-full block text-center text-xs font-bold text-purple-600 hover:text-purple-700 hover:bg-purple-50 py-2 rounded-xl transition-colors cursor-pointer"
                        >
                          {t('notifications.viewAll', 'View All')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>


              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 hover:bg-white/10 rounded-xl px-2 py-1.5 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {userInitials}
                  </div>
                  <ChevronDown size={14} className={`text-purple-300 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-purple-100 shadow-xl shadow-purple-950/10 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-purple-50">
                        <p className="text-sm font-bold text-purple-950 truncate">{user?.firstName} {user?.lastName}</p>
                        <p className="text-[11px] text-purple-400 font-semibold truncate">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => { setUserMenuOpen(false); logout(); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          {t('auth.logOut')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>


      <main className="pt-16 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>


      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 bg-purple-950/20 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -20 }}
              className="relative bg-white/95 backdrop-blur-xl rounded-[2rem] border border-purple-100 shadow-2xl shadow-purple-950/10 w-full max-w-2xl overflow-hidden flex flex-col max-h-[60vh] z-10"
            >

              <div className="flex items-center gap-3 px-6 py-4 border-b border-purple-50">
                <Search size={22} className="text-purple-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder={t('search.placeholder')}
                  className="w-full bg-transparent border-none text-purple-950 placeholder:text-purple-300 font-bold text-base focus:outline-none"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  autoFocus
                />
                <kbd className="hidden sm:inline-block px-2.5 py-1 text-[10px] font-black text-purple-400 bg-purple-50 rounded-xl border border-purple-100 uppercase tracking-widest">
                  ESC
                </kbd>
              </div>


              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="py-12 text-center">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mb-3" />
                    <p className="text-purple-400 text-xs font-bold uppercase tracking-widest">{t('search.loading')}</p>
                  </div>
                ) : !query && navigationItems.length === 0 ? (
                  <div className="py-12 text-center text-purple-300">
                    <p className="text-sm font-bold">{t('search.noResults')}</p>
                  </div>
                ) : (
                  <>

                    {navigationItems.length > 0 && (
                      <div>
                        <h3 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2 px-3">
                          {t('search.quickNavigation')}
                        </h3>
                        <div className="space-y-1">
                          {navigationItems.map(item => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setSearchOpen(false)}
                              className="flex items-center justify-between p-3 hover:bg-purple-50/60 rounded-2xl transition-all group"
                            >
                              <div>
                                <p className="text-sm font-bold text-purple-950 group-hover:text-purple-600 transition-colors">
                                  {item.name}
                                </p>
                                <p className="text-[10px] text-purple-400 font-semibold">
                                  {item.desc}
                                </p>
                              </div>
                              <span className="text-[10px] font-black uppercase text-purple-400 bg-purple-50 group-hover:bg-purple-100 px-2.5 py-1 rounded-xl border border-purple-100">
                                {t('search.jump')}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}


                    {filteredStudents.length > 0 && (
                      <div>
                        <h3 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2 px-3">
                          {t('nav.students')}
                        </h3>
                        <div className="space-y-1">
                          {filteredStudents.map(student => (
                            <Link
                              key={student.id}
                              href={`/students?search=${student.firstName} ${student.lastName}`}
                              onClick={() => setSearchOpen(false)}
                              className="flex items-center justify-between p-3 hover:bg-purple-50/60 rounded-2xl transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                                  {student.firstName[0]}{student.lastName[0]}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-purple-950 group-hover:text-purple-600 transition-colors">
                                    {student.firstName} {student.lastName}
                                  </p>
                                  <p className="text-[10px] text-purple-400 font-semibold">{student.email}</p>
                                </div>
                              </div>
                              <span className="text-[10px] font-black uppercase text-purple-400 bg-purple-50 group-hover:bg-purple-100 px-2.5 py-1 rounded-xl border border-purple-100">
                                {t('search.view')}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}


                    {filteredTeachers.length > 0 && (
                      <div>
                        <h3 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2 px-3">
                          {t('nav.teachers')}
                        </h3>
                        <div className="space-y-1">
                          {filteredTeachers.map(teacher => (
                            <Link
                              key={teacher.id}
                              href={`/teachers?search=${teacher.firstName} ${teacher.lastName}`}
                              onClick={() => setSearchOpen(false)}
                              className="flex items-center justify-between p-3 hover:bg-purple-50/60 rounded-2xl transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                                  {teacher.firstName[0]}{teacher.lastName[0]}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-purple-950 group-hover:text-purple-600 transition-colors">
                                    {teacher.firstName} {teacher.lastName}
                                  </p>
                                  <p className="text-[10px] text-purple-400 font-semibold">{teacher.email}</p>
                                </div>
                              </div>
                              <span className="text-[10px] font-black uppercase text-purple-400 bg-purple-50 group-hover:bg-purple-100 px-2.5 py-1 rounded-xl border border-purple-100">
                                {t('search.view')}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}


                    {filteredClasses.length > 0 && (
                      <div>
                        <h3 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2 px-3">
                          {t('nav.classes')}
                        </h3>
                        <div className="space-y-1">
                          {filteredClasses.map(c => (
                            <Link
                              key={c.id}
                              href={`/classes?search=${c.name}`}
                              onClick={() => setSearchOpen(false)}
                              className="flex items-center justify-between p-3 hover:bg-purple-50/60 rounded-2xl transition-all group"
                            >
                              <div>
                                <p className="text-sm font-bold text-purple-950 group-hover:text-purple-600 transition-colors">
                                  {c.name}
                                </p>
                                <p className="text-[10px] text-purple-400 font-semibold">{t('common.class')}: {c.grade}{c.section}</p>
                              </div>
                              <span className="text-[10px] font-black uppercase text-purple-400 bg-purple-50 group-hover:bg-purple-100 px-2.5 py-1 rounded-xl border border-purple-100">
                                {t('search.view')}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}


                    {filteredSubjects.length > 0 && (
                      <div>
                        <h3 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2 px-3">
                          {t('nav.subjects')}
                        </h3>
                        <div className="space-y-1">
                          {filteredSubjects.map(subject => (
                            <Link
                              key={subject.id}
                              href={`/subjects?search=${subject.name}`}
                              onClick={() => setSearchOpen(false)}
                              className="flex items-center justify-between p-3 hover:bg-purple-50/60 rounded-2xl transition-all group"
                            >
                              <div>
                                <p className="text-sm font-bold text-purple-950 group-hover:text-purple-600 transition-colors">
                                  {subject.name}
                                </p>
                                <p className="text-[10px] text-purple-400 font-semibold truncate max-w-[400px]">{subject.description}</p>
                              </div>
                              <span className="text-[10px] font-black uppercase text-purple-400 bg-purple-50 group-hover:bg-purple-100 px-2.5 py-1 rounded-xl border border-purple-100">
                                {t('search.view')}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}


                    {!query && (
                      <div className="py-8 text-center text-purple-300 border-t border-purple-50/50 mt-4">
                        <p className="text-xs font-bold uppercase tracking-widest">{t('search.guide')}</p>
                      </div>
                    )}
                  </>
                )}
              </div>


              <div className="bg-purple-50/50 border-t border-purple-100 px-6 py-3 flex items-center justify-between text-[10px] font-black text-purple-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-white border border-purple-100 rounded-md">↵</kbd>
                  {t('search.toSelect')}
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-white border border-purple-100 rounded-md">{isMac ? '⌘' : 'Ctrl'}</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white border border-purple-100 rounded-md">K</kbd>
                  {t('search.toToggle')}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <NotificationsModal
        isOpen={notificationsModalOpen}
        onClose={() => setNotificationsModalOpen(false)}
        onRefresh={fetchNotifications}
      />
    </div>
  );
}
