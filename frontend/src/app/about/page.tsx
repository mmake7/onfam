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
import { useTranslation } from '@/context/LanguageContext';

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
  const { t } = useTranslation();

  const sections = [
    { id: 'vision', label: t.about.history.sectionNav.vision },
    { id: 'values', label: t.about.history.sectionNav.values },
    { id: 'history', label: t.about.history.sectionNav.history },
    { id: 'team', label: t.about.history.sectionNav.team },
    { id: 'partners', label: t.about.history.sectionNav.partners },
    { id: 'location', label: t.about.history.sectionNav.location },
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
  const { t } = useTranslation();

  const timelineIcons: Record<string, string[]> = {
    '2026': ['hub', 'smart_toy', 'map', 'favorite'],
    '2025': ['spa', 'phone_iphone', 'groups', 'school'],
    '2024': ['rocket_launch', 'handshake', 'sensors', 'analytics'],
    '2023': ['apartment', 'science', 'sensors'],
  };

  const timelines = [
    {
      year: '2026',
      title: t.about.history.timeline['2026'].title,
      subtitle: t.about.history.timeline['2026'].subtitle,
      items: t.about.history.timeline['2026'].items.map((text: string, i: number) => ({
        icon: timelineIcons['2026'][i],
        text,
      })),
      color: 'honey' as const,
      side: 'left' as const,
    },
    {
      year: '2025',
      title: t.about.history.timeline['2025'].title,
      subtitle: t.about.history.timeline['2025'].subtitle,
      items: t.about.history.timeline['2025'].items.map((text: string, i: number) => ({
        icon: timelineIcons['2025'][i],
        text,
      })),
      color: 'bee' as const,
      side: 'right' as const,
    },
    {
      year: '2024',
      title: t.about.history.timeline['2024'].title,
      subtitle: t.about.history.timeline['2024'].subtitle,
      items: t.about.history.timeline['2024'].items.map((text: string, i: number) => ({
        icon: timelineIcons['2024'][i],
        text,
      })),
      color: 'farm' as const,
      side: 'left' as const,
    },
    {
      year: '2023',
      title: t.about.history.timeline['2023'].title,
      subtitle: t.about.history.timeline['2023'].subtitle,
      items: t.about.history.timeline['2023'].items.map((text: string, i: number) => ({
        icon: timelineIcons['2023'][i],
        text,
      })),
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
        {timelines.map((tl) => (
          <button
            key={tl.year}
            onClick={() => setActiveYear(activeYear === tl.year ? null : tl.year)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              activeYear === tl.year
                ? `${colorClasses[tl.color].gradient} text-white shadow-lg`
                : 'bg-bark-100 text-bark-600 hover:bg-bark-200'
            }`}
          >
            {tl.year}
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
                    {timeline.items.map((item: { icon: string; text: string }, itemIdx: number) => (
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
  const { t } = useTranslation();

  const tabs = [
    { key: 'gov' as const, label: t.about.partners.tabs.gov, icon: 'account_balance' },
    { key: 'edu' as const, label: t.about.partners.tabs.edu, icon: 'school' },
  ];

  const govIcons = ['account_balance', 'science', 'precision_manufacturing', 'location_city'];
  const eduIcons = ['favorite', 'groups', 'school', 'diversity_3'];
  const govColors = ['bee', 'bee', 'honey', 'honey'] as const;
  const eduColors = ['farm', 'farm', 'bee', 'bee'] as const;

  const partners = {
    gov: t.about.partners.govPartners.map((p: { name: string; desc: string; detail: string }, i: number) => ({
      ...p,
      icon: govIcons[i],
      color: govColors[i],
    })),
    edu: t.about.partners.eduPartners.map((p: { name: string; desc: string; detail: string }, i: number) => ({
      ...p,
      icon: eduIcons[i],
      color: eduColors[i],
    })),
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
        {currentPartners.map((partner: { name: string; desc: string; detail: string; icon: string; color: 'honey' | 'farm' | 'bee' }, idx: number) => (
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
            <h4 className="font-bold text-bark-900">{t.about.partners.partnershipInquiry.title}</h4>
            <p className="text-sm text-bark-500 mt-1">{t.about.partners.partnershipInquiry.description}</p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-honey-500 text-white text-sm font-bold rounded-full hover:bg-honey-600 transition-colors shadow-md"
          >
            {t.about.partners.partnershipInquiry.cta}
            <span className="material-icons-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── CEO Greeting Section ─────────────────────── */
function CeoGreeting() {
  const { t } = useTranslation();

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
              <p className="mt-4 text-lg font-bold text-bark-900">{t.about.ceo.name}</p>
              <p className="text-xs text-bark-500">{t.about.ceo.role}</p>
            </div>
          </div>
          {/* Decorative quote icon */}
          <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-honey-500 flex items-center justify-center shadow-lg">
            <span className="material-icons-outlined text-white text-xl">format_quote</span>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="flex-1" animation="slide-left">
        <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.about.ceo.subtitle}</p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-bark-900 leading-tight">
          &ldquo;{t.about.ceo.title.replace(/^"|"$/g, '')}<br />
          <span className="text-honey-600">{t.about.ceo.titleHighlight}</span>{t.about.ceo.titleEnd.replace(/^"|"$/g, '')}&rdquo;
        </h2>
        <div className="mt-6 space-y-4 text-bark-500 leading-relaxed">
          <p>
            {t.about.ceo.greeting}
          </p>
          <p>
            {t.about.ceo.messageP1}
          </p>
          <p>
            {t.about.ceo.messageP2}
          </p>
        </div>
        <div className="mt-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-bark-200" />
          <p className="text-sm font-bold text-bark-700">{t.about.ceo.signature}</p>
        </div>
      </AnimatedSection>
    </div>
  );
}

/* ─────────────────────── Organization Chart ─────────────────────── */
function OrgChart() {
  const { t } = useTranslation();

  const departments = [
    {
      name: t.about.team.org.ceo,
      icon: 'person',
      color: 'honey' as const,
      children: [
        { name: t.about.team.org.techDept, icon: 'engineering', desc: t.about.team.org.techDeptDesc, color: 'bee' as const },
        { name: t.about.team.org.beeDept, icon: 'hive', desc: t.about.team.org.beeDeptDesc, color: 'farm' as const },
        { name: t.about.team.org.csrDept, icon: 'volunteer_activism', desc: t.about.team.org.csrDeptDesc, color: 'honey' as const },
        { name: t.about.team.org.adminDept, icon: 'business', desc: t.about.team.org.adminDeptDesc, color: 'bee' as const },
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
        <p className="font-bold">{t.about.team.org.ceo}</p>
        <p className="text-xs text-honey-100">CEO</p>
      </div>

      {/* Connector line */}
      <div className="w-0.5 h-8 bg-bark-200" />

      {/* Horizontal connector */}
      <div className="hidden lg:block relative w-full max-w-3xl">
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
  const { t } = useTranslation();

  const memberIcons = ['person', 'engineering', 'hive', 'volunteer_activism'];
  const memberColors = ['honey', 'bee', 'farm', 'honey'];

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
            <Link href="/" className="hover:text-honey-400 transition-colors">{t.about.hero.breadcrumbHome}</Link>
            <span className="material-icons-outlined text-sm">chevron_right</span>
            <span className="text-honey-400">{t.about.hero.breadcrumbCurrent}</span>
          </nav>

          <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-honey-500/30 text-honey-400 text-xs font-semibold tracking-wider uppercase mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-honey-400 animate-pulse" />
            {t.about.hero.badge}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight animate-fade-up">
            {t.about.hero.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-honey-300 via-honey-400 to-farm-400">{t.about.hero.titleHighlight}</span>
          </h1>
          <p
            className="mt-6 text-bark-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            {t.about.hero.descriptionLine1}
            <br className="hidden sm:block" />
            {t.about.hero.descriptionLine2}
          </p>

          {/* Quick Nav Pills */}
          <div
            className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-fade-up"
            style={{ animationDelay: '0.4s' }}
          >
            {[
              { label: t.about.hero.quickNav.vision, icon: 'visibility', href: '#vision' },
              { label: t.about.hero.quickNav.history, icon: 'timeline', href: '#history' },
              { label: t.about.hero.quickNav.team, icon: 'groups', href: '#team' },
              { label: t.about.hero.quickNav.partners, icon: 'handshake', href: '#partners' },
              { label: t.about.hero.quickNav.location, icon: 'location_on', href: '#location' },
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
            <span className="text-xs tracking-widest uppercase">{t.common.scroll}</span>
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
                <div className="absolute -bottom-3 -right-3 sm:-bottom-6 sm:-right-6 w-20 h-20 sm:w-32 sm:h-32 bg-honey-100 rounded-2xl -z-10" />
                <div className="absolute -top-3 -left-3 sm:-top-6 sm:-left-6 w-14 h-14 sm:w-24 sm:h-24 bg-bee-100 rounded-2xl -z-10" />

                {/* Floating badge */}
                <div className="absolute -bottom-4 left-4 sm:left-8 bg-white rounded-2xl shadow-xl px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-honey-100 flex items-center justify-center">
                    <span className="material-icons-outlined text-honey-600 text-xl">eco</span>
                  </div>
                  <div>
                    <p className="text-xs text-bark-400">Since</p>
                    <p className="text-lg font-black text-bark-900">2023</p>
                  </div>
                </div>

                {/* Second floating badge */}
                <div className="hidden sm:flex absolute -top-3 right-8 bg-white rounded-2xl shadow-xl px-5 py-3 items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-bee-100 flex items-center justify-center">
                    <span className="material-icons-outlined text-bee-600 text-base">verified</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-bark-900">{t.about.vision.socialEnterprise}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection className="flex-1" animation="slide-left">
              <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.about.vision.subtitle}</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
                {t.about.vision.titleLine1} <span className="text-honey-600">{t.about.vision.titleHighlight}</span>
              </h2>
              <p className="mt-6 text-bark-500 leading-relaxed">
                {t.about.vision.descriptionP1}
              </p>
              <p className="mt-4 text-bark-500 leading-relaxed">
                {t.about.vision.descriptionP2}
              </p>

              {/* Mission Cards */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: 'visibility', title: t.about.vision.missionCards.vision.title, desc: t.about.vision.missionCards.vision.desc, color: 'honey' },
                  { icon: 'flag', title: t.about.vision.missionCards.mission.title, desc: t.about.vision.missionCards.mission.desc, color: 'bee' },
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
                {t.about.vision.tags.map((tag: string) => (
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
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.about.values.subtitle}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
              {t.about.values.title} <span className="text-honey-600">{t.about.values.titleHighlight}</span>
            </h2>
            <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
              {t.about.values.description}
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {([
              {
                icon: 'biotech',
                color: 'honey',
                title: t.about.values.items.technology.title,
                subtitle: t.about.values.items.technology.subtitle,
                desc: t.about.values.items.technology.desc,
                highlights: t.about.values.items.technology.highlights,
              },
              {
                icon: 'nature',
                color: 'bee',
                title: t.about.values.items.ecology.title,
                subtitle: t.about.values.items.ecology.subtitle,
                desc: t.about.values.items.ecology.desc,
                highlights: t.about.values.items.ecology.highlights,
              },
              {
                icon: 'handshake',
                color: 'farm',
                title: t.about.values.items.cooperation.title,
                subtitle: t.about.values.items.cooperation.subtitle,
                desc: t.about.values.items.cooperation.desc,
                highlights: t.about.values.items.cooperation.highlights,
              },
              {
                icon: 'diversity_3',
                color: 'honey',
                title: t.about.values.items.socialImpact.title,
                subtitle: t.about.values.items.socialImpact.subtitle,
                desc: t.about.values.items.socialImpact.desc,
                highlights: t.about.values.items.socialImpact.highlights,
              },
            ] as const).map((item, idx) => (
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
                    {item.highlights.map((h: string) => (
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
            <StatCounter target={500} suffix="+" label={t.about.stats.farms} icon="hive" />
            <StatCounter target={150} suffix="+" label={t.about.stats.sensors} icon="sensors" />
            <StatCounter target={12} suffix="" label={t.about.stats.courses} icon="school" />
            <StatCounter target={8} suffix="" label={t.about.stats.partners} icon="handshake" />
          </div>
        </div>
      </section>

      {/* ────────────── 5. COMPANY TIMELINE ────────────── */}
      <section id="history" className="py-24 lg:py-32 bg-white relative overflow-hidden scroll-mt-20">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-honey-50 rounded-full -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.about.history.subtitle}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900">
              {t.about.history.title} <span className="text-honey-600">{t.about.history.titleHighlight}</span>
            </h2>
            <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
              {t.about.history.description}
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
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.about.team.subtitle}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900">
              {t.about.team.title} <span className="text-honey-600">{t.about.team.titleHighlight}</span>
            </h2>
            <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
              {t.about.team.description}
            </p>
          </AnimatedSection>

          {/* Organization Chart */}
          <AnimatedSection className="mb-16">
            <OrgChart />
          </AnimatedSection>

          {/* Team Members */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.about.team.members.map((member: { name: string; role: string; desc: string; expertise: string[]; quote: string }, idx: number) => (
              <AnimatedSection key={member.name} delay={idx * 0.1} animation="scale-in">
                <div className="group bg-white rounded-2xl p-8 border border-bark-100 hover:border-honey-200 hover:shadow-xl transition-all duration-300 text-center h-full relative overflow-hidden">
                  {/* Background decoration on hover */}
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-1/2 translate-x-1/2 transition-opacity opacity-0 group-hover:opacity-100 ${
                    memberColors[idx] === 'honey'
                      ? 'bg-honey-50'
                      : memberColors[idx] === 'bee'
                        ? 'bg-bee-50'
                        : 'bg-farm-50'
                  }`} />

                  {/* Avatar */}
                  <div
                    className={`relative w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-105 transition-transform ${
                      memberColors[idx] === 'honey'
                        ? 'bg-gradient-to-br from-honey-100 to-honey-200'
                        : memberColors[idx] === 'bee'
                          ? 'bg-gradient-to-br from-bee-100 to-bee-200'
                          : 'bg-gradient-to-br from-farm-100 to-farm-200'
                    }`}
                  >
                    <span
                      className={`material-icons-outlined text-4xl ${
                        memberColors[idx] === 'honey'
                          ? 'text-honey-600'
                          : memberColors[idx] === 'bee'
                            ? 'text-bee-600'
                            : 'text-farm-600'
                      }`}
                    >
                      {memberIcons[idx]}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-bark-900">{member.name}</h3>
                  <p
                    className={`text-xs font-semibold mt-1 ${
                      memberColors[idx] === 'honey'
                        ? 'text-honey-600'
                        : memberColors[idx] === 'bee'
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
                    {member.expertise.map((tag: string) => (
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
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.about.partners.subtitle}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900">
              {t.about.partners.title} <span className="text-honey-600">{t.about.partners.titleHighlight}</span>
            </h2>
            <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
              {t.about.partners.description}
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
            <p className="text-honey-400 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.about.location.subtitle}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              {t.about.location.title} <span className="text-honey-400">{t.about.location.titleHighlight}</span>
            </h2>
            <p className="mt-4 text-bark-400 max-w-2xl mx-auto">
              {t.about.location.description}
            </p>
          </AnimatedSection>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Map embed */}
            <AnimatedSection className="flex-[2]" animation="slide-right">
              <div className="rounded-2xl overflow-hidden border border-bark-700 shadow-2xl bg-bark-800 aspect-video lg:aspect-auto lg:h-[480px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3218.1!2d127.13!3d35.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z7KCE67aB7JmE7KO867SJ64-Z7J2M7JmE7KO87IKw64uo6rCAMjI0!5e0!3m2!1sko!2skr!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '300px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t.about.location.mapTitle}
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
                    title: t.about.location.info.address,
                    value: COMPANY_ADDRESS,
                    detail: t.about.location.info.addressDetail,
                  },
                  {
                    icon: 'phone',
                    title: t.about.location.info.phone,
                    value: COMPANY_PHONE,
                    detail: COMPANY_HOURS,
                  },
                  {
                    icon: 'mail',
                    title: t.about.location.info.email,
                    value: COMPANY_EMAIL,
                    detail: t.about.location.info.emailDetail,
                  },
                  {
                    icon: 'directions_bus',
                    title: t.about.location.info.transport,
                    value: t.about.location.info.transportValue,
                    detail: t.about.location.info.transportDetail,
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
                    {t.about.location.directions.title}
                  </h4>
                  <ul className="space-y-2">
                    {[
                      { mode: t.about.location.directions.car, desc: t.about.location.directions.carDesc },
                      { mode: t.about.location.directions.bus, desc: t.about.location.directions.busDesc },
                      { mode: t.about.location.directions.ktx, desc: t.about.location.directions.ktxDesc },
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
                  {t.common.inquiry}
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
            {t.about.cta.titleLine1}
            <br />
            {t.about.cta.titleLine2}
          </h2>
          <p className="mt-6 text-bark-800/70 text-lg max-w-2xl mx-auto leading-relaxed">
            {t.about.cta.description}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-honey-500 bg-bark-900 rounded-full hover:bg-bark-800 transition-colors text-center shadow-lg"
            >
              {t.common.freeTrialStart}
            </Link>
            <Link
              href="/solutions"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-bark-900 border-2 border-bark-900/30 rounded-full hover:bg-bark-900/10 transition-colors text-center"
            >
              {t.about.cta.ctaSecondary}
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}
