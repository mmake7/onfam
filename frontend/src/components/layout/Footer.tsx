'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { COMPANY_PHONE, COMPANY_EMAIL } from '@/lib/constants';
import { useTranslation } from '@/context/LanguageContext';

const SERVICE_HREFS = ['/about', '/solutions', '/solutions#nectar', '/program', '/program'];
const SUPPORT_HREFS = ['/community?tab=notice', '/community?tab=qna', '/community?tab=news', '/contact', '/terms'];
const SOCIAL_ICONS = ['mail', 'phone', 'chat'];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { t } = useTranslation();

  const serviceLabels = [
    t.footer.serviceLinks.about,
    t.footer.serviceLinks.features,
    t.footer.serviceLinks.nectarMap,
    t.footer.serviceLinks.healingBeekeeping,
    t.footer.serviceLinks.educationProgram,
  ];

  const supportLabels = [
    t.footer.supportLinks.notice,
    t.footer.supportLinks.qna,
    t.footer.supportLinks.news,
    t.footer.supportLinks.adoptionInquiry,
    t.footer.supportLinks.terms,
  ];

  const socialLinks = [
    { href: `mailto:${COMPANY_EMAIL}`, icon: 'mail', label: t.footer.socialLinks.email },
    { href: `tel:${COMPANY_PHONE}`, icon: 'phone', label: t.footer.socialLinks.phone },
    { href: '#', icon: 'chat', label: t.footer.socialLinks.kakao },
  ];

  const handleScroll = useCallback(() => {
    setShowBackToTop(window.scrollY > 400);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-bark-900 text-bark-400">
      {/* Newsletter / CTA Strip */}
      <div className="border-b border-bark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-white font-bold text-lg">{t.footer.newsletter.title}</h3>
              <p className="text-sm mt-1">{t.footer.newsletter.description}</p>
            </div>
            <form
              className="flex flex-col sm:flex-row w-full md:w-auto gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder={t.footer.newsletter.placeholder}
                aria-label={t.footer.newsletter.ariaLabel}
                className="flex-1 md:w-72 px-4 py-3 bg-bark-800 border border-bark-700 rounded-full text-sm text-white placeholder-bark-500 focus:outline-none focus:border-honey-500 focus:ring-1 focus:ring-honey-500 transition-colors min-w-0"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-honey-400 text-bark-900 text-sm font-bold rounded-full hover:bg-honey-300 transition-colors shrink-0"
              >
                {t.footer.newsletter.subscribe}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-icons-outlined text-honey-400 text-2xl" aria-hidden="true">hexagon</span>
              <span className="text-white font-bold text-lg">
                BeeOn<span className="text-honey-400">Farm</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              {t.common.companyName}
              <br />
              {t.footer.brand.description}
            </p>
            <div className="flex items-center gap-3 mt-5">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-bark-800 flex items-center justify-center hover:bg-honey-500 hover:text-bark-900 transition-all duration-200"
                >
                  <span className="material-icons-outlined text-sm" aria-hidden="true">{s.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Service Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">{t.footer.sections.service}</h4>
            <ul className="space-y-2.5 text-sm">
              {serviceLabels.map((label, i) => (
                <li key={label}>
                  <Link
                    href={SERVICE_HREFS[i]}
                    className="hover:text-honey-400 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span className="material-icons-outlined text-xs text-bark-600" aria-hidden="true">chevron_right</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">{t.footer.sections.support}</h4>
            <ul className="space-y-2.5 text-sm">
              {supportLabels.map((label, i) => (
                <li key={label}>
                  <Link
                    href={SUPPORT_HREFS[i]}
                    className="hover:text-honey-400 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span className="material-icons-outlined text-xs text-bark-600" aria-hidden="true">chevron_right</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">{t.footer.sections.contact}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <span className="material-icons-outlined text-base text-honey-500 mt-0.5 shrink-0" aria-hidden="true">location_on</span>
                <span>{t.common.companyAddress}</span>
              </li>
              <li>
                <a href={`tel:${COMPANY_PHONE}`} className="flex items-center gap-2.5 hover:text-honey-400 transition-colors">
                  <span className="material-icons-outlined text-base text-honey-500 shrink-0" aria-hidden="true">phone</span>
                  {COMPANY_PHONE}
                </a>
              </li>
              <li>
                <a href={`mailto:${COMPANY_EMAIL}`} className="flex items-center gap-2.5 hover:text-honey-400 transition-colors">
                  <span className="material-icons-outlined text-base text-honey-500 shrink-0" aria-hidden="true">mail</span>
                  {COMPANY_EMAIL}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-icons-outlined text-base text-honey-500 shrink-0" aria-hidden="true">schedule</span>
                {t.common.companyHours}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-bark-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {currentYear} {t.common.companyName}. {t.common.allRightsReserved}</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-honey-400 transition-colors">{t.footer.legal.privacy}</Link>
            <span className="w-px h-3 bg-bark-700" />
            <Link href="/terms" className="hover:text-honey-400 transition-colors">{t.footer.legal.terms}</Link>
            <span className="w-px h-3 bg-bark-700" />
            <Link href="/sitemap" className="hover:text-honey-400 transition-colors">{t.footer.legal.sitemap}</Link>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <BackToTop onClick={scrollToTop} visible={showBackToTop} label={t.common.backToTop} />
    </footer>
  );
}

function BackToTop({ onClick, visible, label }: { onClick: () => void; visible: boolean; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`fixed bottom-6 right-6 z-40 w-12 h-12 sm:w-11 sm:h-11 rounded-full bg-honey-400 text-bark-900 shadow-lg shadow-honey-500/20 flex items-center justify-center hover:bg-honey-300 transition-all duration-300 hover:scale-110 safe-bottom ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <span className="material-icons-outlined text-xl" aria-hidden="true">keyboard_arrow_up</span>
    </button>
  );
}
