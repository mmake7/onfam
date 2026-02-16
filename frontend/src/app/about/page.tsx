'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
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

/* ─────────────────────── Bee SVG Illustration ─────────────────────── */
function BeeIllustration({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sky gradient background */}
      <defs>
        <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF9E0" />
          <stop offset="100%" stopColor="#F0FDF4" />
        </linearGradient>
        <linearGradient id="hill-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>
        <linearGradient id="hive-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD55A" />
          <stop offset="100%" stopColor="#E5A800" />
        </linearGradient>
      </defs>
      <rect width="640" height="480" fill="url(#sky-grad)" rx="24" />

      {/* Sun */}
      <circle cx="520" cy="80" r="50" fill="#FFC72C" opacity="0.3" />
      <circle cx="520" cy="80" r="35" fill="#FFC72C" opacity="0.5" />
      <circle cx="520" cy="80" r="20" fill="#FFD55A" />

      {/* Clouds */}
      <g opacity="0.4">
        <ellipse cx="150" cy="60" rx="50" ry="20" fill="white" />
        <ellipse cx="130" cy="55" rx="30" ry="15" fill="white" />
        <ellipse cx="170" cy="55" rx="35" ry="18" fill="white" />
      </g>
      <g opacity="0.3">
        <ellipse cx="400" cy="100" rx="40" ry="16" fill="white" />
        <ellipse cx="385" cy="96" rx="25" ry="12" fill="white" />
      </g>

      {/* Hills */}
      <ellipse cx="320" cy="420" rx="400" ry="140" fill="url(#hill-grad)" opacity="0.6" />
      <ellipse cx="180" cy="440" rx="300" ry="120" fill="#4ADE80" opacity="0.5" />
      <ellipse cx="480" cy="450" rx="250" ry="100" fill="#22C55E" opacity="0.4" />

      {/* Ground */}
      <rect x="0" y="380" width="640" height="100" fill="#16A34A" opacity="0.3" rx="0" />

      {/* Beehive boxes */}
      {[120, 250, 380, 500].map((x, i) => (
        <g key={i}>
          <rect x={x} y={340 + i * 5} width="45" height="35" fill="url(#hive-grad)" rx="3" />
          <rect x={x - 3} y={336 + i * 5} width="51" height="8" fill="#B88600" rx="2" />
          <rect x={x + 15} y={350 + i * 5} width="15" height="8" fill="#8A6500" rx="4" />
        </g>
      ))}

      {/* Trees */}
      <g>
        <rect x="55" y="310" width="10" height="70" fill="#8A6500" rx="3" />
        <circle cx="60" cy="290" r="30" fill="#15803D" />
        <circle cx="45" cy="300" r="22" fill="#166534" />
        <circle cx="75" cy="300" r="22" fill="#166534" />
      </g>
      <g>
        <rect x="560" y="320" width="8" height="60" fill="#8A6500" rx="3" />
        <circle cx="564" cy="305" r="25" fill="#15803D" />
        <circle cx="550" cy="312" r="18" fill="#166534" />
        <circle cx="578" cy="312" r="18" fill="#166534" />
      </g>

      {/* Flowers */}
      {[90, 170, 310, 430, 530].map((x, i) => (
        <g key={i}>
          <line x1={x} y1={380} x2={x} y2={365 - i * 2} stroke="#15803D" strokeWidth="2" />
          <circle cx={x} cy={362 - i * 2} r={5} fill={i % 2 === 0 ? '#FFC72C' : '#FB923C'} />
          <circle cx={x} cy={362 - i * 2} r={2} fill={i % 2 === 0 ? '#E5A800' : '#EA580C'} />
        </g>
      ))}

      {/* Bees (animated with CSS) */}
      <g className="animate-float">
        {/* Bee 1 */}
        <ellipse cx="200" cy="180" rx="14" ry="10" fill="#FFC72C" />
        <ellipse cx="195" cy="180" rx="5" ry="8" fill="#1C1917" />
        <ellipse cx="208" cy="180" rx="4" ry="6" fill="#1C1917" />
        <ellipse cx="190" cy="172" rx="8" ry="5" fill="white" opacity="0.7" transform="rotate(-20, 190, 172)" />
        <ellipse cx="195" cy="170" rx="7" ry="4" fill="white" opacity="0.5" transform="rotate(10, 195, 170)" />
      </g>
      <g className="animate-float" style={{ animationDelay: '1s' }}>
        {/* Bee 2 */}
        <ellipse cx="420" cy="150" rx="12" ry="9" fill="#FFD55A" />
        <ellipse cx="415" cy="150" rx="4" ry="7" fill="#1C1917" />
        <ellipse cx="428" cy="150" rx="3" ry="5" fill="#1C1917" />
        <ellipse cx="412" cy="142" rx="7" ry="4" fill="white" opacity="0.7" transform="rotate(-15, 412, 142)" />
        <ellipse cx="416" cy="141" rx="6" ry="3.5" fill="white" opacity="0.5" transform="rotate(8, 416, 141)" />
      </g>
      <g className="animate-float" style={{ animationDelay: '2s' }}>
        {/* Bee 3 */}
        <ellipse cx="330" cy="220" rx="10" ry="7" fill="#FFC72C" />
        <ellipse cx="326" cy="220" rx="3.5" ry="6" fill="#1C1917" />
        <ellipse cx="337" cy="220" rx="3" ry="4.5" fill="#1C1917" />
        <ellipse cx="323" cy="214" rx="6" ry="3.5" fill="white" opacity="0.7" transform="rotate(-20, 323, 214)" />
      </g>

      {/* IoT sensor on beehive */}
      <g>
        <rect x="258" y="325" width="30" height="18" fill="#292524" rx="3" />
        <rect x="261" y="328" width="12" height="8" fill="#4ADE80" rx="1" />
        <circle cx="280" cy="332" r="2" fill="#FFC72C">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </circle>
        <line x1="273" y1="325" x2="273" y2="315" stroke="#44403C" strokeWidth="1.5" />
        <circle cx="273" cy="313" r="3" fill="#44403C" />
        {/* Signal waves */}
        <path d="M280 310 Q285 305 290 310" stroke="#4ADE80" strokeWidth="1" fill="none" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0;0.6" dur="1.5s" repeatCount="indefinite" />
        </path>
        <path d="M278 306 Q286 298 294 306" stroke="#4ADE80" strokeWidth="1" fill="none" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0;0.4" dur="1.5s" repeatCount="indefinite" begin="0.3s" />
        </path>
      </g>

      {/* Text overlay */}
      <text x="320" y="460" textAnchor="middle" fill="#166534" fontSize="12" fontWeight="bold" opacity="0.5">
        BeeOnFarm Smart Apiary
      </text>
    </svg>
  );
}

/* ─────────────────────── Section Navigation Dots ─────────────────────── */
function SectionNav() {
  const [activeSection, setActiveSection] = useState('');

  const sections = [
    { id: 'vision', label: '비전' },
    { id: 'values', label: '핵심가치' },
    { id: 'history', label: '연혁' },
    { id: 'team', label: '팀' },
    { id: 'partners', label: '파트너' },
    { id: 'location', label: '위치' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className="fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-3">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="group flex items-center gap-2"
        >
          <span
            className={`text-[10px] font-semibold tracking-wider uppercase transition-all duration-300 ${
              activeSection === s.id
                ? 'opacity-100 translate-x-0 text-honey-600'
                : 'opacity-0 translate-x-2 text-bark-500 group-hover:opacity-100 group-hover:translate-x-0'
            }`}
          >
            {s.label}
          </span>
          <span
            className={`block rounded-full transition-all duration-300 ${
              activeSection === s.id
                ? 'w-3 h-3 bg-honey-500 shadow-lg shadow-honey-500/30'
                : 'w-2 h-2 bg-bark-300 group-hover:bg-honey-400'
            }`}
          />
        </a>
      ))}
    </nav>
  );
}

/* ─────────────────────── Timeline Active Indicator ─────────────────────── */
function TimelineSection() {
  const [activeYear, setActiveYear] = useState<string | null>(null);

  const timelines = [
    {
      year: '2026',
      title: '전국 확대 · 플랫폼 고도화',
      subtitle: 'National Expansion',
      items: [
        { icon: 'hub', text: 'IoT 센서 3.0 전국 500개 농가 배포' },
        { icon: 'smart_toy', text: 'AI 예측 모델 v2.0 — 정확도 95% 달성' },
        { icon: 'map', text: '밀원지도 전국 서비스 오픈' },
        { icon: 'favorite', text: '치유양봉 프로그램 10개 지역 확대' },
      ],
      color: 'honey' as const,
      side: 'left' as const,
    },
    {
      year: '2025',
      title: '성장과 혁신',
      subtitle: 'Growth & Innovation',
      items: [
        { icon: 'spa', text: '치유양봉 프로그램 8개 지역 운영' },
        { icon: 'phone_iphone', text: '모바일 앱 v4.0 출시' },
        { icon: 'groups', text: '등록 농가 500개 돌파' },
        { icon: 'school', text: '양봉 교육센터 정식 개소' },
      ],
      color: 'bee' as const,
      side: 'right' as const,
    },
    {
      year: '2024',
      title: '플랫폼 출시 · 협력 확대',
      subtitle: 'Platform Launch',
      items: [
        { icon: 'rocket_launch', text: '비온팜 플랫폼 정식 출시' },
        { icon: 'handshake', text: '퓨르메재단 협약 체결' },
        { icon: 'sensors', text: 'IoT 센서 2.0 개발 완료' },
        { icon: 'analytics', text: 'AI 기반 꿀 수확 예측 서비스 시작' },
      ],
      color: 'farm' as const,
      side: 'left' as const,
    },
    {
      year: '2023',
      title: '창립과 시작',
      subtitle: 'Foundation',
      items: [
        { icon: 'apartment', text: '농업회사법인 ㈜온팜 설립' },
        { icon: 'science', text: '디지털 양봉 시스템 R&D 착수' },
        { icon: 'sensors', text: 'IoT 센서 1.0 프로토타입 개발' },
      ],
      color: 'honey' as const,
      side: 'right' as const,
    },
  ];

  const colorClasses = {
    honey: {
      badge: 'bg-honey-100 text-honey-700',
      gradient: 'bg-gradient-to-br from-honey-400 to-honey-600',
      icon: 'text-honey-500',
      ring: 'ring-honey-400/30',
      activeBg: 'bg-honey-50',
      activeBorder: 'border-honey-200',
      line: 'bg-honey-400',
    },
    bee: {
      badge: 'bg-bee-100 text-bee-700',
      gradient: 'bg-gradient-to-br from-bee-400 to-bee-600',
      icon: 'text-bee-500',
      ring: 'ring-bee-400/30',
      activeBg: 'bg-bee-50',
      activeBorder: 'border-bee-200',
      line: 'bg-bee-400',
    },
    farm: {
      badge: 'bg-farm-100 text-farm-700',
      gradient: 'bg-gradient-to-br from-farm-400 to-farm-600',
      icon: 'text-farm-500',
      ring: 'ring-farm-400/30',
      activeBg: 'bg-farm-50',
      activeBorder: 'border-farm-200',
      line: 'bg-farm-400',
    },
  };

  return (
    <div className="relative">
      {/* Center line (hidden on mobile) */}
      <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-honey-200 via-bee-200 to-farm-200 -translate-x-1/2" />

      {/* Mobile left line */}
      <div className="lg:hidden absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-honey-200 via-bee-200 to-farm-200" />

      {/* Year quick nav - desktop */}
      <div className="hidden lg:flex justify-center gap-3 mb-12">
        {timelines.map((t) => (
          <button
            key={t.year}
            onClick={() => setActiveYear(activeYear === t.year ? null : t.year)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              activeYear === t.year
                ? `${colorClasses[t.color].gradient} text-white shadow-lg`
                : 'bg-bark-100 text-bark-600 hover:bg-bark-200'
            }`}
          >
            {t.year}
          </button>
        ))}
      </div>

      <div className="space-y-8 lg:space-y-0">
        {timelines.map((timeline, tIdx) => {
          const cls = colorClasses[timeline.color];
          const isActive = activeYear === timeline.year;

          return (
            <AnimatedSection
              key={timeline.year}
              className={`relative lg:flex lg:items-start lg:gap-8 ${
                timeline.side === 'left' ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } lg:mb-16`}
              delay={tIdx * 0.15}
            >
              {/* Mobile node */}
              <div className="lg:hidden absolute left-6 top-0 -translate-x-1/2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg z-10 ${cls.gradient}`}
                >
                  &apos;{timeline.year.slice(2)}
                </div>
              </div>

              {/* Content Card */}
              <div className={`flex-1 ${timeline.side === 'left' ? 'lg:text-right' : 'lg:text-left'} pl-16 lg:pl-0`}>
                <div
                  className={`rounded-2xl p-6 lg:p-8 border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? `${cls.activeBg} ${cls.activeBorder} shadow-lg ring-2 ${cls.ring}`
                      : 'bg-bark-50 border-bark-100 hover:shadow-lg hover:border-bark-200'
                  }`}
                  onClick={() => setActiveYear(isActive ? null : timeline.year)}
                >
                  <div className={`flex items-center gap-3 mb-4 ${timeline.side === 'left' ? 'lg:justify-end' : ''}`}>
                    <span className={`inline-block text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full ${cls.badge}`}>
                      {timeline.year}
                    </span>
                    <span className="text-xs text-bark-400 font-medium">{timeline.subtitle}</span>
                  </div>
                  <h3 className="text-lg font-bold text-bark-900 mb-4">{timeline.title}</h3>
                  <ul className={`space-y-3 ${timeline.side === 'left' ? 'lg:flex lg:flex-col lg:items-end' : ''}`}>
                    {timeline.items.map((item, itemIdx) => (
                      <li
                        key={item.text}
                        className={`flex items-center gap-3 text-sm text-bark-600 ${
                          timeline.side === 'left' ? 'lg:flex-row-reverse lg:text-right' : ''
                        }`}
                        style={{
                          opacity: isActive ? 1 : undefined,
                          transform: isActive ? 'translateX(0)' : undefined,
                          transition: isActive ? `opacity 0.3s ease ${itemIdx * 0.1}s, transform 0.3s ease ${itemIdx * 0.1}s` : undefined,
                        }}
                      >
                        <span className={`material-icons-outlined text-lg shrink-0 ${cls.icon}`}>
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
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-sm shadow-lg z-10 transition-transform duration-300 ${
                    cls.gradient
                  } ${isActive ? 'scale-125 ring-4 ring-white' : ''}`}
                >
                  &apos;{timeline.year.slice(2)}
                </div>
              </div>

              {/* Spacer for the other side */}
              <div className="hidden lg:block flex-1" />
            </AnimatedSection>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────── Partners Tab Section ─────────────────────── */
function PartnersSection() {
  const [activeTab, setActiveTab] = useState<'gov' | 'edu'>('gov');

  const tabs = [
    { key: 'gov' as const, label: '정부 · 연구 기관', icon: 'account_balance' },
    { key: 'edu' as const, label: '교육 · 사회공헌', icon: 'school' },
  ];

  const partners = {
    gov: [
      { name: '농림축산식품부', icon: 'account_balance', desc: '스마트팜 정책 지원 및 인증 협력', detail: '양봉 산업 디지털 전환 국가 프로젝트 참여', color: 'bee' as const },
      { name: '국립농업과학원', icon: 'science', desc: '꿀벌 건강 연구 · 데이터 공유', detail: '공동 연구 프로젝트 3건 진행 중', color: 'bee' as const },
      { name: '전북테크노파크', icon: 'precision_manufacturing', desc: 'IoT 센서 R&D 공동 연구', detail: '차세대 센서 기술 개발 파트너', color: 'honey' as const },
      { name: '완주군', icon: 'location_city', desc: '지역 양봉 산업 육성 협력', detail: '스마트팜 시범단지 공동 운영', color: 'honey' as const },
    ],
    edu: [
      { name: '퓨르메재단', icon: 'favorite', desc: '치유양봉 프로그램 공동 운영', detail: '장애인·고령자 대상 치유 프로그램', color: 'farm' as const },
      { name: '한국양봉협회', icon: 'groups', desc: '양봉 기술 표준화 · 교육 협력', detail: '전국 양봉 농가 교육 과정 공동 개발', color: 'farm' as const },
      { name: '전북대학교', icon: 'school', desc: 'AI·빅데이터 산학 협력', detail: 'AI 기반 질병 조기 경보 시스템 개발', color: 'bee' as const },
      { name: '사회적기업진흥원', icon: 'diversity_3', desc: '사회적 가치 창출 지원', detail: '사회적기업 인증 및 지원 프로그램', color: 'bee' as const },
    ],
  };

  const currentPartners = partners[activeTab];

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex justify-center gap-3 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
              activeTab === tab.key
                ? 'bg-honey-500 text-white shadow-lg shadow-honey-500/25'
                : 'bg-bark-100 text-bark-600 hover:bg-bark-200'
            }`}
          >
            <span className="material-icons-outlined text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Partner cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {currentPartners.map((partner, idx) => (
          <div
            key={partner.name}
            className="group bg-bark-50 rounded-2xl p-6 border border-bark-200 hover:border-honey-300 hover:shadow-xl transition-all duration-300 h-full relative overflow-hidden"
            style={{
              animation: `fade-up 0.5s ease-out ${idx * 0.1}s both`,
            }}
          >
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-honey-50/0 to-honey-100/0 group-hover:from-honey-50/50 group-hover:to-honey-100/30 transition-all duration-300 rounded-2xl" />

            <div className="relative">
              <div
                className={`w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${
                  partner.color === 'honey'
                    ? 'bg-honey-100 text-honey-600'
                    : partner.color === 'farm'
                      ? 'bg-farm-100 text-farm-600'
                      : 'bg-bee-100 text-bee-600'
                }`}
              >
                <span className="material-icons-outlined text-2xl">{partner.icon}</span>
              </div>
              <h3 className="text-base font-bold text-bark-900 text-center">{partner.name}</h3>
              <p className="text-xs text-bark-500 mt-2 leading-relaxed text-center">{partner.desc}</p>
              <p className="text-[11px] text-bark-400 mt-2 leading-relaxed text-center italic">{partner.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Partnership summary */}
      <div className="mt-10 bg-bark-50 rounded-2xl p-6 lg:p-8 border border-bark-100">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-honey-100 flex items-center justify-center shrink-0">
            <span className="material-icons-outlined text-honey-600 text-2xl">workspace_premium</span>
          </div>
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-bark-900">파트너십 문의</h4>
            <p className="text-sm text-bark-500 mt-1">비온팜과 함께 양봉 산업의 미래를 만들어갈 파트너를 찾고 있습니다.</p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-honey-500 text-white text-sm font-bold rounded-full hover:bg-honey-600 transition-colors shadow-md"
          >
            제휴 문의
            <span className="material-icons-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── CEO Greeting Section ─────────────────────── */
function CeoGreeting() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
      <AnimatedSection className="flex-shrink-0" animation="slide-right">
        <div className="relative">
          {/* CEO avatar area */}
          <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-gradient-to-br from-honey-100 via-honey-50 to-bee-50 flex items-center justify-center relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-honey-200/30 to-transparent" />
            <div className="relative text-center">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-honey-300 to-honey-500 mx-auto flex items-center justify-center shadow-lg">
                <span className="material-icons-outlined text-white text-5xl">person</span>
              </div>
              <p className="mt-4 text-lg font-bold text-bark-900">김온팜</p>
              <p className="text-xs text-bark-500">대표이사 / CEO</p>
            </div>
          </div>
          {/* Decorative quote icon */}
          <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-honey-500 flex items-center justify-center shadow-lg">
            <span className="material-icons-outlined text-white text-xl">format_quote</span>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="flex-1" animation="slide-left">
        <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">CEO Message</p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-bark-900 leading-tight">
          &ldquo;기술과 자연의 조화로<br />
          <span className="text-honey-600">모두가 행복한 양봉</span>을 꿈꿉니다&rdquo;
        </h2>
        <div className="mt-6 space-y-4 text-bark-500 leading-relaxed">
          <p>
            안녕하세요, 농업회사법인 ㈜온팜 대표 김온팜입니다.
          </p>
          <p>
            비온팜은 &ldquo;꿀벌이 행복하면 사람도 행복하다&rdquo;는 신념에서 출발했습니다.
            IoT 센서와 AI 기술을 활용한 디지털 양봉 시스템을 통해 양봉 농가의
            생산성을 높이고, 꿀벌의 건강을 모니터링하며, 소비자에게는 투명하고
            안전한 꿀을 제공하고 있습니다.
          </p>
          <p>
            나아가 치유양봉 프로그램을 통해 사회적 가치를 창출하고, 밀원지도 서비스를
            통해 양봉 산업의 지속가능한 성장을 도모하고 있습니다. 비온팜은 앞으로도
            기술과 자연이 조화를 이루는 새로운 양봉 생태계를 만들어 가겠습니다.
          </p>
        </div>
        <div className="mt-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-bark-200" />
          <p className="text-sm font-bold text-bark-700">농업회사법인 ㈜온팜 대표이사 김온팜</p>
        </div>
      </AnimatedSection>
    </div>
  );
}

/* ─────────────────────── Organization Chart ─────────────────────── */
function OrgChart() {
  const departments = [
    {
      name: '대표이사',
      icon: 'person',
      color: 'honey' as const,
      children: [
        { name: '기술본부', icon: 'engineering', desc: 'IoT·AI·플랫폼 개발', color: 'bee' as const },
        { name: '양봉사업부', icon: 'hive', desc: '현장 양봉·교육 운영', color: 'farm' as const },
        { name: '사회공헌부', icon: 'volunteer_activism', desc: '치유양봉·CSR 프로그램', color: 'honey' as const },
        { name: '경영지원부', icon: 'business', desc: '경영·마케팅·재무 관리', color: 'bee' as const },
      ],
    },
  ];

  const colorMap = {
    honey: 'bg-honey-100 text-honey-600 border-honey-200',
    bee: 'bg-bee-100 text-bee-600 border-bee-200',
    farm: 'bg-farm-100 text-farm-600 border-farm-200',
  };

  return (
    <div className="flex flex-col items-center">
      {/* CEO */}
      <div className="bg-gradient-to-br from-honey-400 to-honey-600 text-white rounded-2xl px-8 py-5 text-center shadow-lg">
        <span className="material-icons-outlined text-2xl mb-1 block">person</span>
        <p className="font-bold">대표이사</p>
        <p className="text-xs text-honey-100">CEO</p>
      </div>

      {/* Connector line */}
      <div className="w-0.5 h-8 bg-bark-200" />

      {/* Horizontal connector */}
      <div className="relative w-full max-w-3xl">
        <div className="absolute top-0 left-[12.5%] right-[12.5%] h-0.5 bg-bark-200" />
      </div>

      {/* Departments */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-0">
        {departments[0].children.map((dept, idx) => (
          <AnimatedSection key={dept.name} delay={idx * 0.1} animation="fade-up">
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-8 bg-bark-200" />
              <div className={`rounded-2xl p-5 border text-center w-full transition-all hover:shadow-lg ${colorMap[dept.color]}`}>
                <span className="material-icons-outlined text-2xl mb-2 block">{dept.icon}</span>
                <p className="font-bold text-bark-900 text-sm">{dept.name}</p>
                <p className="text-xs text-bark-500 mt-1">{dept.desc}</p>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────── Progress Scroll Bar ─────────────────────── */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / totalHeight) * 100;
    setProgress(scrolled);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-bark-200/50">
      <div
        className="h-full bg-gradient-to-r from-honey-400 via-honey-500 to-farm-400 transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

/* ═══════════════════════════ ABOUT PAGE ═══════════════════════════ */
export default function AboutPage() {
  return (
    <>
      <ScrollProgress />
      <SectionNav />

      {/* ────────────── 1. HERO SECTION ────────────── */}
      <section className="bg-bark-900 text-white py-24 lg:py-36 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-[20rem] sm:w-[30rem] h-[20rem] sm:h-[30rem] bg-honey-500/5 rounded-full blur-3xl animate-pulse-glow" />
          <div
            className="absolute bottom-10 left-10 w-[18rem] sm:w-[25rem] h-[18rem] sm:h-[25rem] bg-farm-500/5 rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDelay: '1.5s' }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[22rem] sm:w-[35rem] h-[22rem] sm:h-[35rem] bg-bee-500/3 rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDelay: '3s' }}
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
          <div className="absolute top-[15%] left-[10%] w-1 h-1 bg-honey-400/60 rounded-full animate-float" />
          <div className="absolute top-[35%] left-[85%] w-1.5 h-1.5 bg-honey-300/40 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-[65%] left-[20%] w-1 h-1 bg-farm-400/50 rounded-full animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[25%] left-[65%] w-1 h-1 bg-bee-400/30 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-[80%] left-[75%] w-1.5 h-1.5 bg-honey-400/40 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-xs text-bark-500 mb-8 animate-fade-in">
            <Link href="/" className="hover:text-honey-400 transition-colors">홈</Link>
            <span className="material-icons-outlined text-sm">chevron_right</span>
            <span className="text-honey-400">비온팜 소개</span>
          </nav>

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

          {/* Quick Nav Pills */}
          <div
            className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-fade-up"
            style={{ animationDelay: '0.4s' }}
          >
            {[
              { label: '비전', icon: 'visibility', href: '#vision' },
              { label: '연혁', icon: 'timeline', href: '#history' },
              { label: '팀', icon: 'groups', href: '#team' },
              { label: '파트너', icon: 'handshake', href: '#partners' },
              { label: '오시는 길', icon: 'location_on', href: '#location' },
            ].map((nav) => (
              <a
                key={nav.label}
                href={nav.href}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-bark-300 border border-bark-700 hover:border-honey-500/50 hover:text-honey-400 transition-all"
              >
                <span className="material-icons-outlined text-sm">{nav.icon}</span>
                {nav.label}
              </a>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="mt-14 flex flex-col items-center gap-2 text-bark-500 animate-bounce">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <span className="material-icons-outlined text-lg">keyboard_arrow_down</span>
          </div>
        </div>
      </section>

      {/* ────────────── 2. VISION & MISSION ────────────── */}
      <section id="vision" className="py-24 lg:py-32 bg-white relative overflow-hidden scroll-mt-20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-honey-50 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-bee-50 rounded-full translate-x-1/3 translate-y-1/3" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <AnimatedSection className="flex-1" animation="slide-right">
              <div className="relative">
                <BeeIllustration className="w-full rounded-3xl shadow-2xl" />
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

                {/* Second floating badge */}
                <div className="absolute -top-3 right-8 bg-white rounded-2xl shadow-xl px-5 py-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-bee-100 flex items-center justify-center">
                    <span className="material-icons-outlined text-bee-600 text-base">verified</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-bark-900">사회적기업</p>
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
                  { icon: 'visibility', title: '비전', desc: '디지털 양봉으로 지속가능한 농업의 미래를 선도합니다', color: 'honey' },
                  { icon: 'flag', title: '미션', desc: '기술과 자연의 조화로 모두가 행복한 양봉 생태계를 만듭니다', color: 'bee' },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="group bg-bark-50 rounded-2xl p-5 border border-bark-100 hover:border-honey-200 hover:shadow-md transition-all"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${
                      item.color === 'honey' ? 'bg-honey-100' : 'bg-bee-100'
                    }`}>
                      <span className={`material-icons-outlined text-xl ${
                        item.color === 'honey' ? 'text-honey-600' : 'text-bee-600'
                      }`}>{item.icon}</span>
                    </div>
                    <h4 className="font-bold text-bark-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-bark-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Key highlights */}
              <div className="mt-6 flex flex-wrap gap-2">
                {['IoT 센서', 'AI 분석', '모바일 앱', '블록체인', '밀원지도', '치유양봉'].map((tag) => (
                  <span key={tag} className="px-3 py-1 text-xs font-medium bg-honey-50 text-honey-700 rounded-full border border-honey-100">
                    {tag}
                  </span>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ────────────── 2.5. CEO GREETING ────────────── */}
      <section className="py-24 lg:py-32 bg-bark-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-honey-50 rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <CeoGreeting />
        </div>
      </section>

      {/* ────────────── 3. CORE VALUES ────────────── */}
      <section id="values" className="py-24 lg:py-32 bg-white relative overflow-hidden scroll-mt-20">
        <div className="absolute top-20 right-0 w-72 h-72 bg-honey-50 rounded-full translate-x-1/2" />
        <div className="absolute bottom-10 left-0 w-56 h-56 bg-bee-50 rounded-full -translate-x-1/2" />

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
                subtitle: 'Technology',
                desc: 'IoT, AI, 빅데이터 등 최첨단 기술을 양봉 산업에 적용하여 스마트 농업을 선도합니다.',
                highlights: ['IoT 센서 3.0', 'AI 예측 모델', '빅데이터 분석'],
              },
              {
                icon: 'nature',
                color: 'bee',
                title: '생태 보존',
                subtitle: 'Ecology',
                desc: '꿀벌 건강 모니터링과 생태계 보전 활동으로 지속가능한 환경을 지킵니다.',
                highlights: ['꿀벌 건강 모니터링', '생태계 보전', '환경 데이터'],
              },
              {
                icon: 'handshake',
                color: 'farm',
                title: '상생 협력',
                subtitle: 'Cooperation',
                desc: '양봉 농가, 연구기관, 지역사회와 함께 성장하며 상생의 가치를 실현합니다.',
                highlights: ['산학 협력', '지역 상생', '정부 협업'],
              },
              {
                icon: 'diversity_3',
                color: 'honey',
                title: '사회적 가치',
                subtitle: 'Social Impact',
                desc: '치유양봉, 교육 프로그램 등을 통해 소외 계층과 함께하는 사회적 가치를 창출합니다.',
                highlights: ['치유양봉', '교육 프로그램', '사회공헌'],
              },
            ].map((item, idx) => (
              <AnimatedSection key={item.title} delay={idx * 0.1}>
                <div className="group bg-bark-50 rounded-2xl p-8 border border-bark-100 hover:border-honey-200 hover:shadow-xl hover:shadow-honey-500/5 transition-all duration-300 h-full text-center relative overflow-hidden">
                  {/* Top accent line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 transition-transform origin-left scale-x-0 group-hover:scale-x-100 duration-300 ${
                    item.color === 'honey'
                      ? 'bg-gradient-to-r from-honey-400 to-honey-500'
                      : item.color === 'bee'
                        ? 'bg-gradient-to-r from-bee-400 to-bee-500'
                        : 'bg-gradient-to-r from-farm-400 to-farm-500'
                  }`} />

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
                  <p className={`text-xs font-medium tracking-wider uppercase mb-1 ${
                    item.color === 'honey' ? 'text-honey-400' : item.color === 'bee' ? 'text-bee-400' : 'text-farm-400'
                  }`}>{item.subtitle}</p>
                  <h3 className="text-lg font-bold text-bark-900 mb-3">{item.title}</h3>
                  <p className="text-sm text-bark-500 leading-relaxed mb-4">{item.desc}</p>

                  {/* Highlight tags */}
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {item.highlights.map((h) => (
                      <span key={h} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        item.color === 'honey'
                          ? 'bg-honey-50 text-honey-600'
                          : item.color === 'bee'
                            ? 'bg-bee-50 text-bee-600'
                            : 'bg-farm-50 text-farm-600'
                      }`}>
                        {h}
                      </span>
                    ))}
                  </div>
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
              <pattern id="honeycomb-stats-about" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
                <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" fill="none" stroke="#FFC72C" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#honeycomb-stats-about)" />
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
      <section id="history" className="py-24 lg:py-32 bg-white relative overflow-hidden scroll-mt-20">
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

          <TimelineSection />
        </div>
      </section>

      {/* ────────────── 6. LEADERSHIP / TEAM ────────────── */}
      <section id="team" className="py-24 lg:py-32 bg-bark-50 scroll-mt-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-honey-50 rounded-full -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Our Team</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900">
              비온팜을 이끄는 <span className="text-honey-600">사람들</span>
            </h2>
            <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
              기술, 농업, 사회공헌 분야의 전문가들이 비온팜의 비전을 함께 만들어갑니다.
            </p>
          </AnimatedSection>

          {/* Organization Chart */}
          <AnimatedSection className="mb-16">
            <OrgChart />
          </AnimatedSection>

          {/* Team Members */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: '김온팜',
                role: '대표이사 / CEO',
                desc: '15년 IT 경력, 스마트팜 전문가',
                icon: 'person',
                color: 'honey',
                expertise: ['스마트팜', 'IT 경영', '사업전략'],
                quote: '기술로 양봉의 미래를 열겠습니다',
              },
              {
                name: '이기술',
                role: 'CTO / 기술총괄',
                desc: 'IoT·AI 시스템 아키텍트',
                icon: 'engineering',
                color: 'bee',
                expertise: ['IoT', 'AI/ML', '시스템설계'],
                quote: '데이터가 꿀벌의 건강을 지킵니다',
              },
              {
                name: '박양봉',
                role: '양봉사업부장',
                desc: '30년 양봉 경력, 한국양봉협회 자문위원',
                icon: 'hive',
                color: 'farm',
                expertise: ['양봉기술', '벌꿀생산', '품질관리'],
                quote: '현장의 경험이 최고의 기술입니다',
              },
              {
                name: '정치유',
                role: '사회공헌부장',
                desc: '복지·치유 프로그램 기획 전문가',
                icon: 'volunteer_activism',
                color: 'honey',
                expertise: ['치유양봉', '사회복지', 'CSR'],
                quote: '꿀벌이 사람을 치유합니다',
              },
            ].map((member, idx) => (
              <AnimatedSection key={member.name} delay={idx * 0.1} animation="scale-in">
                <div className="group bg-white rounded-2xl p-8 border border-bark-100 hover:border-honey-200 hover:shadow-xl transition-all duration-300 text-center h-full relative overflow-hidden">
                  {/* Background decoration on hover */}
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-1/2 translate-x-1/2 transition-opacity opacity-0 group-hover:opacity-100 ${
                    member.color === 'honey'
                      ? 'bg-honey-50'
                      : member.color === 'bee'
                        ? 'bg-bee-50'
                        : 'bg-farm-50'
                  }`} />

                  {/* Avatar */}
                  <div
                    className={`relative w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-105 transition-transform ${
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

                  {/* Quote */}
                  <p className="text-xs text-bark-400 mt-3 italic">&ldquo;{member.quote}&rdquo;</p>

                  {/* Expertise tags */}
                  <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                    {member.expertise.map((tag) => (
                      <span key={tag} className="text-[10px] font-medium px-2 py-0.5 bg-bark-50 text-bark-500 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────── 7. PARTNERS ────────────── */}
      <section id="partners" className="py-24 lg:py-32 bg-white relative overflow-hidden scroll-mt-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-honey-50 rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-bee-50 rounded-full -translate-x-1/2 translate-y-1/2" />

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

          <AnimatedSection>
            <PartnersSection />
          </AnimatedSection>
        </div>
      </section>

      {/* ────────────── 8. LOCATION / MAP ────────────── */}
      <section id="location" className="py-24 lg:py-32 bg-bark-900 text-white relative overflow-hidden scroll-mt-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-honey-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-farm-500/5 rounded-full blur-3xl" />

        {/* Honeycomb pattern for map section */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="honeycomb-map" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
                <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" fill="none" stroke="#FFC72C" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#honeycomb-map)" />
          </svg>
        </div>

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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3218.1!2d127.13!3d35.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z7KCE67aB7JmE7KO867SJ64-Z7J2N7JmE7KO87IKw64uo6rCAMjI0!5e0!3m2!1sko!2skr!4v1"
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

                {/* Directions helper */}
                <div className="bg-bark-800 rounded-2xl p-5 border border-bark-700">
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <span className="material-icons-outlined text-honey-400 text-base">alt_route</span>
                    찾아오는 방법
                  </h4>
                  <ul className="space-y-2">
                    {[
                      { mode: '자가용', desc: '봉동IC → 완주산단6로 방면 (약 10분)' },
                      { mode: '대중교통', desc: '전주역 → 270번 버스 → 완주산업단지 하차' },
                      { mode: 'KTX', desc: '전주역 하차 → 택시 약 20분' },
                    ].map((route) => (
                      <li key={route.mode} className="flex items-start gap-2 text-xs text-bark-400">
                        <span className="text-honey-400 font-bold shrink-0 w-12">{route.mode}</span>
                        <span>{route.desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 mt-2 px-6 py-3 text-sm font-bold text-bark-900 bg-honey-400 rounded-full hover:bg-honey-300 transition-colors w-full"
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
