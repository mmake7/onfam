'use client';

import Link from 'next/link';
import { useScrollAnimation, useCountUp } from '@/lib/useScrollAnimation';
import {
  COMPANY_ADDRESS,
  COMPANY_PHONE,
  COMPANY_EMAIL,
  COMPANY_HOURS,
} from '@/lib/constants';

/* ─────────────────────── Animated Section Wrapper ─────────────────────── */
function AnimatedSection({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  animation?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'none'
          : animation === 'fade-up'
            ? 'translateY(40px)'
            : animation === 'slide-left'
              ? 'translateX(60px)'
              : animation === 'slide-right'
                ? 'translateX(-60px)'
                : animation === 'scale-in'
                  ? 'scale(0.92)'
                  : 'translateY(40px)',
        transition: `opacity 0.7s ease-out ${delay}s, transform 0.7s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────── Stat Counter ─────────────────────── */
function StatCounter({
  target,
  suffix = '',
  label,
  icon,
}: {
  target: number;
  suffix?: string;
  label: string;
  icon: string;
}) {
  const { ref, isVisible } = useScrollAnimation();
  const count = useCountUp(target, isVisible);
  return (
    <div ref={ref} className="text-center">
      <div className="w-14 h-14 rounded-2xl bg-honey-500/15 flex items-center justify-center mx-auto mb-4">
        <span className="material-icons-outlined text-honey-400 text-2xl">{icon}</span>
      </div>
      <p className="text-3xl sm:text-4xl font-black text-honey-400">
        {count}
        {suffix}
      </p>
      <p className="text-xs sm:text-sm text-bark-400 mt-2">{label}</p>
    </div>
  );
}

/* ═══════════════════════════ ABOUT PAGE ═══════════════════════════ */
export default function AboutPage() {
  return (
    <>
      {/* ────────────── 1. HERO SECTION ────────────── */}
      <section className="bg-bark-900 text-white py-24 lg:py-36 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-[30rem] h-[30rem] bg-honey-500/5 rounded-full blur-3xl animate-pulse-glow" />
          <div
            className="absolute bottom-10 left-10 w-[25rem] h-[25rem] bg-farm-500/5 rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDelay: '1.5s' }}
          />
        </div>

        {/* Honeycomb Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="honeycomb-about"
                x="0"
                y="0"
                width="56"
                height="100"
                patternUnits="userSpaceOnUse"
                patternTransform="scale(2)"
              >
                <path
                  d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100"
                  fill="none"
                  stroke="#FFC72C"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#honeycomb-about)" />
          </svg>
        </div>

        {/* Particle dots */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[20%] left-[15%] w-1 h-1 bg-honey-400/60 rounded-full animate-float" />
          <div className="absolute top-[40%] left-[80%] w-1.5 h-1.5 bg-honey-300/40 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-[70%] left-[25%] w-1 h-1 bg-farm-400/50 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative text-center">
          <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-honey-500/30 text-honey-400 text-xs font-semibold tracking-wider uppercase mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-honey-400 animate-pulse" />
            About BeeOnFarm
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight animate-fade-up">
            비온팜 <span className="text-transparent bg-clip-text bg-gradient-to-r from-honey-300 via-honey-400 to-farm-400">소개</span>
          </h1>
          <p
            className="mt-6 text-bark-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            농업회사법인 ㈜온팜의 비전, 연혁, 파트너십을 소개합니다.
            <br className="hidden sm:block" />
            기술로 연결하는 지속가능한 양봉, 비온팜이 함께합니다.
          </p>

          {/* Scroll Indicator */}
          <div className="mt-16 flex flex-col items-center gap-2 text-bark-500 animate-bounce">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <span className="material-icons-outlined text-lg">keyboard_arrow_down</span>
          </div>
        </div>
      </section>

      {/* ────────────── 2. VISION & MISSION ────────────── */}
      <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-honey-50 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-bee-50 rounded-full translate-x-1/3 translate-y-1/3" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <AnimatedSection className="flex-1" animation="slide-right">
              <div className="relative">
                <img
                  src="https://placehold.co/640x480/1C1917/FFC72C?text=BeeOnFarm+Vision&font=raleway"
                  alt="비온팜 비전"
                  className="w-full rounded-3xl shadow-2xl object-cover aspect-[4/3]"
                />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-honey-100 rounded-2xl -z-10" />
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-bee-100 rounded-2xl -z-10" />

                {/* Floating badge */}
                <div className="absolute -bottom-4 left-8 bg-white rounded-2xl shadow-xl px-6 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-honey-100 flex items-center justify-center">
                    <span className="material-icons-outlined text-honey-600 text-xl">eco</span>
                  </div>
                  <div>
                    <p className="text-xs text-bark-400">Since</p>
                    <p className="text-lg font-black text-bark-900">2023</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection className="flex-1" animation="slide-left">
              <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Our Vision</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
                기술로 연결하는 <span className="text-honey-600">지속가능한 양봉</span>
              </h2>
              <p className="mt-6 text-bark-500 leading-relaxed">
                비온팜(BeeOnFarm)은 농업회사법인 ㈜온팜이 개발한 디지털 양봉 플랫폼입니다. IoT 센서,
                인공지능 분석, 모바일 원격제어 기술을 결합하여 양봉 농가의 생산성을 높이고, 소비자에게는
                투명한 꿀 생산 이력을 제공합니다.
              </p>
              <p className="mt-4 text-bark-500 leading-relaxed">
                우리는 꿀벌이 건강한 생태계의 핵심이라고 믿습니다. 첨단 기술을 통해 양봉 농가를 지원하고,
                꿀벌의 건강을 지키며, 소비자에게 안전하고 투명한 꿀을 제공하는 것이 비온팜의 사명입니다.
              </p>

              {/* Mission Cards */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: 'visibility', title: '비전', desc: '디지털 양봉으로 지속가능한 농업의 미래를 선도합니다' },
                  { icon: 'flag', title: '미션', desc: '기술과 자연의 조화로 모두가 행복한 양봉 생태계를 만듭니다' },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-bark-50 rounded-2xl p-5 border border-bark-100"
                  >
                    <div className="w-10 h-10 rounded-xl bg-honey-100 flex items-center justify-center mb-3">
                      <span className="material-icons-outlined text-honey-600 text-xl">{item.icon}</span>
                    </div>
                    <h4 className="font-bold text-bark-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-bark-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ────────────── 3. CORE VALUES ────────────── */}
      <section className="py-24 lg:py-32 bg-bark-50 relative overflow-hidden">
        <div className="absolute top-20 right-0 w-72 h-72 bg-honey-50 rounded-full translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Core Values</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
              비온팜의 <span className="text-honey-600">핵심 가치</span>
            </h2>
            <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
              비온팜은 4가지 핵심 가치를 바탕으로 디지털 양봉 생태계를 만들어갑니다.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: 'biotech',
                color: 'honey',
                title: '기술 혁신',
                desc: 'IoT, AI, 빅데이터 등 최첨단 기술을 양봉 산업에 적용하여 스마트 농업을 선도합니다.',
              },
              {
                icon: 'nature',
                color: 'bee',
                title: '생태 보존',
                desc: '꿀벌 건강 모니터링과 생태계 보전 활동으로 지속가능한 환경을 지킵니다.',
              },
              {
                icon: 'handshake',
                color: 'farm',
                title: '상생 협력',
                desc: '양봉 농가, 연구기관, 지역사회와 함께 성장하며 상생의 가치를 실현합니다.',
              },
              {
                icon: 'diversity_3',
                color: 'honey',
                title: '사회적 가치',
                desc: '치유양봉, 교육 프로그램 등을 통해 소외 계층과 함께하는 사회적 가치를 창출합니다.',
              },
            ].map((item, idx) => (
              <AnimatedSection key={item.title} delay={idx * 0.1}>
                <div className="group bg-white rounded-2xl p-8 border border-bark-100 hover:border-honey-200 hover:shadow-xl hover:shadow-honey-500/5 transition-all duration-300 h-full text-center">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 ${
                      item.color === 'honey'
                        ? 'bg-honey-50 text-honey-600'
                        : item.color === 'bee'
                          ? 'bg-bee-50 text-bee-600'
                          : 'bg-farm-50 text-farm-600'
                    }`}
                  >
                    <span className="material-icons-outlined text-3xl">{item.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-bark-900 mb-3">{item.title}</h3>
                  <p className="text-sm text-bark-500 leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────── 4. STATS COUNTER BAND ────────────── */}
      <section className="py-16 lg:py-20 bg-bark-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="honeycomb-stats" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
                <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" fill="none" stroke="#FFC72C" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#honeycomb-stats)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <StatCounter target={500} suffix="+" label="등록 농가" icon="hive" />
            <StatCounter target={150} suffix="+" label="IoT 센서 설치" icon="sensors" />
            <StatCounter target={12} suffix="개" label="교육 과정" icon="school" />
            <StatCounter target={8} suffix="개" label="협력 기관" icon="handshake" />
          </div>
        </div>
      </section>

      {/* ────────────── 5. COMPANY TIMELINE ────────────── */}
      <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-honey-50 rounded-full -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">History</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900">
              회사 <span className="text-honey-600">연혁</span>
            </h2>
            <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
              비온팜의 창립부터 현재까지, 디지털 양봉 혁신의 발자취를 소개합니다.
            </p>
          </AnimatedSection>

          <div className="relative">
            {/* Center line (hidden on mobile) */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-bark-200 -translate-x-1/2" />

            <div className="space-y-8 lg:space-y-0">
              {[
                {
                  year: '2026',
                  title: '전국 확대 · 플랫폼 고도화',
                  items: [
                    { icon: 'hub', text: 'IoT 센서 3.0 전국 500개 농가 배포' },
                    { icon: 'smart_toy', text: 'AI 예측 모델 v2.0 — 정확도 95% 달성' },
                    { icon: 'map', text: '밀원지도 전국 서비스 오픈' },
                    { icon: 'favorite', text: '치유양봉 프로그램 10개 지역 확대' },
                  ],
                  color: 'honey',
                  side: 'left',
                },
                {
                  year: '2025',
                  title: '성장과 혁신',
                  items: [
                    { icon: 'spa', text: '치유양봉 프로그램 8개 지역 운영' },
                    { icon: 'phone_iphone', text: '모바일 앱 v4.0 출시' },
                    { icon: 'groups', text: '등록 농가 500개 돌파' },
                    { icon: 'school', text: '양봉 교육센터 정식 개소' },
                  ],
                  color: 'bee',
                  side: 'right',
                },
                {
                  year: '2024',
                  title: '플랫폼 출시 · 협력 확대',
                  items: [
                    { icon: 'rocket_launch', text: '비온팜 플랫폼 정식 출시' },
                    { icon: 'handshake', text: '퓨르메재단 협약 체결' },
                    { icon: 'sensors', text: 'IoT 센서 2.0 개발 완료' },
                    { icon: 'analytics', text: 'AI 기반 꿀 수확 예측 서비스 시작' },
                  ],
                  color: 'farm',
                  side: 'left',
                },
                {
                  year: '2023',
                  title: '창립과 시작',
                  items: [
                    { icon: 'apartment', text: '농업회사법인 ㈜온팜 설립' },
                    { icon: 'science', text: '디지털 양봉 시스템 R&D 착수' },
                    { icon: 'sensors', text: 'IoT 센서 1.0 프로토타입 개발' },
                  ],
                  color: 'honey',
                  side: 'right',
                },
              ].map((timeline, tIdx) => (
                <AnimatedSection
                  key={timeline.year}
                  className={`relative lg:flex lg:items-start lg:gap-8 ${
                    timeline.side === 'left' ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } lg:mb-16`}
                  delay={tIdx * 0.15}
                >
                  {/* Content Card */}
                  <div className={`flex-1 ${timeline.side === 'left' ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div
                      className={`bg-bark-50 rounded-2xl p-6 lg:p-8 border border-bark-100 hover:shadow-lg transition-shadow`}
                    >
                      <span
                        className={`inline-block text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-3 ${
                          timeline.color === 'honey'
                            ? 'bg-honey-100 text-honey-700'
                            : timeline.color === 'bee'
                              ? 'bg-bee-100 text-bee-700'
                              : 'bg-farm-100 text-farm-700'
                        }`}
                      >
                        {timeline.year}
                      </span>
                      <h3 className="text-lg font-bold text-bark-900 mb-4">{timeline.title}</h3>
                      <ul className={`space-y-3 ${timeline.side === 'left' ? 'lg:flex lg:flex-col lg:items-end' : ''}`}>
                        {timeline.items.map((item) => (
                          <li
                            key={item.text}
                            className={`flex items-center gap-3 text-sm text-bark-600 ${
                              timeline.side === 'left' ? 'lg:flex-row-reverse lg:text-right' : ''
                            }`}
                          >
                            <span
                              className={`material-icons-outlined text-lg shrink-0 ${
                                timeline.color === 'honey'
                                  ? 'text-honey-500'
                                  : timeline.color === 'bee'
                                    ? 'text-bee-500'
                                    : 'text-farm-500'
                              }`}
                            >
                              {item.icon}
                            </span>
                            {item.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Center Node (desktop) */}
                  <div className="hidden lg:flex flex-col items-center shrink-0">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-sm shadow-lg z-10 ${
                        timeline.color === 'honey'
                          ? 'bg-gradient-to-br from-honey-400 to-honey-600'
                          : timeline.color === 'bee'
                            ? 'bg-gradient-to-br from-bee-400 to-bee-600'
                            : 'bg-gradient-to-br from-farm-400 to-farm-600'
                      }`}
                    >
                      &apos;{timeline.year.slice(2)}
                    </div>
                  </div>

                  {/* Mobile year badge */}
                  <div className="lg:hidden flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0 ${
                        timeline.color === 'honey'
                          ? 'bg-gradient-to-br from-honey-400 to-honey-600'
                          : timeline.color === 'bee'
                            ? 'bg-gradient-to-br from-bee-400 to-bee-600'
                            : 'bg-gradient-to-br from-farm-400 to-farm-600'
                      }`}
                    >
                      &apos;{timeline.year.slice(2)}
                    </div>
                    <div className="w-0.5 flex-1 bg-bark-200" />
                  </div>

                  {/* Spacer for the other side */}
                  <div className="hidden lg:block flex-1" />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── 6. LEADERSHIP / TEAM ────────────── */}
      <section className="py-24 lg:py-32 bg-bark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Our Team</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900">
              비온팜을 이끄는 <span className="text-honey-600">사람들</span>
            </h2>
            <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
              기술, 농업, 사회공헌 분야의 전문가들이 비온팜의 비전을 함께 만들어갑니다.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: '김온팜',
                role: '대표이사 / CEO',
                desc: '15년 IT 경력, 스마트팜 전문가',
                icon: 'person',
                color: 'honey',
              },
              {
                name: '이기술',
                role: 'CTO / 기술총괄',
                desc: 'IoT·AI 시스템 아키텍트',
                icon: 'engineering',
                color: 'bee',
              },
              {
                name: '박양봉',
                role: '양봉사업부장',
                desc: '30년 양봉 경력, 한국양봉협회 자문위원',
                icon: 'hive',
                color: 'farm',
              },
              {
                name: '정치유',
                role: '사회공헌부장',
                desc: '복지·치유 프로그램 기획 전문가',
                icon: 'volunteer_activism',
                color: 'honey',
              },
            ].map((member, idx) => (
              <AnimatedSection key={member.name} delay={idx * 0.1} animation="scale-in">
                <div className="group bg-white rounded-2xl p-8 border border-bark-100 hover:border-honey-200 hover:shadow-xl transition-all duration-300 text-center h-full">
                  {/* Avatar */}
                  <div
                    className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-105 transition-transform ${
                      member.color === 'honey'
                        ? 'bg-gradient-to-br from-honey-100 to-honey-200'
                        : member.color === 'bee'
                          ? 'bg-gradient-to-br from-bee-100 to-bee-200'
                          : 'bg-gradient-to-br from-farm-100 to-farm-200'
                    }`}
                  >
                    <span
                      className={`material-icons-outlined text-4xl ${
                        member.color === 'honey'
                          ? 'text-honey-600'
                          : member.color === 'bee'
                            ? 'text-bee-600'
                            : 'text-farm-600'
                      }`}
                    >
                      {member.icon}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-bark-900">{member.name}</h3>
                  <p
                    className={`text-xs font-semibold mt-1 ${
                      member.color === 'honey'
                        ? 'text-honey-600'
                        : member.color === 'bee'
                          ? 'text-bee-600'
                          : 'text-farm-600'
                    }`}
                  >
                    {member.role}
                  </p>
                  <p className="text-sm text-bark-500 mt-3">{member.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────── 7. PARTNERS ────────────── */}
      <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-honey-50 rounded-full translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Partners</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900">
              함께하는 <span className="text-honey-600">파트너</span>
            </h2>
            <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
              비온팜은 다양한 기관 및 단체와 협력하여 양봉 산업의 발전에 기여하고 있습니다.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: '퓨르메재단', icon: 'favorite', desc: '치유양봉 프로그램 공동 운영', color: 'honey' },
              { name: '농림축산식품부', icon: 'account_balance', desc: '스마트팜 정책 지원 · 인증', color: 'bee' },
              { name: '한국양봉협회', icon: 'groups', desc: '양봉 기술 표준화 · 교육 협력', color: 'farm' },
              { name: '전북테크노파크', icon: 'precision_manufacturing', desc: 'IoT 센서 R&D 공동 연구', color: 'honey' },
              { name: '국립농업과학원', icon: 'science', desc: '꿀벌 건강 연구 · 데이터 공유', color: 'bee' },
              { name: '전북대학교', icon: 'school', desc: 'AI·빅데이터 산학 협력', color: 'farm' },
              { name: '완주군', icon: 'location_city', desc: '지역 양봉 산업 육성 협력', color: 'honey' },
              { name: '사회적기업진흥원', icon: 'diversity_3', desc: '사회적 가치 창출 지원', color: 'bee' },
            ].map((partner, idx) => (
              <AnimatedSection key={partner.name} delay={idx * 0.08} animation="scale-in">
                <div className="group bg-bark-50 rounded-2xl p-6 lg:p-8 border border-bark-200 hover:border-honey-300 hover:shadow-lg transition-all duration-300 h-full text-center">
                  <div
                    className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform ${
                      partner.color === 'honey'
                        ? 'bg-honey-100 text-honey-600'
                        : partner.color === 'bee'
                          ? 'bg-bee-100 text-bee-600'
                          : 'bg-farm-100 text-farm-600'
                    }`}
                  >
                    <span className="material-icons-outlined text-2xl">{partner.icon}</span>
                  </div>
                  <h3 className="text-sm font-bold text-bark-900">{partner.name}</h3>
                  <p className="text-xs text-bark-500 mt-2 leading-relaxed">{partner.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────── 8. LOCATION / MAP ────────────── */}
      <section className="py-24 lg:py-32 bg-bark-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-honey-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-farm-500/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-400 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Location</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              찾아오시는 <span className="text-honey-400">길</span>
            </h2>
            <p className="mt-4 text-bark-400 max-w-2xl mx-auto">
              비온팜 본사 및 양봉 교육센터 위치를 안내합니다.
            </p>
          </AnimatedSection>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Map embed */}
            <AnimatedSection className="flex-[2]" animation="slide-right">
              <div className="rounded-2xl overflow-hidden border border-bark-700 shadow-2xl bg-bark-800 aspect-video lg:aspect-auto lg:h-[480px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3218.1!2d127.13!3d35.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z7KCE67aB7JmE7KO867SJ64-Z7J2N7JmE7KO87IKw64uw6rCAMjI0!5e0!3m2!1sko!2skr!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '300px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="비온팜 본사 위치"
                  className="w-full h-full"
                />
              </div>
            </AnimatedSection>

            {/* Contact Info Cards */}
            <AnimatedSection className="flex-1" animation="slide-left">
              <div className="space-y-4 h-full flex flex-col justify-center">
                {[
                  {
                    icon: 'location_on',
                    title: '주소',
                    value: COMPANY_ADDRESS,
                    detail: '(완주산업단지 내)',
                  },
                  {
                    icon: 'phone',
                    title: '전화',
                    value: COMPANY_PHONE,
                    detail: COMPANY_HOURS,
                  },
                  {
                    icon: 'mail',
                    title: '이메일',
                    value: COMPANY_EMAIL,
                    detail: '문의사항은 이메일로 보내주세요',
                  },
                  {
                    icon: 'directions_bus',
                    title: '교통편',
                    value: '봉동IC에서 10분',
                    detail: '주차장 완비 (30대 수용)',
                  },
                ].map((info) => (
                  <div
                    key={info.title}
                    className="group flex items-start gap-4 bg-bark-800 rounded-2xl p-5 border border-bark-700 hover:border-honey-500/30 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-honey-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <span className="material-icons-outlined text-honey-400 text-xl">{info.icon}</span>
                    </div>
                    <div>
                      <p className="text-xs text-bark-500 font-semibold uppercase tracking-wider">{info.title}</p>
                      <p className="text-white font-bold text-sm mt-1">{info.value}</p>
                      <p className="text-bark-400 text-xs mt-1">{info.detail}</p>
                    </div>
                  </div>
                ))}

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 mt-4 px-6 py-3 text-sm font-bold text-bark-900 bg-honey-400 rounded-full hover:bg-honey-300 transition-colors w-full"
                >
                  문의하기
                  <span className="material-icons-outlined text-lg">arrow_forward</span>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ────────────── 9. CTA BANNER ────────────── */}
      <section className="py-24 lg:py-32 bg-gradient-to-r from-honey-400 via-honey-500 to-farm-400 text-bark-900 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-bark-900/10 rotate-12 rounded-2xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 border-2 border-bark-900/10 -rotate-12 rounded-2xl" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-20 h-20 border-2 border-bark-900/5 rotate-45 rounded-xl hidden lg:block" />

        <AnimatedSection className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative" animation="scale-in">
          <span className="material-icons-outlined text-6xl text-bark-900/20 mb-6 block">hive</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
            비온팜과 함께
            <br />
            디지털 양봉의 미래를 시작하세요
          </h2>
          <p className="mt-6 text-bark-800/70 text-lg max-w-2xl mx-auto leading-relaxed">
            500개 이상의 양봉 농가가 이미 비온팜으로 스마트 양봉을 실현하고 있습니다. 무료 체험으로
            시작해보세요.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-honey-500 bg-bark-900 rounded-full hover:bg-bark-800 transition-colors text-center shadow-lg"
            >
              무료 체험 시작하기
            </Link>
            <Link
              href="/solutions"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-bark-900 border-2 border-bark-900/30 rounded-full hover:bg-bark-900/10 transition-colors text-center"
            >
              솔루션 둘러보기
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}
