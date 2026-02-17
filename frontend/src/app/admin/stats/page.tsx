'use client';

import { useTranslation } from '@/context/LanguageContext';

export default function AdminStatsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-bark-900">{t.admin.stats.title}</h1>
        <p className="text-sm text-bark-500 mt-1">{t.admin.stats.description}</p>
      </div>
      <div className="bg-white rounded-xl border border-bark-200 p-8 text-center">
        <span className="material-icons-outlined text-5xl text-bark-300 mb-3 block">bar_chart</span>
        <p className="text-bark-500 text-sm">{t.admin.stats.preparing}</p>
      </div>
    </div>
  );
}
