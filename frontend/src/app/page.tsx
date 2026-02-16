'use client';

import Link from 'next/link';
import { useScrollAnimation, useCountUp } from '@/lib/useScrollAnimation';
import { useTranslation } from '@/context/LanguageContext';

/* ─────────────────────────── Animated Section Wrapper ─────────────────────────── */
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

/* ─────────────────────────── Stat Counter ─────────────────────────── */
function StatCounter({ target, suffix = '', label }: { target: number; suffix?: string; label: string }) {
  const { ref, isVisible } = useScrollAnimation();
  const count = useCountUp(target, isVisible);
  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-honey-400">
        {count}
        {suffix}
      </p>
      <p className="text-xs sm:text-sm text-bark-400 mt-2">{label}</p>
    </div>
  );
}

/* ═══════════════════════════ HOME PAGE ═══════════════════════════ */
export default function HomePage() {
  const { t } = useTranslation();

  const solutionItems = [
    { icon: 'sensors', color: 'honey', ...t.home.solutions.items.monitoring, link: '/solutions' },
    { icon: 'psychology', color: 'bee', ...t.home.solutions.items.aiPrediction, link: '/solutions' },
    { icon: 'map', color: 'farm', ...t.home.solutions.items.nectarMap, link: '/solutions' },
    { icon: 'phone_iphone', color: 'honey', ...t.home.solutions.items.mobileControl, link: '/solutions' },
    { icon: 'verified_user', color: 'bee', ...t.home.solutions.items.traceability, link: '/solutions' },
    { icon: 'favorite', color: 'farm', ...t.home.solutions.items.healingBeekeeping, link: '/program' },
  ];

  const aboutFeatures = [
    { icon: 'sensors', ...t.home.aboutPreview.features.iot, iconColor: 'text-honey-600', bgColor: 'bg-honey-50' },
    { icon: 'psychology', ...t.home.aboutPreview.features.ai, iconColor: 'text-bee-600', bgColor: 'bg-bee-50' },
    { icon: 'verified_user', ...t.home.aboutPreview.features.traceability, iconColor: 'text-farm-600', bgColor: 'bg-farm-50' },
  ];

  const roadmapItems = [
    { quarter: 'Q1', icon: 'hub', ...t.home.roadmap.items.q1 },
    { quarter: 'Q2', icon: 'smart_toy', ...t.home.roadmap.items.q2 },
    { quarter: 'Q3', icon: 'public', ...t.home.roadmap.items.q3 },
    { quarter: 'Q4', icon: 'favorite', ...t.home.roadmap.items.q4 },
  ];

  const newsIcons = ['campaign', 'science', 'event'];

  return (
    <>
      {/* ────────────── 1. HERO SECTION ────────────── */}
      <header className="relative overflow-hidden bg-bark-900 text-white min-h-[100dvh] flex items-center">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-[20rem] sm:w-[30rem] h-[20rem] sm:h-[30rem] bg-honey-500/10 rounded-full blur-3xl animate-pulse-glow" />
          <div
            className="absolute bottom-10 right-10 w-[20rem] sm:w-[40rem] h-[20rem] sm:h-[40rem] bg-honey-400/[0.08] rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDelay: '1s' }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25rem] sm:w-[50rem] h-[25rem] sm:h-[50rem] bg-farm-500/5 rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDelay: '2s' }}
          />
        </div>

        {/* Honeycomb Pattern */}
        <div className="absolute inset-0 opacity-[0.04]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="honeycomb"
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
            <rect width="100%" height="100%" fill="url(#honeycomb)" />
          </svg>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-bark-900/50 via-transparent to-bark-900/80" />

        {/* Particle dots */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[20%] left-[15%] w-1 h-1 bg-honey-400/60 rounded-full animate-float" />
          <div className="absolute top-[40%] left-[80%] w-1.5 h-1.5 bg-honey-300/40 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-[70%] left-[25%] w-1 h-1 bg-farm-400/50 rounded-full animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[30%] left-[60%] w-1 h-1 bg-honey-400/30 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-[80%] left-[70%] w-1.5 h-1.5 bg-bee-400/40 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-32 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Hero Text */}
            <div className="flex-1 text-center lg:text-left">
              <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-honey-500/30 text-honey-400 text-xs font-semibold tracking-wider uppercase mb-8 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-honey-400 animate-pulse" />
                {t.home.hero.badge}
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.12] tracking-tight animate-fade-up">
                {t.home.hero.titleLine1}
                <br />{t.home.hero.titleLine2}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-honey-300 via-honey-400 to-farm-400">
                  {t.home.hero.titleHighlight}
                </span>
                <br />{t.home.hero.titleLine3}
              </h1>
              <p
                className="mt-6 text-base sm:text-lg text-bark-300 leading-relaxed max-w-xl mx-auto lg:mx-0 animate-fade-up"
                style={{ animationDelay: '0.2s' }}
              >
                {t.home.hero.description}
              </p>
              <div
                className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start animate-fade-up"
                style={{ animationDelay: '0.4s' }}
              >
                <Link
                  href="/solutions"
                  className="w-full sm:w-auto px-8 py-4 text-base font-bold text-bark-900 bg-gradient-to-r from-honey-400 to-honey-500 rounded-full hover:from-honey-300 hover:to-honey-400 transition-all shadow-lg shadow-honey-500/20 text-center"
                >
                  {t.home.hero.ctaPrimary}
                </Link>
                <Link
                  href="/about"
                  className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white border border-bark-600 rounded-full hover:border-honey-500/50 hover:text-honey-400 transition-all text-center"
                >
                  {t.home.hero.ctaSecondary}
                </Link>
              </div>
              {/* Stats */}
              <div
                className="mt-14 grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0 animate-fade-up"
                style={{ animationDelay: '0.6s' }}
              >
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-honey-400">500+</p>
                  <p className="text-xs text-bark-400 mt-1">{t.home.hero.stats.farms}</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-honey-400">24/7</p>
                  <p className="text-xs text-bark-400 mt-1">{t.home.hero.stats.monitoring}</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-honey-400">98%</p>
                  <p className="text-xs text-bark-400 mt-1">{t.home.hero.stats.accuracy}</p>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="flex-1 flex items-center justify-center animate-scale-in max-w-full" style={{ animationDelay: '0.3s' }}>
              <div className="relative w-52 h-52 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[28rem] lg:h-[28rem]">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-honey-500/20 animate-spin-slow" />
                <div className="absolute inset-8 rounded-full border border-honey-500/15 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '20s' }} />
                <div className="absolute inset-16 rounded-full bg-gradient-to-br from-honey-500/20 to-farm-500/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <span className="material-icons-outlined text-7xl sm:text-8xl text-honey-400">hive</span>
                    <p className="text-honey-300 text-xs mt-2 font-medium tracking-wider">BeeOnFarm</p>
                  </div>
                </div>
                {/* Orbiting Icons */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-bark-800 border border-honey-500/30 flex items-center justify-center shadow-lg animate-float">
                  <span className="material-icons-outlined text-honey-400 text-xl">thermostat</span>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-bark-800 border border-bee-500/30 flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                  <span className="material-icons-outlined text-bee-400 text-xl">water_drop</span>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-12 h-12 rounded-full bg-bark-800 border border-farm-500/30 flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
                  <span className="material-icons-outlined text-farm-400 text-xl">map</span>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 right-0 w-12 h-12 rounded-full bg-bark-800 border border-honey-500/30 flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '1.5s' }}>
                  <span className="material-icons-outlined text-honey-400 text-xl">co2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-bark-500 animate-bounce">
            <span className="text-xs tracking-widest uppercase">{t.common.scroll}</span>
            <span className="material-icons-outlined text-lg">keyboard_arrow_down</span>
          </div>
        </div>
      </header>

      {/* ────────────── 2. SOLUTIONS / KEY FEATURES ────────────── */}
      <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-honey-50 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-bee-50 rounded-full translate-x-1/3 translate-y-1/3" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.home.solutions.subtitle}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
              {t.home.solutions.title} <span className="text-honey-600">{t.home.solutions.titleHighlight}</span>
            </h2>
            <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
              {t.home.solutions.description}
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutionItems.map((item, idx) => (
              <AnimatedSection key={item.title} delay={idx * 0.1}>
                <Link
                  href={item.link}
                  className="group block bg-bark-50 rounded-2xl p-8 border border-bark-100 hover:border-honey-200 hover:shadow-xl hover:shadow-honey-500/5 transition-all duration-300 h-full"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${
                      item.color === 'honey'
                        ? 'bg-honey-50 text-honey-600'
                        : item.color === 'bee'
                          ? 'bg-bee-50 text-bee-600'
                          : 'bg-farm-50 text-farm-600'
                    }`}
                  >
                    <span className="material-icons-outlined text-2xl">{item.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-bark-900 mb-3">{item.title}</h3>
                  <p className="text-sm text-bark-500 leading-relaxed">{item.desc}</p>
                  <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-honey-600 group-hover:gap-2 transition-all">
                    {t.common.learnMore}
                    <span className="material-icons-outlined text-base">arrow_forward</span>
                  </span>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────── 3. ABOUT / COMPANY PREVIEW ────────────── */}
      <section className="py-24 lg:py-32 bg-bark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <AnimatedSection className="flex-1" animation="slide-right">
              <div className="relative">
                <img
                  src="https://placehold.co/640x480/1C1917/FFC72C?text=BeeOnFarm+IoT+System&font=raleway"
                  alt="BeeOnFarm IoT System"
                  className="w-full rounded-3xl shadow-2xl object-cover aspect-[4/3]"
                />
                <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-20 h-20 sm:w-32 sm:h-32 bg-honey-100 rounded-2xl -z-10" />
                <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-14 h-14 sm:w-24 sm:h-24 bg-bee-100 rounded-2xl -z-10" />
              </div>
            </AnimatedSection>
            <AnimatedSection className="flex-1" animation="slide-left">
              <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.home.aboutPreview.subtitle}</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
                {t.home.aboutPreview.titleLine1}
                <br />
                <span className="text-honey-600">{t.home.aboutPreview.titleHighlight}</span>
              </h2>
              <p className="mt-6 text-bark-500 leading-relaxed">
                {t.home.aboutPreview.description}
              </p>
              <div className="mt-8 space-y-4">
                {aboutFeatures.map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${item.bgColor} flex items-center justify-center shrink-0 mt-0.5`}>
                      <span className={`material-icons-outlined ${item.iconColor} text-lg`}>{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-bark-900 text-sm">{item.title}</h4>
                      <p className="text-sm text-bark-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 mt-10 px-6 py-3 text-sm font-bold text-bark-900 bg-honey-400 rounded-full hover:bg-honey-300 transition-colors"
              >
                {t.common.learnMoreAbout}
                <span className="material-icons-outlined text-lg">arrow_forward</span>
              </Link>
            </AnimatedSection>
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
            <StatCounter target={500} suffix="+" label={t.home.stats.farms} />
            <StatCounter target={150} suffix="+" label={t.home.stats.sensors} />
            <StatCounter target={98} suffix="%" label={t.home.stats.accuracy} />
            <StatCounter target={8} suffix={t.home.stats.statsSuffix} label={t.home.stats.partners} />
          </div>
        </div>
      </section>

      {/* ────────────── 5. PROGRAMS PREVIEW ────────────── */}
      <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-20 right-0 w-72 h-72 bg-honey-50 rounded-full translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.home.programs.subtitle}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
              {t.home.programs.title} <span className="text-honey-600">{t.home.programs.titleHighlight}</span>
            </h2>
            <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
              {t.home.programs.description}
            </p>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Education Center Card */}
            <AnimatedSection animation="slide-right">
              <div className="group relative bg-gradient-to-br from-bark-900 to-bark-800 rounded-3xl p-8 lg:p-10 text-white overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-48 h-48 bg-honey-500/10 rounded-full -translate-y-1/3 translate-x-1/3" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-honey-500/15 flex items-center justify-center mb-6">
                    <span className="material-icons-outlined text-honey-400 text-2xl">school</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{t.home.programs.education.title}</h3>
                  <p className="text-bark-400 leading-relaxed mb-6">
                    {t.home.programs.education.desc}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {t.home.programs.education.tags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 text-xs font-medium bg-honey-500/10 text-honey-400 rounded-full border border-honey-500/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/program"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-honey-400 hover:text-honey-300 transition-colors group-hover:gap-3"
                  >
                    {t.home.programs.education.cta}
                    <span className="material-icons-outlined text-base">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            {/* Healing Beekeeping Card */}
            <AnimatedSection animation="slide-left">
              <div className="group relative bg-gradient-to-br from-bee-900 to-bee-800 rounded-3xl p-8 lg:p-10 text-white overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-48 h-48 bg-bee-400/10 rounded-full -translate-y-1/3 translate-x-1/3" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-bee-500/15 flex items-center justify-center mb-6">
                    <span className="material-icons-outlined text-bee-400 text-2xl">favorite</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{t.home.programs.healing.title}</h3>
                  <p className="text-bee-200/70 leading-relaxed mb-6">
                    {t.home.programs.healing.desc}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {t.home.programs.healing.tags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 text-xs font-medium bg-bee-500/10 text-bee-300 rounded-full border border-bee-500/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/program"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-bee-300 hover:text-bee-200 transition-colors group-hover:gap-3"
                  >
                    {t.home.programs.healing.cta}
                    <span className="material-icons-outlined text-base">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ────────────── 6. 2026 ROADMAP ────────────── */}
      <section className="py-24 lg:py-32 bg-bark-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-honey-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-farm-500/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-400 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.home.roadmap.subtitle}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              {t.home.roadmap.title} <span className="text-honey-400">{t.home.roadmap.titleHighlight}</span>
            </h2>
            <p className="mt-4 text-bark-400 max-w-2xl mx-auto">
              {t.home.roadmap.description}
            </p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {roadmapItems.map((plan, idx) => (
              <AnimatedSection key={plan.quarter} delay={idx * 0.12}>
                <div className="group relative bg-bark-800 rounded-2xl p-8 border border-bark-700 hover:border-honey-500/50 transition-all overflow-hidden h-full">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-honey-400 to-honey-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  <div className="w-12 h-12 rounded-xl bg-honey-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-icons-outlined text-honey-400 text-2xl">{plan.icon}</span>
                  </div>
                  <span className="text-honey-400 text-xs font-bold tracking-wider uppercase">{plan.quarter}</span>
                  <h3 className="text-lg font-bold mt-2 mb-3">{plan.title}</h3>
                  <p className="text-sm text-bark-400 leading-relaxed">{plan.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────── 7. LATEST NEWS / COMMUNITY PREVIEW ────────────── */}
      <section className="py-24 lg:py-32 bg-bark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.home.news.subtitle}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
              {t.home.news.title} <span className="text-honey-600">{t.home.news.titleHighlight}</span>
            </h2>
            <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
              {t.home.news.description}
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.home.news.items.map((news: { date: string; category: string; title: string; desc: string }, idx: number) => (
              <AnimatedSection key={news.title} delay={idx * 0.1}>
                <Link
                  href="/community"
                  className="group block bg-white rounded-2xl overflow-hidden border border-bark-100 hover:border-honey-200 hover:shadow-xl hover:shadow-honey-500/5 transition-all duration-300 h-full"
                >
                  <div className="bg-bark-900 px-6 py-5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-honey-500/10 to-transparent" />
                    <div className="relative flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-honey-500/15 flex items-center justify-center">
                        <span className="material-icons-outlined text-honey-400 text-xl">{newsIcons[idx]}</span>
                      </div>
                      <div>
                        <span className="text-honey-400 text-xs font-semibold">{news.category}</span>
                        <p className="text-bark-500 text-xs mt-0.5">{news.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-base font-bold text-bark-900 mb-2 group-hover:text-honey-600 transition-colors line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-sm text-bark-500 leading-relaxed line-clamp-3">{news.desc}</p>
                    <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-honey-600 group-hover:gap-2 transition-all">
                      {t.common.viewMore}
                      <span className="material-icons-outlined text-base">arrow_forward</span>
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center mt-12">
            <Link
              href="/community"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-bark-900 border-2 border-bark-200 rounded-full hover:border-honey-400 hover:text-honey-600 transition-all"
            >
              {t.common.viewAll}
              <span className="material-icons-outlined text-lg">arrow_forward</span>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ────────────── 8. GALLERY PREVIEW ────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.home.gallery.subtitle}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
              {t.home.gallery.title} <span className="text-honey-600">{t.home.gallery.titleHighlight}</span>
            </h2>
            <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
              {t.home.gallery.description}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { text: 'IoT+Sensor+Installation', bg: '1C1917', fg: 'FFC72C', span: 'col-span-2 sm:col-span-1 md:col-span-2 md:row-span-2' },
              { text: 'Healing+Beekeeping', bg: '14532D', fg: '86EFAC', span: '' },
              { text: 'Education+Center', bg: '292524', fg: 'FFD55A', span: '' },
              { text: 'Honey+Harvest', bg: '7C2D12', fg: 'FED7AA', span: '' },
              { text: 'Drone+Survey', bg: '1C1917', fg: '4ADE80', span: '' },
              { text: 'Partner+Meeting', bg: '44403C', fg: 'FFC72C', span: 'col-span-2 sm:col-span-1 md:col-span-2' },
            ].map((img, idx) => (
              <AnimatedSection key={img.text} className={img.span} delay={idx * 0.08} animation="scale-in">
                <div className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-square">
                  <img
                    src={`https://placehold.co/600x600/${img.bg}/${img.fg}?text=${img.text}&font=raleway`}
                    alt={img.text.replace(/\+/g, ' ')}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bark-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white text-sm font-semibold">{img.text.replace(/\+/g, ' ')}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center mt-12">
            <Link
              href="/community"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-bark-900 border-2 border-bark-200 rounded-full hover:border-honey-400 hover:text-honey-600 transition-all"
            >
              {t.common.galleryMore}
              <span className="material-icons-outlined text-lg">arrow_forward</span>
            </Link>
          </AnimatedSection>
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
            {t.home.cta.titleLine1}
            <br />
            {t.home.cta.titleLine2}
          </h2>
          <p className="mt-6 text-bark-800/70 text-lg max-w-2xl mx-auto leading-relaxed">
            {t.home.cta.description}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-honey-500 bg-bark-900 rounded-full hover:bg-bark-800 transition-colors text-center shadow-lg"
            >
              {t.common.freeTrialStart}
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-bark-900 border-2 border-bark-900/30 rounded-full hover:bg-bark-900/10 transition-colors text-center"
            >
              {t.common.inquiryContact}
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}
