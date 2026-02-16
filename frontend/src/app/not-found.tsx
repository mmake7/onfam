'use client';

import Link from 'next/link';
import { NAV_LINKS } from '@/lib/constants';
import { useTranslation } from '@/context/LanguageContext';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-bark-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-[18rem] sm:w-[30rem] h-[18rem] sm:h-[30rem] bg-honey-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-[18rem] sm:w-[30rem] h-[18rem] sm:h-[30rem] bg-farm-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center py-20">
        <div className="mb-8">
          <span className="material-icons-outlined text-8xl text-honey-400/30">search_off</span>
        </div>

        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-honey-300 via-honey-400 to-farm-400 mb-4">
          {t.notFound.title}
        </h1>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          {t.notFound.subtitle}
        </h2>

        <p className="text-bark-400 mb-10 max-w-md mx-auto leading-relaxed">
          {t.notFound.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-4 text-base font-bold text-bark-900 bg-honey-400 rounded-full hover:bg-honey-300 transition-colors text-center"
          >
            {t.notFound.goHome}
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white border border-bark-600 rounded-full hover:border-honey-500/50 hover:text-honey-400 transition-all text-center"
          >
            {t.notFound.contact}
          </Link>
        </div>

        <div className="border-t border-bark-800 pt-10">
          <p className="text-bark-500 text-sm mb-6">{t.notFound.suggestion}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-bark-400 bg-bark-800 rounded-full border border-bark-700 hover:border-honey-500/30 hover:text-honey-400 transition-all"
              >
                <span className="material-icons-outlined text-sm">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
