import { Trans, useTranslation } from 'react-i18next';

export default function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }) {
  const { t } = useTranslation();
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pages = getVisiblePages();

  return (
    <div className="flex items-center justify-between mt-6 px-2">
      <p className="text-sm text-purple-500">
        <Trans
          t={t}
          i18nKey="common.showingResults"
          values={{
            start: (currentPage - 1) * itemsPerPage + 1,
            end: Math.min(currentPage * itemsPerPage, totalItems),
            total: totalItems
          }}
          components={{
            bold: <span className="font-semibold text-purple-700" />
          }}
        />
      </p>
      <div className="flex gap-1">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 rounded-lg border border-purple-200 bg-white text-purple-600 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-purple-600 font-bold">
                ...
              </span>
            );
          }
          return (
            <button
              key={`page-${p}`}
              onClick={() => onPageChange(p)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${p === currentPage
                ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                : 'bg-white border border-purple-200 text-purple-600 hover:bg-purple-50'
                }`}
            >
              {p}
            </button>
          );
        })}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 rounded-lg border border-purple-200 bg-white text-purple-600 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
