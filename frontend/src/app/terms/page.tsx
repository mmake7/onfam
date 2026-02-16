'use client';

import Link from 'next/link';
import { COMPANY_NAME, COMPANY_EMAIL } from '@/lib/constants';
import { useTranslation } from '@/context/LanguageContext';

export default function TermsPage() {
  const { t } = useTranslation();

  const sections = (t.terms.sections as { title: string; content?: string; items?: string[] }[]).map((section, idx) => ({
    ...section,
    content: idx === 0 ? `${COMPANY_NAME}${section.content}` : section.content,
  }));

  return (
    <>
      <section className="bg-bark-900 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-[18rem] sm:w-[30rem] h-[18rem] sm:h-[30rem] bg-honey-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative text-center">
          <p className="text-honey-400 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.terms.subtitle}</p>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight">
            {t.terms.title}<span className="text-honey-400">{t.terms.titleHighlight}</span>
          </h1>
          <p className="mt-4 text-bark-400 max-w-2xl mx-auto">
            {t.terms.heroDescription}
          </p>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="space-y-10">
            {sections.map((section, idx) => (
              <article key={idx}>
                <h2 className="text-lg font-bold text-bark-900 mb-3 flex items-start gap-2">
                  <span className="material-icons-outlined text-honey-500 text-xl mt-0.5 shrink-0">gavel</span>
                  {section.title}
                </h2>
                {section.content && (
                  <p className="text-sm text-bark-600 leading-relaxed mb-3">{section.content}</p>
                )}
                {section.items && section.items.length > 0 && (
                  <ol className="space-y-2 pl-1">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-bark-500">
                        <span className="text-honey-500 font-bold text-xs mt-0.5 shrink-0 w-5 text-center">{i + 1}.</span>
                        {item}
                      </li>
                    ))}
                  </ol>
                )}
              </article>
            ))}
          </div>

          <div className="mt-16 p-6 bg-bark-50 rounded-2xl border border-bark-200 text-center">
            <p className="text-sm text-bark-500 mb-4">
              {t.terms.contactCta}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-bark-900 bg-honey-400 rounded-full hover:bg-honey-300 transition-colors"
              >
                {t.terms.contactBtn}
                <span className="material-icons-outlined text-lg">arrow_forward</span>
              </Link>
              <a
                href={`mailto:${COMPANY_EMAIL}`}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-bark-600 border border-bark-200 rounded-full hover:border-honey-300 transition-colors"
              >
                <span className="material-icons-outlined text-base">mail</span>
                {COMPANY_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
