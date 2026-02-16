'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { COMPANY_PHONE, COMPANY_EMAIL } from '@/lib/constants';
import { useTranslation } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const NAV_ICONS: Record<string, string> = {
  home: 'home',
  about: 'info',
  program: 'school',
  solutions: 'hub',
  community: 'forum',
  contact: 'mail',
};

const NAV_HREFS: Record<string, string> = {
  home: '/',
  about: '/about',
  program: '/program',
  solutions: '/solutions',
  community: '/community',
  contact: '/contact',
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [topBarVisible, setTopBarVisible] = useState(true);
  const pathname = usePathname();
  const { t } = useTranslation();

  const navKeys = ['home', 'about', 'program', 'solutions', 'community', 'contact'] as const;

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

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Skip navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-honey-400 focus:text-bark-900 focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:text-sm"
      >
        {t.common.skipToContent}
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
              {t.common.companyHours}
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
              <span className="sm:hidden">{t.common.email}</span>
            </a>
            <span className="w-px h-3 bg-bark-700" />
            <LanguageSwitcher compact />
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
        aria-label={t.nav.mainNavigation}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label={t.nav.homeAriaLabel}>
            <span className="material-icons-outlined text-honey-400 text-3xl" aria-hidden="true">hexagon</span>
            <span className="text-white font-bold text-lg tracking-tight">
              BeeOn<span className="text-honey-400">Farm</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 text-sm" role="menubar">
            {navKeys.map((key) => {
              const href = NAV_HREFS[key];
              const label = t.nav[key as keyof typeof t.nav];
              return (
                <Link
                  key={href}
                  href={href}
                  role="menuitem"
                  className={`relative px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(href)
                      ? 'text-honey-400 font-semibold bg-honey-400/10'
                      : 'text-bark-300 hover:text-white hover:bg-bark-800/50'
                  }`}
                >
                  {label}
                  {isActive(href) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-honey-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side — Language Toggle + CTA + Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Toggle — always visible in main nav */}
            <LanguageSwitcher compact className="hidden sm:inline-flex" />
            <Link
              href="/contact"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-honey-400 border border-honey-500/30 rounded-full hover:bg-honey-500 hover:text-bark-900 transition-all duration-200"
            >
              {t.common.login}
            </Link>
            <Link
              href="/contact"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-bark-900 bg-honey-400 rounded-full hover:bg-honey-300 transition-colors"
            >
              {t.common.startNow}
            </Link>
            <button
              className="lg:hidden text-white p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-400"
              aria-label={mobileMenuOpen ? t.nav.menuClose : t.nav.menuOpen}
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
              {navKeys.map((key, idx) => {
                const href = NAV_HREFS[key];
                const label = t.nav[key as keyof typeof t.nav];
                const icon = NAV_ICONS[key];
                return (
                  <Link
                    key={href}
                    href={href}
                    role="menuitem"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-base min-h-[44px] ${
                      isActive(href)
                        ? 'text-honey-400 font-semibold bg-honey-400/10'
                        : 'text-bark-300 hover:text-honey-400 hover:bg-bark-800/50'
                    }`}
                    style={{ transitionDelay: mobileMenuOpen ? `${idx * 50}ms` : '0ms' }}
                    onClick={closeMobileMenu}
                  >
                    <span className="material-icons-outlined text-lg" aria-hidden="true">{icon}</span>
                    {label}
                  </Link>
                );
              })}
              {/* Mobile Language Switcher */}
              <div className="border-t border-bark-700/50 mt-2 pt-3 px-4">
                <LanguageSwitcher />
              </div>
              {/* Mobile CTA */}
              <div className="border-t border-bark-700/50 mt-3 pt-4 px-4 flex flex-col gap-2">
                <Link
                  href="/contact"
                  className="w-full text-center px-4 py-3 text-sm font-semibold text-bark-900 bg-honey-400 rounded-full hover:bg-honey-300 transition-colors min-h-[44px] flex items-center justify-center"
                  onClick={closeMobileMenu}
                >
                  {t.common.startNow}
                </Link>
                <Link
                  href="/contact"
                  className="w-full text-center px-4 py-3 text-sm font-semibold text-honey-400 border border-honey-500/30 rounded-full hover:bg-honey-500 hover:text-bark-900 transition-all min-h-[44px] flex items-center justify-center"
                  onClick={closeMobileMenu}
                >
                  {t.common.login}
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
                  {t.common.companyHours}
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
