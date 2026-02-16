'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS, COMPANY_PHONE, COMPANY_EMAIL, COMPANY_HOURS } from '@/lib/constants';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [topBarVisible, setTopBarVisible] = useState(true);
  const pathname = usePathname();

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    setScrolled(y > 20);
    setTopBarVisible(y <= 20);
  }, []);

  useEffect(() => {
    const onScroll = () => handleScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [handleScroll]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Skip navigation — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-honey-400 focus:text-bark-900 focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:text-sm"
      >
        본문 바로가기
      </a>

      {/* Top Info Bar */}
      <div
        className={`bg-bark-900 text-bark-400 text-xs transition-all duration-300 ${
          topBarVisible ? 'h-9 opacity-100' : 'h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="material-icons-outlined text-xs text-honey-500">schedule</span>
              {COMPANY_HOURS}
            </span>
            <span className="w-px h-3 bg-bark-700" />
            <a href={`tel:${COMPANY_PHONE}`} className="flex items-center gap-1 hover:text-honey-400 transition-colors">
              <span className="material-icons-outlined text-xs text-honey-500">phone</span>
              {COMPANY_PHONE}
            </a>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <a href={`mailto:${COMPANY_EMAIL}`} className="flex items-center gap-1 hover:text-honey-400 transition-colors">
              <span className="material-icons-outlined text-xs text-honey-500">mail</span>
              <span className="hidden sm:inline">{COMPANY_EMAIL}</span>
              <span className="sm:hidden">이메일</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-bark-900/95 backdrop-blur-xl shadow-lg shadow-black/10'
            : 'bg-bark-900/80 backdrop-blur-xl'
        } border-b border-bark-700/50`}
        role="navigation"
        aria-label="메인 내비게이션"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="BeeOnFarm 홈">
            <span className="material-icons-outlined text-honey-400 text-3xl" aria-hidden="true">hexagon</span>
            <span className="text-white font-bold text-lg tracking-tight">
              BeeOn<span className="text-honey-400">Farm</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 text-sm" role="menubar">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                className={`relative px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive(link.href)
                    ? 'text-honey-400 font-semibold bg-honey-400/10'
                    : 'text-bark-300 hover:text-white hover:bg-bark-800/50'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-honey-400 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side — CTA + Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/contact"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-honey-400 border border-honey-500/30 rounded-full hover:bg-honey-500 hover:text-bark-900 transition-all duration-200"
            >
              로그인
            </Link>
            <Link
              href="/contact"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-bark-900 bg-honey-400 rounded-full hover:bg-honey-300 transition-colors"
            >
              시작하기
            </Link>
            <button
              className="lg:hidden text-white p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-400"
              aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="material-icons-outlined text-2xl transition-transform duration-200" aria-hidden="true">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <div
          id="mobile-menu"
          className={`lg:hidden overflow-y-auto transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-[calc(100dvh-3.5rem)] sm:max-h-[calc(100dvh-4rem)] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
          role="menu"
        >
          <div className="bg-bark-900/95 backdrop-blur-xl border-t border-bark-700/50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1 safe-bottom">
              {NAV_LINKS.map((link, idx) => (
                <Link
                  key={link.href}
                  href={link.href}
                  role="menuitem"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-base min-h-[44px] ${
                    isActive(link.href)
                      ? 'text-honey-400 font-semibold bg-honey-400/10'
                      : 'text-bark-300 hover:text-honey-400 hover:bg-bark-800/50'
                  }`}
                  style={{ transitionDelay: mobileMenuOpen ? `${idx * 50}ms` : '0ms' }}
                  onClick={closeMobileMenu}
                >
                  <span className="material-icons-outlined text-lg" aria-hidden="true">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
              {/* Mobile CTA */}
              <div className="border-t border-bark-700/50 mt-3 pt-4 px-4 flex flex-col gap-2">
                <Link
                  href="/contact"
                  className="w-full text-center px-4 py-3 text-sm font-semibold text-bark-900 bg-honey-400 rounded-full hover:bg-honey-300 transition-colors min-h-[44px] flex items-center justify-center"
                  onClick={closeMobileMenu}
                >
                  시작하기
                </Link>
                <Link
                  href="/contact"
                  className="w-full text-center px-4 py-3 text-sm font-semibold text-honey-400 border border-honey-500/30 rounded-full hover:bg-honey-500 hover:text-bark-900 transition-all min-h-[44px] flex items-center justify-center"
                  onClick={closeMobileMenu}
                >
                  로그인
                </Link>
              </div>
              {/* Mobile Contact Info */}
              <div className="border-t border-bark-700/50 mt-3 pt-4 px-4 space-y-2 text-xs text-bark-500">
                <a href={`tel:${COMPANY_PHONE}`} className="flex items-center gap-2 hover:text-honey-400 transition-colors">
                  <span className="material-icons-outlined text-sm text-honey-500">phone</span>
                  {COMPANY_PHONE}
                </a>
                <p className="flex items-center gap-2">
                  <span className="material-icons-outlined text-sm text-honey-500">schedule</span>
                  {COMPANY_HOURS}
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
