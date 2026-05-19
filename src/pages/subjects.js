import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Modal, { Field, Input, Select, Textarea } from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import ViewSwitcher from '@/components/ViewSwitcher';
import Pagination from '@/components/Pagination';
import { Search, Filter } from 'lucide-react';

const EMPTY = { name: '', description: '', backgroundImage: '' };
const ITEMS_PER_PAGE = 8;

export default function SubjectsPage() {
  const { t } = useTranslation();
  const router = useRouter();
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
  const [filterHasImage, setFilterHasImage] = useState('');
  const [tempFilterHasImage, setTempFilterHasImage] = useState('');
  const [filterHasDesc, setFilterHasDesc] = useState('');
  const [tempFilterHasDesc, setTempFilterHasDesc] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/subjects').then(r => r.json()).then(d => { setSubjects(d); setLoading(false); });
  }, []);
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
  const openEdit = (s) => {
    const editValues = { name: s.name, description: s.description || '', backgroundImage: s.backgroundImage || '' };
    setForm(editValues);
    setInitialForm(editValues);
    setErrors({});
    setEditId(s.id); setModal(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) {
      errs.name = t('validation.required', 'This field is required');
    } else if (form.name.trim().length < 2) {
      errs.name = t('validation.minCharacters', 'Must be at least 2 characters');
    }

    if (form.backgroundImage && form.backgroundImage.trim()) {
      if (!/^(https?:\/\/|\/)/i.test(form.backgroundImage.trim())) {
        errs.backgroundImage = t('validation.invalidUrl', 'Must start with http://, https:// or /');
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/subjects/${editId}` : '/api/subjects';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false); setModal(false); load();
  };

  const confirmDelete = async () => {
    const id = deleteTarget?.id;
    if (!id) return;
    setDeleting(true);
    await fetch(`/api/subjects/${id}`, { method: 'DELETE' });
    setDeleting(false); setDeleteTarget(null); load();
  };

  const filtered = subjects.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || (s.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesImage = filterHasImage === 'yes' ? !!s.backgroundImage : filterHasImage === 'no' ? !s.backgroundImage : true;
    const matchesDesc = filterHasDesc === 'yes' ? !!s.description : filterHasDesc === 'no' ? !s.description : true;
    return matchesSearch && matchesImage && matchesDesc;
  });

  const totalItems = filtered.length;
  const paginatedItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterHasImage, filterHasDesc]);

  return (
    <>
      <Head><title>{t('nav.subjects')} – EduAdmin</title></Head>
      <Layout>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-purple-950">{t('subjects.title')}</h1>
            <p className="text-purple-400 text-sm mt-0.5">{subjects.length} {t('subjects.total')}</p>
          </div>
          <div className="flex items-center gap-3">
            <ViewSwitcher view={viewMode} onChange={setViewMode} />
            <button onClick={openCreate} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              {t('subjects.addSubject')}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
            <input
              className="w-full bg-white border border-purple-100 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-purple-950 placeholder:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all shadow-sm"
              placeholder={t('subjects.searchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setTempFilterHasImage(filterHasImage);
              setTempFilterHasDesc(filterHasDesc);
              setFilterModal(true);
            }}
            className={`flex items-center gap-2 px-6 py-3 bg-white border rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm ${filterHasImage || filterHasDesc
              ? 'border-purple-600 text-purple-600 ring-2 ring-purple-100'
              : 'border-purple-100 text-purple-400 hover:text-purple-600'
              }`}
          >
            <Filter size={16} />
            {t('common.filter')}
            {(filterHasImage || filterHasDesc) && (
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
            <p>{t('subjects.notFound')}</p>
          </div>
        ) : viewMode === 'table' ? (
          <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-purple-50 border-b border-purple-100">
                <tr>
                  {['id', 'name', 'description', 'actions'].map(h => (
                    <th key={h} className={`px-6 py-4 text-xs font-semibold text-purple-600 uppercase tracking-wider ${h === 'actions' ? 'text-right' : 'text-left'}`}>{t(`common.${h}`)}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedItems.map((s, i) => (
                  <tr key={s.id} className="table-row-hover transition-colors group">
                    <td className="px-6 py-4 text-gray-400">{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{s.name}</td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{s.description || '—'}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openEdit(s)} className="text-purple-600 hover:text-purple-900 font-medium text-xs px-2 py-1 rounded-lg hover:bg-purple-50 transition-colors">{t('common.edit')}</button>
                      <button onClick={() => setDeleteTarget(s)} className="text-red-500 hover:text-red-700 font-medium text-xs px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">{t('common.delete')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedItems.map((s) => (
              <div key={s.id} className="relative bg-white rounded-2xl border border-purple-100 shadow-sm group flex flex-col card-hover overflow-hidden isolate h-[230px] hover:cursor-pointer">

                <div className="relative h-[130px] overflow-hidden flex-shrink-0">
                  {s.backgroundImage ? (
                    <div
                      className="absolute inset-0 opacity-90 group-hover:opacity-95 transition-all duration-700 ease-out group-hover:scale-110 bg-cover bg-center"
                      style={{ backgroundImage: `url('${s.backgroundImage}')` }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-700 to-indigo-900" />
                  )}

                  <div className="absolute inset-0 bg-purple-950/20 group-hover:bg-purple-950/15 transition-colors duration-300" />


                  <div className="relative z-10 p-4 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                      <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-bold text-base shadow-inner border border-white/20">
                        {s.name[0]}
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

                    <h3 className="text-base font-extrabold text-purple-100 drop-shadow-md truncate" style={{ textShadow: '0 2px 4px rgba(88, 28, 135, 0.8)' }}>{s.name}</h3>
                  </div>
                </div>


                <div className="p-4 flex-grow bg-white flex flex-col justify-start">
                  <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed">{s.description || t('subjects.noDescription')}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />

        <Modal open={modal} onClose={() => setModal(false)} title={editId ? t('subjects.editSubject') : t('subjects.newSubject')} onSubmit={save} loading={saving} submitDisabled={JSON.stringify(form) === JSON.stringify(initialForm)}>
          <Field label={t('common.subjectName')} required error={errors.name}>
            <Input error={errors.name} value={form.name} onChange={set('name')} placeholder="Mathematics" />
          </Field>
          <Field label={t('common.description')}>
            <Textarea rows={4} value={form.description} onChange={set('description')} placeholder={t('subjects.descriptionPlaceholder')} />
          </Field>
          <Field label={t('common.backgroundImage')} error={errors.backgroundImage}>
            <Input error={errors.backgroundImage} value={form.backgroundImage} onChange={set('backgroundImage')} placeholder={t('subjects.backgroundImagePlaceholder')} />
          </Field>
        </Modal>

        <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} loading={deleting} message={t('subjects.deleteConfirm', { name: deleteTarget?.name })} />

        <Modal
          open={filterModal}
          onClose={() => setFilterModal(false)}
          title={t('common.filter')}
          onSubmit={() => {
            setFilterHasImage(tempFilterHasImage);
            setFilterHasDesc(tempFilterHasDesc);
            setFilterModal(false);
          }}
          submitLabel={t('common.apply')}
        >
          <div className="space-y-4">
            <Field label={t('common.hasBackgroundImage')}>
              <Select
                value={tempFilterHasImage}
                onChange={e => setTempFilterHasImage(e.target.value)}
              >
                <option value="">— {t('common.all')} —</option>
                <option value="yes">{t('common.yes')}</option>
                <option value="no">{t('common.no')}</option>
              </Select>
            </Field>

            <Field label={t('common.hasDescription')}>
              <Select
                value={tempFilterHasDesc}
                onChange={e => setTempFilterHasDesc(e.target.value)}
              >
                <option value="">— {t('common.all')} —</option>
                <option value="yes">{t('common.yes')}</option>
                <option value="no">{t('common.no')}</option>
              </Select>
            </Field>

            {(tempFilterHasImage || tempFilterHasDesc) && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTempFilterHasImage('');
                    setTempFilterHasDesc('');
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
