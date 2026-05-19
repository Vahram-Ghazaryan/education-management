import { LayoutGrid, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ViewSwitcher({ view, onChange }) {
  const { t } = useTranslation();
  return (
    <div className="flex bg-purple-50 p-1 rounded-2xl border border-purple-100 shadow-inner">
      <button
        onClick={() => onChange('table')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'table'
          ? 'bg-white text-purple-700 shadow-md shadow-purple-900/5 ring-1 ring-purple-100'
          : 'text-purple-300 hover:text-purple-500'
          }`}
      >
        <List size={16} strokeWidth={3} />
        <span className="hidden sm:inline">{t('common.table')}</span>
      </button>
      <button
        onClick={() => onChange('card')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'card'
          ? 'bg-white text-purple-700 shadow-md shadow-purple-900/5 ring-1 ring-purple-100'
          : 'text-purple-300 hover:text-purple-500'
          }`}
      >
        <LayoutGrid size={16} strokeWidth={3} />
        <span className="hidden sm:inline">{t('common.cards')}</span>
      </button>
    </div>
  );
}
