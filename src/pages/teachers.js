import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Modal, { Field, Input, Select } from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import ViewSwitcher from '@/components/ViewSwitcher';
import Pagination from '@/components/Pagination';
import { Search, Filter, Mail, Phone } from 'lucide-react';

const EMPTY = { firstName: '', lastName: '', email: '', phone: '', subjectId: '', gender: '' };
const ITEMS_PER_PAGE = 8;

export default function TeachersPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (router.query.search) {
      setSearch(router.query.search);
    }
  }, [router.query.search]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);


  const [viewMode, setViewMode] = useState('card');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterModal, setFilterModal] = useState(false);
  const [filterSubject, setFilterSubject] = useState('');
  const [tempFilterSubject, setTempFilterSubject] = useState('');

  const [initialForm, setInitialForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([fetch('/api/teachers').then(r => r.json()), fetch('/api/subjects').then(r => r.json())])
      .then(([t, s]) => { setTeachers(t); setSubjects(s); setLoading(false); });
  }, []);
  useEffect(load, [load]);

  const set = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: null }));
    }
  };
  const openCreate = () => {
    setForm(EMPTY);
    setInitialForm(EMPTY);
    setErrors({});
    setEditId(null);
    setModal(true);
  };
  const openEdit = (t) => {
    const editValues = { firstName: t.firstName, lastName: t.lastName, email: t.email, phone: t.phone || '', subjectId: t.subjectId || '', gender: t.gender || '' };
    setForm(editValues);
    setInitialForm(editValues);
    setErrors({});
    setEditId(t.id); setModal(true);
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
    const url = editId ? `/api/teachers/${editId}` : '/api/teachers';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false); setModal(false); load();
  };

  const confirmDelete = async () => {
    const id = deleteTarget?.id;
    if (!id) return;
    setDeleting(true);
    await fetch(`/api/teachers/${id}`, { method: 'DELETE' });
    setDeleting(false); setDeleteTarget(null); load();
  };

  const filtered = teachers.filter(t => {
    const matchesSearch = `${t.firstName} ${t.lastName} ${t.email}`.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = filterSubject ? String(t.subjectId) === String(filterSubject) : true;
    return matchesSearch && matchesSubject;
  });


  const totalItems = filtered.length;
  const paginatedItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterSubject]);

  return (
    <>
      <Head><title>{t('nav.teachers')} – EduAdmin</title></Head>
      <Layout>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-purple-950">{t('teachers.title')}</h1>
            <p className="text-purple-400 text-sm mt-0.5">{teachers.length} {t('teachers.total')}</p>
          </div>
          <div className="flex items-center gap-3">
            <ViewSwitcher view={viewMode} onChange={setViewMode} />
            <button onClick={openCreate} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              {t('teachers.addTeacher')}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
            <input
              className="w-full bg-white border border-purple-100 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-purple-950 placeholder:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all shadow-sm"
              placeholder={t('teachers.searchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setTempFilterSubject(filterSubject);
              setFilterModal(true);
            }}
            className={`flex items-center gap-2 px-6 py-3 bg-white border rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm ${filterSubject
                ? 'border-purple-600 text-purple-600 ring-2 ring-purple-100'
                : 'border-purple-100 text-purple-400 hover:text-purple-600'
              }`}
          >
            <Filter size={16} />
            {t('common.filter')}
            {filterSubject && (
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
            )}
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-purple-300">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-purple-600 rounded-full mb-4"></div>
            <p>{t('common.loading')}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-purple-200">
            <p className="text-4xl mb-2">🔍</p>
            <p>{t('teachers.notFound')}</p>
          </div>
        ) : viewMode === 'table' ? (
          <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-purple-50 border-b border-purple-100">
                <tr>
                  {['id', 'name', 'email', 'phone', 'subject', 'actions'].map(h => (
                    <th key={h} className={`px-6 py-4 text-xs font-semibold text-purple-600 uppercase tracking-wider ${h === 'actions' ? 'text-right' : 'text-left'}`}>{t(`common.${h}`)}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedItems.map((teacher, i) => (
                  <tr key={teacher.id} className="table-row-hover transition-colors group">
                    <td className="px-6 py-4 text-gray-400">{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${teacher.gender === 'female' ? 'bg-pink-100 text-pink-600' : teacher.gender === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                          }`}>
                          {teacher.firstName[0]}{teacher.lastName[0]}
                        </div>
                        <span className="font-medium text-gray-900">{teacher.firstName} {teacher.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{teacher.email}</td>
                    <td className="px-6 py-4 text-gray-500">{teacher.phone || '—'}</td>
                    <td className="px-6 py-4">
                      {teacher.subject ? (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium border border-purple-200">{teacher.subject.name}</span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openEdit(teacher)} className="text-purple-600 hover:text-purple-900 font-medium text-xs px-2 py-1 rounded-lg hover:bg-purple-50 transition-colors">{t('common.edit')}</button>
                      <button onClick={() => setDeleteTarget(teacher)} className="text-red-500 hover:text-red-700 font-medium text-xs px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">{t('common.delete')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedItems.map((teacher) => (
              <div key={teacher.id} className="relative bg-white rounded-2xl border border-purple-100 shadow-sm group flex flex-col card-hover overflow-hidden isolate h-[240px]">

                <div className="relative h-[120px] overflow-hidden flex-shrink-0">
                  <div
                    className="absolute inset-0 opacity-90 group-hover:opacity-95 transition-all duration-700 ease-out group-hover:scale-110 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${teacher.gender === 'male' ? '/images/male_teacher_bg.png' : '/images/female_teacher_bg.png'}')`
                    }}
                  />

                  <div className="absolute inset-0 bg-purple-950/20 group-hover:bg-purple-950/15 transition-colors duration-300" />


                  <div className="relative z-10 p-4 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                      <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-bold text-base shadow-inner border border-white/20">
                        {teacher.firstName[0]}{teacher.lastName[0]}
                      </div>
                      <div className="flex gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(teacher)} className="p-1.5 bg-white/90 hover:bg-purple-600 text-purple-700 hover:text-white rounded-xl shadow-sm border border-purple-100 transition-all cursor-pointer animate-fade-in" title={t('common.edit')}>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => setDeleteTarget(teacher)} className="p-1.5 bg-white/90 hover:bg-red-600 text-red-600 hover:text-white rounded-xl shadow-sm border border-red-100 transition-all cursor-pointer animate-fade-in" title={t('common.delete')}>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-extrabold text-purple-100 drop-shadow-md truncate" style={{ textShadow: '0 2px 4px rgba(88, 28, 135, 0.8)' }}>{teacher.firstName} {teacher.lastName}</h3>
                  </div>
                </div>


                <div className="p-4 flex-grow bg-white flex flex-col justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-purple-100">
                      {teacher.subject?.name || t('teachers.noSubject')}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${teacher.gender === 'female' ? 'bg-pink-50 text-pink-600 border-pink-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                      {t(`common.gender.${teacher.gender}`, teacher.gender)}
                    </span>
                  </div>

                  <div className="space-y-1.5 mt-3 pt-3 border-t border-purple-50">
                    <div className="flex items-center gap-2.5 text-xs text-gray-500 font-medium">
                      <Mail size={12} className="text-purple-400 flex-shrink-0" />
                      <span className="truncate">{teacher.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-gray-500 font-medium">
                      <Phone size={12} className="text-purple-400 flex-shrink-0" />
                      <span>{teacher.phone || t('teachers.noPhone')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />

        <Modal open={modal} onClose={() => setModal(false)} title={editId ? t('teachers.editTeacher') : t('teachers.newTeacher')} onSubmit={save} loading={saving} submitDisabled={JSON.stringify(form) === JSON.stringify(initialForm)}>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('common.firstName')} required error={errors.firstName}>
              <Input error={errors.firstName} value={form.firstName} onChange={set('firstName')} placeholder="John" />
            </Field>
            <Field label={t('common.lastName')} required error={errors.lastName}>
              <Input error={errors.lastName} value={form.lastName} onChange={set('lastName')} placeholder="Smith" />
            </Field>
          </div>
          <Field label={t('common.email')} required error={errors.email}>
            <Input error={errors.email} type="email" value={form.email} onChange={set('email')} placeholder="john@school.edu" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('common.phone')} error={errors.phone}>
              <Input error={errors.phone} type="tel" value={form.phone} onChange={set('phone')} placeholder="+1 555 000 0000" />
            </Field>
            <Field label={t('common.genderLabel')} required error={errors.gender}>
              <Select error={errors.gender} value={form.gender} onChange={set('gender')}>
                <option value="">{t('common.selectGender')}</option>
                <option value="male">{t('common.gender.male')}</option>
                <option value="female">{t('common.gender.female')}</option>
                <option value="other">{t('common.gender.other')}</option>
              </Select>
            </Field>
          </div>
          <Field label={t('common.subject')}>
            <Select value={form.subjectId} onChange={set('subjectId')}>
              <option value="">— {t('common.noSubject')} —</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </Field>
        </Modal>

        <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} loading={deleting} message={t('teachers.deleteConfirm', { name: `${deleteTarget?.firstName} ${deleteTarget?.lastName}` })} />

        <Modal
          open={filterModal}
          onClose={() => setFilterModal(false)}
          title={t('common.filter')}
          onSubmit={() => {
            setFilterSubject(tempFilterSubject);
            setFilterModal(false);
          }}
          submitLabel={t('common.apply')}
        >
          <div className="space-y-4">
            <Field label={t('common.subject')}>
              <Select
                value={tempFilterSubject}
                onChange={e => setTempFilterSubject(e.target.value)}
              >
                <option value="">— {t('common.allSubjects')} —</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </Select>
            </Field>

            {tempFilterSubject && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTempFilterSubject('');
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
