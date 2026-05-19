import { useTranslation } from 'react-i18next';
import Head from 'next/head';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { ServerCrash, ArrowLeft } from 'lucide-react';

export default function Custom500() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t('serverErrorPage.title', '500 - Server Error')} - EduAdmin</title>
      </Head>
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-in fade-in duration-500">
          <div className="bg-red-100 p-6 rounded-full mb-6 shadow-sm">
            <ServerCrash size={64} className="text-red-600" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-purple-950 mb-4 tracking-tighter drop-shadow-sm" style={{ textShadow: '0 2px 4px rgba(88, 28, 135, 0.2)' }}>
            500
          </h1>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t('serverErrorPage.title', 'Server Error')}
          </h2>

          <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
            {t('serverErrorPage.description', 'Oops, something went wrong on our servers. We are looking into it and will have it fixed as soon as possible.')}
          </p>

          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-200 hover:-translate-y-0.5"
          >
            <ArrowLeft size={20} />
            {t('serverErrorPage.backHome', 'Back to Dashboard')}
          </Link>
        </div>
      </Layout>
    </>
  );
}
