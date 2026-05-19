import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function ConfirmModal({ open, onClose, onConfirm, title, message, loading }) {
  const { t } = useTranslation();
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes('MAC'));
  }, []);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="modal-in bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title || t('common.confirmDelete')}</h3>
          <p className="text-sm text-gray-500 mb-6">{message || t('common.cannotBeUndone')}</p>
          <div className="flex gap-3">
            {!isMac && (
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-60 transition-colors"
              >
                {loading ? t('common.deleting') : t('common.delete')}
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t('common.cancel')}
            </button>
            {isMac && (
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-60 transition-colors"
              >
                {loading ? t('common.deleting') : t('common.delete')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
