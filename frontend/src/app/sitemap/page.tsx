import type { Metadata } from 'next';
import Link from 'next/link';
import { NAV_LINKS, FOOTER_SERVICE_LINKS, FOOTER_SUPPORT_LINKS } from '@/lib/constants';

export const metadata: Metadata = {
  title: '사이트맵',
  description: '비온팜(BeeOnFarm) 사이트맵 — 전체 페이지 안내',
};

export default function SitemapPage() {
  return (
    <>
      <section className="bg-bark-900 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-[30rem] h-[30rem] bg-honey-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative text-center">
          <p className="text-honey-400 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Sitemap</p>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight">
            사이트<span className="text-honey-400">맵</span>
          </h1>
          <p className="mt-4 text-bark-400 max-w-2xl mx-auto">
            비온팜 웹사이트의 전체 페이지 구조를 한눈에 확인하세요.
          </p>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Main Navigation */}
            <div>
              <h2 className="text-lg font-bold text-bark-900 mb-4 flex items-center gap-2">
                <span className="material-icons-outlined text-honey-500">menu</span>
                주요 페이지
              </h2>
              <ul className="space-y-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-bark-600 hover:text-honey-600 transition-colors"
                    >
                      <span className="material-icons-outlined text-sm text-bark-400">{link.icon}</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service Pages */}
            <div>
              <h2 className="text-lg font-bold text-bark-900 mb-4 flex items-center gap-2">
                <span className="material-icons-outlined text-honey-500">widgets</span>
                서비스
              </h2>
              <ul className="space-y-3">
                {FOOTER_SERVICE_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-bark-600 hover:text-honey-600 transition-colors"
                    >
                      <span className="material-icons-outlined text-xs text-bark-400">chevron_right</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Legal */}
            <div>
              <h2 className="text-lg font-bold text-bark-900 mb-4 flex items-center gap-2">
                <span className="material-icons-outlined text-honey-500">support</span>
                고객지원 & 법적고지
              </h2>
              <ul className="space-y-3">
                {FOOTER_SUPPORT_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-bark-600 hover:text-honey-600 transition-colors"
                    >
                      <span className="material-icons-outlined text-xs text-bark-400">chevron_right</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/privacy"
                    className="flex items-center gap-2 text-sm text-bark-600 hover:text-honey-600 transition-colors"
                  >
                    <span className="material-icons-outlined text-xs text-bark-400">chevron_right</span>
                    개인정보처리방침
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
