import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  Users, GraduationCap, School, BookOpen, BarChart3,
  TrendingUp, TrendingDown, Minus, Clock, Award
} from 'lucide-react';
import Link from 'next/link';

const GENDER_COLORS = {
  'male': '#0088FE',
  'female': '#FF85A2',
};
const STAT_CARDS = [
  { key: 'teachers', label: 'Teachers', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', href: '/teachers' },
  { key: 'students', label: 'Students', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-100', href: '/students' },
  { key: 'classes', label: 'Classes', icon: School, color: 'text-pink-600', bg: 'bg-pink-100', href: '/classes' },
  { key: 'subjects', label: 'Subjects', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-100', href: '/subjects' },
  { key: 'grades', label: 'Grade Records', icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-100', href: '/grades' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const SUBJECT_COLORS = [
  '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B',
  '#EF4444', '#06B6D4', '#84CC16', '#6366F1', '#14B8A6',
];

export default function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [period, setPeriod] = useState('year');
  const [chartData, setChartData] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [activeSubjects, setActiveSubjects] = useState({});

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.ok ? r.json() : Promise.reject('Invalid JSON response'))
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch(`/api/chart?period=${period}`)
      .then(r => r.ok ? r.json() : Promise.reject('Invalid JSON response'))
      .then(d => {
        setChartData(d.chartData);
        setSubjectsList(prev => {
          if (prev.length === 0 && d.subjectsList) {
            const initialActive = {};
            d.subjectsList.forEach(s => initialActive[s] = true);
            setActiveSubjects(initialActive);
            return d.subjectsList;
          }
          return prev;
        });
      });
  }, [period]);

  const toggleSubject = (subject) => {
    setActiveSubjects(prev => ({ ...prev, [subject]: !prev[subject] }));
  };

  const localizedGenderDist = stats?.genderDist?.map(g => ({
    originalName: g.name,
    name: t(`dashboard.gender.${g.name}`, g.name),
    value: g.value
  })) ?? [];

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full" />
      </div>
    </Layout>
  );

  return (
    <>
      <Head><title>{t('nav.dashboard')} – EduAdmin</title></Head>
      <Layout>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-purple-950 tracking-tight">{t('dashboard.overview')}</h1>
            <p className="text-purple-400 font-medium">{t('dashboard.welcome')}</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-purple-100 shadow-sm text-sm font-bold text-purple-900">
            <Clock size={16} className="text-purple-400" />
            {mounted && new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}

          </div>
        </div>


        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
        >
          {STAT_CARDS.map(({ key, label, icon: Icon, color, bg, href }) => {
            const trend = stats?.trends?.[key] || 0;
            const isPositive = trend > 0;
            const isNegative = trend < 0;
            const trendColor = isPositive ? 'text-green-600 bg-green-50' : isNegative ? 'text-red-600 bg-red-50' : 'text-gray-600 bg-gray-50';
            const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

            return (
              <motion.div
                key={key}
                variants={item}
                className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm group card-hover"
              >
                <Link href={href} className="block">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 ${bg} ${color} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                      <Icon size={20} />
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider ${trendColor}`}>
                      <TrendIcon size={10} /> {isPositive ? '+' : ''}{trend}%
                    </div>
                  </div>
                  <p className="text-2xl font-black text-purple-950 leading-none mb-1">{stats?.[key] ?? 0}</p>
                  <p className="text-xs font-bold text-purple-400 uppercase tracking-widest">{key === 'grades' ? t('dashboard.gradeRecords') : t(`nav.${key}`)}</p>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-3xl p-6 border border-purple-100 shadow-sm flex flex-col"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-lg font-black text-purple-950 flex items-center gap-2 uppercase tracking-tight">
                <div className="w-2 h-6 bg-green-500 rounded-full" />
                {t('dashboard.performanceOverTime')}
              </h2>
              <div className="flex bg-purple-50 rounded-lg p-1">
                {['week', 'month', 'year', 'all'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${period === p ? 'bg-white text-purple-900 shadow-sm' : 'text-purple-400 hover:text-purple-600'}`}
                  >
                    {t(`dashboard.period.${p}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[300px] w-full mb-4">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800, fontSize: '12px' }} />
                    {subjectsList.map((subject, idx) => activeSubjects[subject] && (
                      <Line
                        key={subject}
                        type="monotone"
                        dataKey={subject}
                        name={t(`subjectsList.${subject}`, subject)}
                        stroke={SUBJECT_COLORS[idx % SUBJECT_COLORS.length]}
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mt-auto border-t border-purple-50 pt-4">
              {subjectsList.map((subject, idx) => (
                <label key={subject} className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${activeSubjects[subject] ? 'border-transparent' : 'border-gray-200'}`} style={{ backgroundColor: activeSubjects[subject] ? SUBJECT_COLORS[idx % SUBJECT_COLORS.length] : 'transparent' }}>
                    {activeSubjects[subject] && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={activeSubjects[subject] || false}
                    onChange={() => toggleSubject(subject)}
                  />
                  <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${activeSubjects[subject] ? 'text-purple-900' : 'text-gray-400 group-hover:text-gray-600'}`}>
                    {t(`subjectsList.${subject}`, subject)}
                  </span>
                </label>
              ))}
            </div>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm flex flex-col"
          >
            <h2 className="text-lg font-black text-purple-950 flex items-center gap-2 uppercase tracking-tight mb-6">
              <div className="w-2 h-6 bg-indigo-500 rounded-full" />
              {t('dashboard.studentGender')}
            </h2>
            <div className="flex-1 min-h-[250px] relative">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={localizedGenderDist}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {localizedGenderDist.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={GENDER_COLORS[entry.originalName]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-2xl font-black text-purple-950 leading-none">{stats?.students}</p>
                <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">{t('dashboard.total')}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {stats?.genderDist?.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: GENDER_COLORS[entry.name] }} />
                  <span className="text-xs font-bold text-purple-900 capitalize">{t(`dashboard.gender.${entry.name}`, entry.name)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white rounded-3xl p-6 border border-purple-100 shadow-sm"
          >
            <h2 className="text-lg font-black text-purple-950 flex items-center gap-2 uppercase tracking-tight mb-6">
              <div className="w-2 h-6 bg-pink-500 rounded-full" />
              {t('dashboard.recentGradeRecords')}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] font-black text-purple-300 uppercase tracking-widest border-b border-purple-50">
                    <th className="pb-4 text-left">{t('dashboard.tableStudent')}</th>
                    <th className="pb-4 text-left">{t('dashboard.tableSubject')}</th>
                    <th className="pb-4 text-center">{t('dashboard.tableScore')}</th>
                    <th className="pb-4 text-right">{t('dashboard.tableDate')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50">
                  {stats?.recentGrades?.map((grade) => (
                    <tr key={grade.id} className="group hover:bg-purple-50 transition-colors">
                      <td className="py-4 font-bold text-purple-900 text-sm">{grade.student}</td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                          {t(`subjectsList.${grade.subject}`, grade.subject)}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <span className={`font-black text-sm ${grade.score / grade.maxScore >= 0.8 ? 'text-green-600' : 'text-purple-600'}`}>
                          {grade.score}/{grade.maxScore}
                        </span>
                      </td>
                      <td className="py-4 text-right text-xs font-bold text-purple-400">{grade.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Award size={28} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight mb-2 leading-tight">{t('dashboard.performanceInsightTitle')}</h2>
              <p className="text-purple-100 text-sm font-medium leading-relaxed">
                {t('dashboard.performanceInsightDesc1')} <span className="font-bold text-white">{stats?.avgPerformance}%</span> {t('dashboard.performanceInsightDesc2')}
              </p>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
              <div>
                <p className="text-3xl font-black">{stats?.attendanceRate}%</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-purple-200">{t('dashboard.attendanceRate')}</p>
              </div>
              <div className="bg-white/20 p-2 rounded-xl">
                <TrendingUp size={24} />
              </div>
            </div>
          </motion.div>
        </div>
      </Layout>
    </>
  );
}
