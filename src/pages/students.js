import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Modal, { Field, Input, Select } from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import ViewSwitcher from '@/components/ViewSwitcher';
import Pagination from '@/components/Pagination';
import { motion } from 'framer-motion';
import { Mail, Calendar, Search, Plus, Filter } from 'lucide-react';

const EMPTY = { firstName: '', lastName: '', email: '', phone: '', birthDate: '', gender: '', classId: '' };
const ITEMS_PER_PAGE = 8;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function StudentsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (router.query.search) {
      setSearch(router.query.search);
    }
  }, [router.query.search]);
  const [filterClass, setFilterClass] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterModal, setFilterModal] = useState(false);
  const [tempFilterClass, setTempFilterClass] = useState('');
  const [tempFilterGender, setTempFilterGender] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [viewMode, setViewMode] = useState('card');
  const [currentPage, setCurrentPage] = useState(1);

  const [initialForm, setInitialForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([fetch('/api/students').then(r => r.json()), fetch('/api/classes').then(r => r.json())])
      .then(([s, c]) => { setStudents(s); setClasses(c); setLoading(false); });
  }, []);
  useEffect(load, [load]);

  const set = k => e => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (errors[k]) {
      setErrors(prev => ({ ...prev, [k]: null }));
    }
  };
  const openCreate = () => {
    setForm(EMPTY);
    setInitialForm(EMPTY);
    setErrors({});
    setEditId(null);
    setModal(true);
  };
  const openEdit = (s) => {
    const editValues = {
      firstName: s.firstName, lastName: s.lastName, email: s.email,
      phone: s.phone || '', birthDate: s.birthDate || '',
      gender: s.gender || '', classId: s.classId || ''
    };
    setForm(editValues);
    setInitialForm(editValues);
    setErrors({});
    setEditId(s.id); setModal(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) {
      errs.firstName = t('validation.required', 'This field is required');
    } else if (form.firstName.trim().length < 2) {
      errs.firstName = t('validation.minCharacters', 'Must be at least 2 characters');
    }

    if (!form.lastName.trim()) {
      errs.lastName = t('validation.required', 'This field is required');
    } else if (form.lastName.trim().length < 2) {
      errs.lastName = t('validation.minCharacters', 'Must be at least 2 characters');
    }

    if (!form.email.trim()) {
      errs.email = t('validation.required', 'This field is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = t('validation.invalidEmail', 'Invalid email address');
    }

    if (form.phone && form.phone.trim() && !/^\+?[0-9\s-]{6,15}$/.test(form.phone)) {
      errs.phone = t('validation.invalidPhone', 'Invalid phone number');
    }

    if (!form.gender) {
      errs.gender = t('validation.required', 'This field is required');
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/students/${editId}` : '/api/students';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false); setModal(false); load();
  };

  const confirmDelete = async () => {
    const id = deleteTarget?.id;
    if (!id) return;
    setDeleting(true);
    await fetch(`/api/students/${id}`, { method: 'DELETE' });
    setDeleting(false); setDeleteTarget(null); load();
  };

  const filtered = students.filter(s => {
    const matchesSearch = `${s.firstName} ${s.lastName} ${s.email}`.toLowerCase().includes(search.toLowerCase());
    const matchesClass = filterClass ? String(s.classId) === String(filterClass) : true;
    const matchesGender = filterGender ? s.gender === filterGender : true;
    return matchesSearch && matchesClass && matchesGender;
  });

  const totalItems = filtered.length;
  const paginatedItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [search, filterClass, filterGender]);

  return (
    <>
      <Head><title>{t('nav.students')} – EduAdmin</title></Head>
      <Layout>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-purple-950">{t('students.title')}</h1>
            <p className="text-purple-400 text-sm mt-0.5">{students.length} {t('students.total')}</p>
          </div>
          <div className="flex items-center gap-3">
            <ViewSwitcher view={viewMode} onChange={setViewMode} />
            <button onClick={openCreate} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-colors">
              <Plus size={16} strokeWidth={2.5} />
              {t('students.addStudent')}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
            <input
              className="w-full bg-white border border-purple-100 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-purple-950 placeholder:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all shadow-sm"
              placeholder={t('students.searchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setTempFilterClass(filterClass);
              setTempFilterGender(filterGender);
              setFilterModal(true);
            }}
            className={`flex items-center gap-2 px-6 py-3 bg-white border rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm ${filterClass || filterGender
                ? 'border-purple-600 text-purple-600 ring-2 ring-purple-100'
                : 'border-purple-100 text-purple-400 hover:text-purple-600'
              }`}
          >
            <Filter size={16} />
            {t('common.filter')}
            {(filterClass || filterGender) && (
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
            )}
          </button>
        </div>

        {loading ? (
          <div className="p-20 text-center">
            <div className="animate-spin inline-block w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full mb-4" />
            <p className="text-purple-400 font-bold uppercase tracking-widest text-[10px]">{t('common.loading')}</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-purple-100"
          >
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-purple-200" />
            </div>
            <p className="text-purple-950 font-black text-xl mb-1">{t('students.notFound')}</p>
            <p className="text-purple-400 font-medium text-sm">{t('students.tryAdjusting')}</p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {viewMode === 'table' ? (
              <div className="bg-white rounded-[2rem] border border-purple-50 shadow-xl shadow-purple-900/5 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-purple-50/50 border-b border-purple-50">
                      {['name', 'email', 'class', 'genderLabel', 'actions'].map(h => (
                        <th key={h} className="px-8 py-5 text-[10px] font-black text-purple-400 uppercase tracking-widest text-left">{t(`common.${h}`)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-50">
                    {paginatedItems.map((s) => (
                      <tr key={s.id} className="group hover:bg-purple-50/50 transition-colors">
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs shadow-sm ${s.gender === 'female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                              {s.firstName[0]}{s.lastName[0]}
                            </div>
                            <div>
                              <p className="font-black text-purple-950 text-sm leading-none mb-1">{s.firstName} {s.lastName}</p>
                              <p className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">{t('students.studentId')}: #{s.id.toString().padStart(4, '0')}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-2 text-purple-400 text-sm font-medium">
                            <Mail size={14} className="text-purple-200" />
                            {s.email}
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          {s.class ? (
                            <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-purple-200">
                              {s.class.name}
                            </span>
                          ) : <span className="text-purple-200">—</span>}
                        </td>
                        <td className="px-8 py-4">
                          <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${s.gender === 'female' ? 'bg-pink-50 text-pink-600 border-pink-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                            {t(`common.gender.${s.gender}`, s.gender)}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEdit(s)} className="p-2 text-purple-400 hover:text-purple-600 hover:bg-purple-100 rounded-xl transition-all text-xs font-bold uppercase tracking-widest">
                              {t('common.edit')}
                            </button>
                            <button onClick={() => setDeleteTarget(s)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-xs font-bold uppercase tracking-widest">
                              {t('common.delete')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {paginatedItems.map((s) => (
                  <div key={s.id} className="relative bg-white rounded-2xl border border-purple-100 shadow-sm group flex flex-col card-hover overflow-hidden isolate h-[240px]">

                    <div className="relative h-[120px] overflow-hidden flex-shrink-0">
                      <div
                        className="absolute inset-0 opacity-90 group-hover:opacity-95 transition-all duration-700 ease-out group-hover:scale-110 bg-cover bg-center"
                        style={{
                          backgroundImage: `url('${s.gender === 'female' ? '/images/female_student.png' : '/images/male_student.png'}')`
                        }}
                      />

                      <div className="absolute inset-0 bg-purple-950/20 group-hover:bg-purple-950/15 transition-colors duration-300" />


                      <div className="relative z-10 p-4 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start">
                          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-bold text-base shadow-inner border border-white/20">
                            {s.firstName[0]}{s.lastName[0]}
                          </div>
                          <div className="flex gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(s)} className="p-1.5 bg-white/90 hover:bg-purple-600 text-purple-700 hover:text-white rounded-xl shadow-sm border border-purple-100 transition-all cursor-pointer animate-fade-in" title={t('common.edit')}>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                            <button onClick={() => setDeleteTarget(s)} className="p-1.5 bg-white/90 hover:bg-red-600 text-red-600 hover:text-white rounded-xl shadow-sm border border-red-100 transition-all cursor-pointer animate-fade-in" title={t('common.delete')}>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </div>

                        <h3 className="text-base font-extrabold text-purple-100 drop-shadow-md truncate" style={{ textShadow: '0 2px 4px rgba(88, 28, 135, 0.8)' }}>{s.firstName} {s.lastName}</h3>
                      </div>
                    </div>


                    <div className="p-4 flex-grow bg-white flex flex-col justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-purple-100">
                          {s.class?.name || t('students.noClass')}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${s.gender === 'female' ? 'bg-pink-50 text-pink-600 border-pink-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                          {t(`common.gender.${s.gender}`, s.gender)}
                        </span>
                      </div>

                      <div className="space-y-1.5 mt-3 pt-3 border-t border-purple-50">
                        <div className="flex items-center gap-2.5 text-xs text-gray-500 font-medium">
                          <Mail size={12} className="text-purple-400 flex-shrink-0" />
                          <span className="truncate">{s.email}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-gray-500 font-medium">
                          <Calendar size={12} className="text-purple-400 flex-shrink-0" />
                          <span>{s.birthDate || t('students.noBirthDate')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-10">
          <Pagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
        </div>

        <Modal open={modal} onClose={() => setModal(false)} title={editId ? t('students.editStudent') : t('students.newStudent')} onSubmit={save} loading={saving} submitDisabled={JSON.stringify(form) === JSON.stringify(initialForm)}>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('common.firstName')} required error={errors.firstName}>
              <Input error={errors.firstName} value={form.firstName} onChange={set('firstName')} placeholder="Jane" />
            </Field>
            <Field label={t('common.lastName')} required error={errors.lastName}>
              <Input error={errors.lastName} value={form.lastName} onChange={set('lastName')} placeholder="Smith" />
            </Field>
          </div>
          <Field label={t('common.email')} required error={errors.email}>
            <Input error={errors.email} type="email" value={form.email} onChange={set('email')} placeholder="jane@student.am" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('common.birthDate')}><Input type="date" value={form.birthDate} onChange={set('birthDate')} /></Field>
            <Field label={t('common.genderLabel')} required error={errors.gender}>
              <Select error={errors.gender} value={form.gender} onChange={set('gender')}>
                <option value="">{t('common.selectGender')}</option>
                <option value="male">{t('common.gender.male')}</option>
                <option value="female">{t('common.gender.female')}</option>
                <option value="other">{t('common.gender.other')}</option>
              </Select>
            </Field>
          </div>
          <Field label={t('common.class')}>
            <Select value={form.classId} onChange={set('classId')}>
              <option value="">— {t('common.selectClass')} —</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.grade}{c.section})</option>)}
            </Select>
          </Field>
          <Field label={t('common.phone')} error={errors.phone}>
            <Input error={errors.phone} type="tel" value={form.phone} onChange={set('phone')} placeholder="+374 00 000000" />
          </Field>
        </Modal>

        <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} loading={deleting} message={t('students.deleteConfirm', { name: `${deleteTarget?.firstName} ${deleteTarget?.lastName}` })} />

        <Modal
          open={filterModal}
          onClose={() => setFilterModal(false)}
          title={t('common.filter')}
          onSubmit={() => {
            setFilterClass(tempFilterClass);
            setFilterGender(tempFilterGender);
            setFilterModal(false);
          }}
          submitLabel={t('common.apply')}
        >
          <div className="space-y-4">
            <Field label={t('common.class')}>
              <Select
                value={tempFilterClass}
                onChange={e => setTempFilterClass(e.target.value)}
              >
                <option value="">— {t('common.allClasses')} —</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.grade}{c.section})</option>
                ))}
              </Select>
            </Field>

            <Field label={t('common.genderLabel')}>
              <Select
                value={tempFilterGender}
                onChange={e => setTempFilterGender(e.target.value)}
              >
                <option value="">— {t('common.allGenders')} —</option>
                <option value="male">{t('common.gender.male')}</option>
                <option value="female">{t('common.gender.female')}</option>
                <option value="other">{t('common.gender.other')}</option>
              </Select>
            </Field>
            {(tempFilterClass || tempFilterGender) && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTempFilterClass('');
                    setTempFilterGender('');
                  }}
                  className="w-full bg-purple-50 hover:bg-purple-100 text-purple-600 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  {t('common.reset')}
                </button>
              </div>
            )}
          </div>
        </Modal>
      </Layout>
    </>
  );
}
