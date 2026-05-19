import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Head from 'next/head';
import Layout from '@/components/Layout';
import Modal, { Field, Input, Select, Textarea } from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import ViewSwitcher from '@/components/ViewSwitcher';
import Pagination from '@/components/Pagination';
import { Search, Filter } from 'lucide-react';

const today = () => new Date().toISOString().split('T')[0];
const EMPTY = { studentId: '', subjectId: '', score: '', maxScore: '100', date: today(), notes: '' };
const ITEMS_PER_PAGE = 8;

const scoreColor = (score, max) => {
  const pct = (score / max) * 100;
  if (pct >= 90) return 'bg-purple-600 text-white border-purple-500';
  if (pct >= 75) return 'bg-purple-100 text-purple-700 border-purple-200';
  if (pct >= 60) return 'bg-violet-100 text-violet-700 border-violet-200';
  return 'bg-indigo-50 text-indigo-600 border-indigo-100';
};

const gradeBgImage = (score, max) => {
  const pct = (score / max) * 100;
  if (pct >= 90) return '/images/grades/100_90.png';
  if (pct >= 75) return '/images/grades/90_75.png';
  if (pct >= 60) return '/images/grades/75_60.png';
  return '/images/grades/60_10.png';
};

export default function GradesPage() {
  const { t } = useTranslation();
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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
  const [filterPerformance, setFilterPerformance] = useState('');
  const [tempFilterPerformance, setTempFilterPerformance] = useState('');

  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(filterSubject && { subjectId: filterSubject }),
      ...(filterPerformance && { performance: filterPerformance }),
    });

    Promise.all([
      fetch(`/api/grades?${params}`).then(r => r.json()),
      fetch('/api/students').then(r => r.json()),
      fetch('/api/subjects').then(r => r.json()),
    ]).then(([gradesRes, s, sub]) => {
      setGrades(gradesRes.grades || []);
      setTotalItems(gradesRes.total || 0);
      setStudents(s);
      setSubjects(sub);
      setLoading(false);
    });
  }, [currentPage, debouncedSearch, filterSubject, filterPerformance]);

  useEffect(load, [load]);

  const [initialForm, setInitialForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

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
  const openEdit = (g) => {
    const editValues = { studentId: g.studentId, subjectId: g.subjectId, score: g.score, maxScore: g.maxScore, date: g.date, notes: g.notes || '' };
    setForm(editValues);
    setInitialForm(editValues);
    setErrors({});
    setEditId(g.id); setModal(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.studentId) {
      errs.studentId = t('validation.required', 'This field is required');
    }
    if (!form.subjectId) {
      errs.subjectId = t('validation.required', 'This field is required');
    }

    const sc = Number(form.score);
    if (form.score === '' || isNaN(sc)) {
      errs.score = t('validation.required', 'This field is required');
    } else if (sc < 0) {
      errs.score = t('validation.invalidScore', 'Score must be 0 or higher');
    }

    if (form.maxScore !== undefined && form.maxScore !== '') {
      const mx = Number(form.maxScore);
      if (isNaN(mx) || mx <= 0) {
        errs.maxScore = t('validation.invalidMaxScore', 'Max score must be greater than 0');
      } else if (!isNaN(sc) && sc > mx) {
        errs.score = t('validation.scoreExceedsMax', 'Score cannot exceed max score');
      }
    }

    if (!form.date) {
      errs.date = t('validation.required', 'This field is required');
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/grades/${editId}` : '/api/grades';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false); setModal(false); load();
  };

  const confirmDelete = async () => {
    const id = deleteTarget?.id;
    if (!id) return;
    setDeleting(true);
    await fetch(`/api/grades/${id}`, { method: 'DELETE' });
    setDeleting(false); setDeleteTarget(null); load();
  };

  const paginatedItems = grades;

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterSubject, filterPerformance]);

  return (
    <>
      <Head><title>{t('nav.grades')} – EduAdmin</title></Head>
      <Layout>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-purple-950">{t('grades.title')}</h1>
            <p className="text-purple-400 text-sm mt-0.5">{totalItems} {t('grades.records')}</p>
          </div>
          <div className="flex items-center gap-3">
            <ViewSwitcher view={viewMode} onChange={setViewMode} />
            <button onClick={openCreate} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              {t('grades.addGrade')}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
            <input
              className="w-full bg-white border border-purple-100 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-purple-950 placeholder:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all shadow-sm"
              placeholder={t('grades.searchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setTempFilterSubject(filterSubject);
              setTempFilterPerformance(filterPerformance);
              setFilterModal(true);
            }}
            className={`flex items-center gap-2 px-6 py-3 bg-white border rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm ${filterSubject || filterPerformance
                ? 'border-purple-600 text-purple-600 ring-2 ring-purple-100'
                : 'border-purple-100 text-purple-400 hover:text-purple-600'
              }`}
          >
            <Filter size={16} />
            {t('common.filter')}
            {(filterSubject || filterPerformance) && (
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
            )}
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-purple-300">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-purple-600 rounded-full mb-4"></div>
            <p>{t('common.loading')}</p>
          </div>
        ) : paginatedItems.length === 0 ? (
          <div className="p-12 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-purple-200">
            <p className="text-4xl mb-2">🔍</p>
            <p>{t('grades.notFound')}</p>
          </div>
        ) : viewMode === 'table' ? (
          <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-purple-50 border-b border-purple-100">
                <tr>
                  {['id', 'student', 'subject', 'score', 'date', 'actions'].map(h => (
                    <th key={h} className={`px-6 py-4 text-xs font-semibold text-purple-600 uppercase tracking-wider ${h === 'actions' ? 'text-right' : 'text-left'}`}>{t(`common.${h}`)}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedItems.map((g, i) => (
                  <tr key={g.id} className="table-row-hover transition-colors group">
                    <td className="px-6 py-4 text-gray-400">{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{g.student ? `${g.student.firstName} ${g.student.lastName}` : '—'}</td>
                    <td className="px-6 py-4 text-gray-600">{g.subject?.name || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${scoreColor(g.score, g.maxScore)}`}>
                        {g.score}/{g.maxScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{g.date}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openEdit(g)} className="text-purple-600 hover:text-purple-900 font-medium text-xs px-2 py-1 rounded-lg hover:bg-purple-50 transition-colors">{t('common.edit')}</button>
                      <button onClick={() => setDeleteTarget(g)} className="text-red-500 hover:text-red-700 font-medium text-xs px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">{t('common.delete')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedItems.map((g) => (
              <div key={g.id} className="relative bg-white rounded-2xl border border-purple-100 shadow-sm group flex flex-col card-hover overflow-hidden isolate h-[250px]">

                <div className="relative h-[125px] overflow-hidden flex-shrink-0">
                  <div
                    className="absolute inset-0 opacity-90 group-hover:opacity-95 transition-all duration-700 ease-out group-hover:scale-110 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${gradeBgImage(g.score, g.maxScore)}')`
                    }}
                  />

                  <div className="absolute inset-0 bg-purple-950/20 group-hover:bg-purple-950/15 transition-colors duration-300" />


                  <div className="relative z-10 p-4 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-black border shadow-sm ${scoreColor(g.score, g.maxScore)}`}>
                        {g.score} / {g.maxScore}
                      </span>
                      <div className="flex gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(g)} className="p-1.5 bg-white/90 hover:bg-purple-600 text-purple-700 hover:text-white rounded-xl shadow-sm border border-purple-100 transition-all cursor-pointer animate-fade-in" title={t('common.edit')}>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => setDeleteTarget(g)} className="p-1.5 bg-white/90 hover:bg-red-600 text-red-600 hover:text-white rounded-xl shadow-sm border border-red-100 transition-all cursor-pointer animate-fade-in" title={t('common.delete')}>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>


                    <div>
                      <p className="font-black text-purple-100 text-sm leading-none mb-1 drop-shadow-md" style={{ textShadow: '0 2px 4px rgba(88, 28, 135, 0.8)' }}>
                        {g.student?.firstName} {g.student?.lastName}
                      </p>
                      <p className="text-[10px] font-bold text-purple-200/80 uppercase tracking-wider leading-none drop-shadow-sm" style={{ textShadow: '0 1px 2px rgba(88, 28, 135, 0.6)' }}>
                        {t('grades.title')} #{g.id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-grow p-4 bg-white flex flex-col justify-between relative z-10">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-purple-100">
                        {g.subject?.name}
                      </span>
                      <span className="text-[10px] text-purple-300 font-bold flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {g.date}
                      </span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-purple-50">
                    {g.notes ? (
                      <p className="text-[11px] text-purple-400 font-medium italic line-clamp-2 px-2 border-l-2 border-purple-200">
                        "{g.notes}"
                      </p>
                    ) : (
                      <p className="text-[11px] text-purple-300 font-medium italic line-clamp-2 px-2">
                        {t('grades.noNotes')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />

        <Modal open={modal} onClose={() => setModal(false)} title={editId ? t('grades.editGrade') : t('grades.newGrade')} onSubmit={save} loading={saving} submitDisabled={JSON.stringify(form) === JSON.stringify(initialForm)}>
          <Field label={t('common.student')} required error={errors.studentId}>
            <Select error={errors.studentId} value={form.studentId} onChange={set('studentId')}>
              <option value="">— {t('common.selectStudent')} —</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
            </Select>
          </Field>
          <Field label={t('common.subject')} required error={errors.subjectId}>
            <Select error={errors.subjectId} value={form.subjectId} onChange={set('subjectId')}>
              <option value="">— {t('common.selectSubject')} —</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('common.score')} required error={errors.score}>
              <Input error={errors.score} type="number" min="0" value={form.score} onChange={set('score')} placeholder="85" />
            </Field>
            <Field label={t('common.maxScore')} error={errors.maxScore}>
              <Input error={errors.maxScore} type="number" min="1" value={form.maxScore} onChange={set('maxScore')} />
            </Field>
          </div>
          <Field label={t('common.date')} required error={errors.date}>
            <Input error={errors.date} type="date" value={form.date} onChange={set('date')} />
          </Field>
          <Field label={t('common.notes')}><Textarea value={form.notes} onChange={set('notes')} placeholder={t('grades.notesPlaceholder')} /></Field>
        </Modal>

        <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} loading={deleting} message={t('grades.deleteConfirm')} />

        <Modal
          open={filterModal}
          onClose={() => setFilterModal(false)}
          title={t('common.filter')}
          onSubmit={() => {
            setFilterSubject(tempFilterSubject);
            setFilterPerformance(tempFilterPerformance);
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

            <Field label={t('common.performance')}>
              <Select
                value={tempFilterPerformance}
                onChange={e => setTempFilterPerformance(e.target.value)}
              >
                <option value="">— {t('common.all')} —</option>
                <option value="excellent">{t('common.performanceLevel.excellent')}</option>
                <option value="good">{t('common.performanceLevel.good')}</option>
                <option value="pass">{t('common.performanceLevel.pass')}</option>
                <option value="fail">{t('common.performanceLevel.fail')}</option>
              </Select>
            </Field>

            {(tempFilterSubject || tempFilterPerformance) && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTempFilterSubject('');
                    setTempFilterPerformance('');
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
