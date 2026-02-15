'use client';

import Link from 'next/link';
import {
  COMPANY_NAME,
  COMPANY_ADDRESS,
  COMPANY_PHONE,
  COMPANY_EMAIL,
  COMPANY_HOURS,
  FOOTER_SERVICE_LINKS,
  FOOTER_SUPPORT_LINKS,
  SOCIAL_LINKS,
} from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
              <h3 className="text-white font-bold text-lg">비온팜 소식 받기</h3>
              <p className="text-sm mt-1">최신 양봉 기술과 교육 프로그램 소식을 이메일로 받아보세요.</p>
            </div>
            <form
              className="flex w-full md:w-auto gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="이메일 주소 입력"
                aria-label="뉴스레터 이메일"
                className="flex-1 md:w-72 px-4 py-3 bg-bark-800 border border-bark-700 rounded-full text-sm text-white placeholder-bark-500 focus:outline-none focus:border-honey-500 focus:ring-1 focus:ring-honey-500 transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-honey-400 text-bark-900 text-sm font-bold rounded-full hover:bg-honey-300 transition-colors shrink-0"
              >
                구독하기
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
              {COMPANY_NAME}
              <br />
              생산자와 소비자를 위한 디지털 양봉 시스템
            </p>
            <div className="flex items-center gap-3 mt-5">
              {SOCIAL_LINKS.map((s) => (
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
            <h4 className="text-white font-bold text-sm mb-4">서비스</h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_SERVICE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-honey-400 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span className="material-icons-outlined text-xs text-bark-600" aria-hidden="true">chevron_right</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">고객지원</h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-honey-400 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span className="material-icons-outlined text-xs text-bark-600" aria-hidden="true">chevron_right</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">연락처</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <span className="material-icons-outlined text-base text-honey-500 mt-0.5 shrink-0" aria-hidden="true">location_on</span>
                <span>{COMPANY_ADDRESS}</span>
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
                {COMPANY_HOURS}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-bark-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {currentYear} {COMPANY_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-honey-400 transition-colors">개인정보처리방침</Link>
            <span className="w-px h-3 bg-bark-700" />
            <Link href="#" className="hover:text-honey-400 transition-colors">이용약관</Link>
            <span className="w-px h-3 bg-bark-700" />
            <Link href="#" className="hover:text-honey-400 transition-colors">사이트맵</Link>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <BackToTop onClick={scrollToTop} />
    </footer>
  );
}

function BackToTop({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="맨 위로 스크롤"
      className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-honey-400 text-bark-900 shadow-lg shadow-honey-500/20 flex items-center justify-center hover:bg-honey-300 transition-all duration-200 hover:scale-110"
    >
      <span className="material-icons-outlined text-xl" aria-hidden="true">keyboard_arrow_up</span>
    </button>
  );
}
