'use client';

import { useState, useCallback } from 'react';
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

/* ─────────────────────────── Counter Stat Component ─────────────────────────── */
function CounterStat({ value, label, icon, suffix = '' }: { value: number; label: string; icon: string; suffix?: string }) {
  const { ref, isVisible } = useScrollAnimation();
  const count = useCountUp(value, isVisible);
  return (
    <div ref={ref} className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-honey-50 mb-3">
        <span className="material-icons-outlined text-honey-600 text-xl">{icon}</span>
      </div>
      <p className="text-2xl sm:text-3xl font-black text-bark-900">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-sm text-bark-500 mt-1">{label}</p>
    </div>
  );
}

/* ─────────────────────────── Data (static, non-translatable) ─────────────────────────── */

const colorMap = {
  honey: {
    gradient: 'bg-gradient-to-br from-honey-50 to-honey-100',
    blob: 'bg-honey-200/40',
    icon: 'text-honey-400',
    iconBg: 'bg-honey-50',
    badge: 'bg-honey-100 text-honey-700',
    dot: 'bg-honey-400',
    button: 'bg-honey-50 text-honey-700 hover:bg-honey-100',
    buttonSolid: 'bg-honey-500 text-white hover:bg-honey-600',
    border: 'border-honey-200',
    ring: 'ring-honey-400',
    text: 'text-honey-600',
    lightBg: 'bg-honey-50',
    statusBg: 'bg-honey-100 text-honey-700',
  },
  bee: {
    gradient: 'bg-gradient-to-br from-bee-50 to-bee-100',
    blob: 'bg-bee-200/40',
    icon: 'text-bee-400',
    iconBg: 'bg-bee-50',
    badge: 'bg-bee-100 text-bee-700',
    dot: 'bg-bee-400',
    button: 'bg-bee-50 text-bee-700 hover:bg-bee-100',
    buttonSolid: 'bg-bee-500 text-white hover:bg-bee-600',
    border: 'border-bee-200',
    ring: 'ring-bee-400',
    text: 'text-bee-600',
    lightBg: 'bg-bee-50',
    statusBg: 'bg-bee-100 text-bee-700',
  },
  farm: {
    gradient: 'bg-gradient-to-br from-farm-50 to-farm-100',
    blob: 'bg-farm-200/40',
    icon: 'text-farm-400',
    iconBg: 'bg-farm-50',
    badge: 'bg-farm-100 text-farm-700',
    dot: 'bg-farm-400',
    button: 'bg-farm-50 text-farm-700 hover:bg-farm-100',
    buttonSolid: 'bg-farm-500 text-white hover:bg-farm-600',
    border: 'border-farm-200',
    ring: 'ring-farm-400',
    text: 'text-farm-600',
    lightBg: 'bg-farm-50',
    statusBg: 'bg-farm-100 text-farm-700',
  },
};

type TabType = 'education' | 'healing';

/* ═══════════════════════════ PROGRAM PAGE ═══════════════════════════ */
export default function ProgramPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('education');
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);
  const [expandedHealing, setExpandedHealing] = useState<string | null>(null);

  const toggleProgram = useCallback((id: string) => {
    setExpandedProgram(prev => prev === id ? null : id);
  }, []);

  const toggleHealing = useCallback((id: string) => {
    setExpandedHealing(prev => prev === id ? null : id);
  }, []);

  /* ─────────────────────────── Translated Data ─────────────────────────── */

  const educationPrograms = [
    {
      id: 'beginner',
      badge: t.program.education.programs.beginner.badge,
      badgeColor: 'honey' as const,
      icon: 'eco',
      title: t.program.education.programs.beginner.title,
      subtitle: t.program.education.programs.beginner.subtitle,
      duration: t.program.education.programs.beginner.duration,
      capacity: t.program.education.programs.beginner.capacity,
      schedule: t.program.education.programs.beginner.schedule,
      price: t.program.education.programs.beginner.price,
      desc: t.program.education.programs.beginner.desc,
      curriculum: t.program.education.programs.beginner.curriculum,
      detailedCurriculum: t.program.education.detailedCurriculum_data.beginner,
      outcomes: t.program.education.outcomes_data.beginner,
      targetAudience: t.program.education.programs.beginner.targetAudience,
      location: t.program.education.location_data.beginner,
      nextSession: t.program.education.programs.beginner.nextSession,
    },
    {
      id: 'intermediate',
      badge: t.program.education.programs.intermediate.badge,
      badgeColor: 'bee' as const,
      icon: 'hive',
      title: t.program.education.programs.intermediate.title,
      subtitle: t.program.education.programs.intermediate.subtitle,
      duration: t.program.education.programs.intermediate.duration,
      capacity: t.program.education.programs.intermediate.capacity,
      schedule: t.program.education.programs.intermediate.schedule,
      price: t.program.education.programs.intermediate.price,
      desc: t.program.education.programs.intermediate.desc,
      curriculum: t.program.education.programs.intermediate.curriculum,
      detailedCurriculum: t.program.education.detailedCurriculum_data.intermediate,
      outcomes: t.program.education.outcomes_data.intermediate,
      targetAudience: t.program.education.programs.intermediate.targetAudience,
      location: t.program.education.location_data.intermediate,
      nextSession: t.program.education.programs.intermediate.nextSession,
    },
    {
      id: 'expert',
      badge: t.program.education.programs.expert.badge,
      badgeColor: 'farm' as const,
      icon: 'hub',
      title: t.program.education.programs.expert.title,
      subtitle: t.program.education.programs.expert.subtitle,
      duration: t.program.education.programs.expert.duration,
      capacity: t.program.education.programs.expert.capacity,
      schedule: t.program.education.programs.expert.schedule,
      price: t.program.education.programs.expert.price,
      desc: t.program.education.programs.expert.desc,
      curriculum: t.program.education.programs.expert.curriculum,
      detailedCurriculum: t.program.education.detailedCurriculum_data.expert,
      outcomes: t.program.education.outcomes_data.expert,
      targetAudience: t.program.education.programs.expert.targetAudience,
      location: t.program.education.location_data.expert,
      nextSession: t.program.education.programs.expert.nextSession,
    },
  ];

  const healingPrograms = [
    {
      id: 'disabled',
      icon: 'accessibility_new',
      title: t.program.healing.programs.disabled.title,
      target: t.program.healing.programs.disabled.target,
      duration: t.program.healing.programs.disabled.duration,
      capacity: t.program.healing.programs.disabled.capacity,
      desc: t.program.healing.programs.disabled.desc,
      tags: t.program.healing.programs.disabled.tags,
      activities: t.program.healing.activities_data.disabled,
      effects: t.program.healing.effects_data.disabled,
    },
    {
      id: 'elderly',
      icon: 'elderly',
      title: t.program.healing.programs.elderly.title,
      target: t.program.healing.programs.elderly.target,
      duration: t.program.healing.programs.elderly.duration,
      capacity: t.program.healing.programs.elderly.capacity,
      desc: t.program.healing.programs.elderly.desc,
      tags: t.program.healing.programs.elderly.tags,
      activities: t.program.healing.activities_data.elderly,
      effects: t.program.healing.effects_data.elderly,
    },
    {
      id: 'family',
      icon: 'family_restroom',
      title: t.program.healing.programs.family.title,
      target: t.program.healing.programs.family.target,
      duration: t.program.healing.programs.family.duration,
      capacity: t.program.healing.programs.family.capacity,
      desc: t.program.healing.programs.family.desc,
      tags: t.program.healing.programs.family.tags,
      activities: t.program.healing.activities_data.family,
      effects: t.program.healing.effects_data.family,
    },
    {
      id: 'corporate',
      icon: 'groups',
      title: t.program.healing.programs.corporate.title,
      target: t.program.healing.programs.corporate.target,
      duration: t.program.healing.programs.corporate.duration,
      capacity: t.program.healing.programs.corporate.capacity,
      desc: t.program.healing.programs.corporate.desc,
      tags: t.program.healing.programs.corporate.tags,
      activities: t.program.healing.activities_data.corporate,
      effects: t.program.healing.effects_data.corporate,
    },
  ];

  const healingAgriculturePrograms = [
    {
      icon: 'local_florist',
      title: t.program.healing.agriculturePrograms.garden.title,
      desc: t.program.healing.agriculturePrograms.garden.desc,
      duration: t.program.healing.agriculturePrograms.garden.duration,
      color: 'bee',
    },
    {
      icon: 'spa',
      title: t.program.healing.agriculturePrograms.aroma.title,
      desc: t.program.healing.agriculturePrograms.aroma.desc,
      duration: t.program.healing.agriculturePrograms.aroma.duration,
      color: 'honey',
    },
    {
      icon: 'nature_people',
      title: t.program.healing.agriculturePrograms.forest.title,
      desc: t.program.healing.agriculturePrograms.forest.desc,
      duration: t.program.healing.agriculturePrograms.forest.duration,
      color: 'bee',
    },
    {
      icon: 'restaurant',
      title: t.program.healing.agriculturePrograms.cooking.title,
      desc: t.program.healing.agriculturePrograms.cooking.desc,
      duration: t.program.healing.agriculturePrograms.cooking.duration,
      color: 'farm',
    },
  ];

  const processSteps = t.program.process.steps.map((step: { step: string; title: string; desc: string }, idx: number) => ({
    ...step,
    icon: ['search', 'edit_note', 'how_to_reg', 'celebration'][idx],
  }));

  const instructors = t.program.instructors.members.map((member: { name: string; role: string; career: string; speciality: string; certifications: string[] }, idx: number) => ({
    ...member,
    icon: ['person', 'engineering', 'psychology', 'nature'][idx],
  }));

  const testimonials = t.program.testimonials.map((item: { name: string; program: string; text: string }) => ({
    ...item,
    rating: 5,
  }));

  const upcomingSchedules = [
    { date: '2026.03.02', program: t.program.education.programs.beginner.title, status: t.program.schedule.status.accepting, color: 'honey', spots: `5 ${t.program.schedule.spotsRemaining}` },
    { date: '2026.03.15', program: t.program.healing.programs.family.title, status: t.program.schedule.status.accepting, color: 'bee', spots: `3 ${t.program.schedule.spotsRemaining}` },
    { date: '2026.04.01', program: t.program.education.programs.intermediate.title, status: t.program.schedule.status.upcoming, color: 'bee', spots: '15' },
    { date: '2026.03.08', program: t.program.healing.programs.elderly.title, status: t.program.schedule.status.accepting, color: 'farm', spots: `7 ${t.program.schedule.spotsRemaining}` },
    { date: '2026.03.22', program: t.program.healing.agriculturePrograms.garden.title, status: t.program.schedule.status.accepting, color: 'bee', spots: `10 ${t.program.schedule.spotsRemaining}` },
    { date: '2026.09.01', program: t.program.education.programs.expert.title, status: t.program.schedule.status.upcoming, color: 'farm', spots: '12' },
  ];

  return (
    <>
      {/* ────────────── HERO SECTION ────────────── */}
      <section className="bg-bark-900 text-white py-20 lg:py-28 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-[20rem] sm:w-[30rem] h-[20rem] sm:h-[30rem] bg-honey-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-[20rem] sm:w-[40rem] h-[20rem] sm:h-[40rem] bg-bee-400/[0.08] rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 opacity-[0.04]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="honeycomb-program" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" fill="none" stroke="#FFC72C" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#honeycomb-program)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-honey-500/10 border border-honey-500/20 rounded-full text-honey-400 text-sm font-medium mb-6">
              <span className="material-icons-outlined text-base">school</span>
              {t.program.hero.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
              {t.program.hero.title} <span className="text-honey-400">{t.program.hero.titleHighlight}</span> {t.program.hero.titleEnd}
            </h1>
            <p className="text-bark-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
              {t.program.hero.description}
            </p>
          </AnimatedSection>

          {/* Main Tab Switcher */}
          <AnimatedSection delay={0.1}>
            <div className="inline-flex items-center bg-bark-800/80 backdrop-blur-sm rounded-full p-1.5 border border-bark-700">
              <button
                onClick={() => setActiveTab('education')}
                className={`inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${
                  activeTab === 'education'
                    ? 'bg-honey-500 text-bark-900 shadow-lg shadow-honey-500/30'
                    : 'text-bark-400 hover:text-white'
                }`}
              >
                <span className="material-icons-outlined text-base">school</span>
                {t.program.hero.tabEducation}
              </button>
              <button
                onClick={() => setActiveTab('healing')}
                className={`inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${
                  activeTab === 'healing'
                    ? 'bg-bee-500 text-white shadow-lg shadow-bee-500/30'
                    : 'text-bark-400 hover:text-white'
                }`}
              >
                <span className="material-icons-outlined text-base">favorite</span>
                {t.program.hero.tabHealing}
              </button>
            </div>
          </AnimatedSection>

          {/* Section quick-nav */}
          <AnimatedSection delay={0.2} className="mt-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="#programs"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-bark-400 border border-bark-700 rounded-full hover:border-bark-500 hover:text-bark-300 transition-colors"
              >
                <span className="material-icons-outlined text-sm">list</span>
                {t.program.hero.quickNav.programs}
              </a>
              <a
                href="#schedule"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-bark-400 border border-bark-700 rounded-full hover:border-bark-500 hover:text-bark-300 transition-colors"
              >
                <span className="material-icons-outlined text-sm">calendar_today</span>
                {t.program.hero.quickNav.schedule}
              </a>
              <a
                href="#instructors"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-bark-400 border border-bark-700 rounded-full hover:border-bark-500 hover:text-bark-300 transition-colors"
              >
                <span className="material-icons-outlined text-sm">people</span>
                {t.program.hero.quickNav.instructors}
              </a>
              <a
                href="#process"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-bark-400 border border-bark-700 rounded-full hover:border-bark-500 hover:text-bark-300 transition-colors"
              >
                <span className="material-icons-outlined text-sm">route</span>
                {t.program.hero.quickNav.process}
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ────────────── IMPACT STATS BAND ────────────── */}
      <section className="py-12 bg-white border-b border-bark-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <CounterStat value={1200} label={t.program.stats.graduates} icon="school" suffix="+" />
            <CounterStat value={300} label={t.program.stats.healingParticipants} icon="favorite" suffix="+" />
            <CounterStat value={96} label={t.program.stats.satisfaction} icon="thumb_up" suffix="%" />
            <CounterStat value={15} label={t.program.stats.regions} icon="location_on" suffix={t.program.statsSuffix} />
          </div>
        </div>
      </section>

      {/* ────────────── STICKY TAB BAR ────────────── */}
      <div className="sticky top-14 sm:top-16 z-30 bg-white/95 backdrop-blur-md border-b border-bark-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('education')}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'education'
                  ? 'bg-honey-500 text-bark-900 shadow-md'
                  : 'text-bark-500 hover:bg-bark-100 hover:text-bark-700'
              }`}
            >
              <span className="material-icons-outlined text-sm align-middle mr-1">school</span>
              {t.program.stickyTab.education}
            </button>
            <button
              onClick={() => setActiveTab('healing')}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'healing'
                  ? 'bg-bee-500 text-white shadow-md'
                  : 'text-bark-500 hover:bg-bark-100 hover:text-bark-700'
              }`}
            >
              <span className="material-icons-outlined text-sm align-middle mr-1">favorite</span>
              {t.program.stickyTab.healing}
            </button>
            <div className="flex-1" />
            <a
              href="#schedule"
              className="hidden sm:inline-flex items-center gap-1 px-4 py-2 text-xs font-medium text-bark-500 hover:text-bark-700 transition-colors"
            >
              <span className="material-icons-outlined text-sm">calendar_today</span>
              {t.program.stickyTab.schedule}
            </a>
            <a
              href="#process"
              className="hidden sm:inline-flex items-center gap-1 px-4 py-2 text-xs font-medium text-bark-500 hover:text-bark-700 transition-colors"
            >
              <span className="material-icons-outlined text-sm">route</span>
              {t.program.stickyTab.process}
            </a>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          EDUCATION CENTER TAB
          ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'education' && (
        <>
          {/* ────────────── EDUCATION PROGRAMS SECTION ────────────── */}
          <section id="programs" className="py-24 lg:py-32 bg-white scroll-mt-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <AnimatedSection className="text-center mb-16">
                <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.program.education.subtitle}</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
                  {t.program.education.title} <span className="text-honey-600">{t.program.education.titleHighlight}</span>
                </h2>
                <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
                  {t.program.education.description}
                </p>
              </AnimatedSection>

              {/* Level indicator */}
              <AnimatedSection className="mb-12" delay={0.05}>
                <div className="flex items-center justify-center gap-2 sm:gap-4">
                  {educationPrograms.map((p, idx) => {
                    const colors = colorMap[p.badgeColor];
                    return (
                      <div key={p.id} className="flex items-center gap-2 sm:gap-4">
                        <div className="text-center">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${colors.lightBg} flex items-center justify-center mx-auto mb-1`}>
                            <span className={`material-icons-outlined ${colors.text} text-lg sm:text-xl`}>{p.icon}</span>
                          </div>
                          <span className={`text-xs font-bold ${colors.text}`}>{p.badge}</span>
                        </div>
                        {idx < educationPrograms.length - 1 && (
                          <div className="w-8 sm:w-16 h-px bg-bark-200 relative top-[-8px]">
                            <span className="material-icons-outlined text-bark-300 text-sm absolute -right-1 -top-[7px]">chevron_right</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </AnimatedSection>

              {/* Program Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {educationPrograms.map((program, idx) => {
                  const colors = colorMap[program.badgeColor];
                  const isExpanded = expandedProgram === program.id;
                  return (
                    <AnimatedSection key={program.id} delay={idx * 0.1}>
                      <div className={`group bg-white rounded-3xl overflow-hidden border hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col ${
                        isExpanded ? `${colors.border} shadow-xl` : 'border-bark-200 hover:border-honey-300 hover:shadow-honey-100/50'
                      }`}>
                        {/* Card Header with Icon */}
                        <div className={`h-44 flex items-center justify-center relative overflow-hidden ${colors.gradient}`}>
                          <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2 ${colors.blob}`} />
                          <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full translate-y-1/2 -translate-x-1/3 opacity-30 bg-white/20" />
                          <span className={`material-icons-outlined text-6xl group-hover:scale-110 transition-transform duration-500 ${colors.icon}`}>
                            {program.icon}
                          </span>
                          {/* Next session badge */}
                          <div className="absolute top-3 right-3">
                            <span className="px-2.5 py-1 text-[10px] font-bold bg-white/90 text-bark-700 rounded-full shadow-sm">
                              {program.nextSession}
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${colors.badge}`}>
                              {program.badge}
                            </span>
                            <span className="text-xs text-bark-400 flex items-center gap-1">
                              <span className="material-icons-outlined text-sm">schedule</span>
                              {program.duration}
                            </span>
                          </div>
                          <p className="text-[11px] text-bark-400 mb-3">{program.subtitle}</p>
                          <h3 className="text-xl font-bold text-bark-900 mb-2">{program.title}</h3>
                          <p className="text-sm text-bark-500 leading-relaxed mb-5">{program.desc}</p>

                          {/* Curriculum preview */}
                          <div className="mb-5 flex-1">
                            <p className="text-xs font-bold text-bark-700 uppercase tracking-wider mb-2">{t.program.education.curriculum}</p>
                            <ul className="space-y-1.5">
                              {program.curriculum.map((item: string) => (
                                <li key={item} className="flex items-center gap-2 text-sm text-bark-500">
                                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Meta Info */}
                          <div className="space-y-2 mb-5 text-xs text-bark-400">
                            <div className="flex items-center gap-1.5">
                              <span className="material-icons-outlined text-sm">calendar_today</span>
                              {program.schedule}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="material-icons-outlined text-sm">people</span>
                              {program.capacity}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="material-icons-outlined text-sm">payments</span>
                              {program.price}
                            </div>
                          </div>

                          {/* Expandable Detail */}
                          <button
                            onClick={() => toggleProgram(program.id)}
                            className={`w-full flex items-center justify-center gap-1 px-4 py-2 text-xs font-medium rounded-lg transition-colors mb-3 ${colors.button}`}
                          >
                            <span className="material-icons-outlined text-sm" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
                              expand_more
                            </span>
                            {isExpanded ? t.program.education.collapseDetail : t.program.education.expandDetail}
                          </button>

                          {/* Expanded Content */}
                          <div
                            className="overflow-hidden transition-all duration-500"
                            style={{ maxHeight: isExpanded ? '800px' : '0px', opacity: isExpanded ? 1 : 0 }}
                          >
                            <div className="space-y-4 pt-3 border-t border-bark-100">
                              {/* Detailed Curriculum */}
                              <div>
                                <p className="text-xs font-bold text-bark-700 uppercase tracking-wider mb-3">{t.program.education.detailedCurriculum}</p>
                                <div className="space-y-3">
                                  {program.detailedCurriculum.map((week) => (
                                    <div key={week.week} className={`p-3 rounded-xl ${colors.lightBg}`}>
                                      <div className="flex items-center gap-2 mb-1.5">
                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${colors.badge}`}>{week.week}</span>
                                        <span className="text-sm font-semibold text-bark-800">{week.title}</span>
                                      </div>
                                      <ul className="space-y-1">
                                        {week.topics.map((topic) => (
                                          <li key={topic} className="flex items-center gap-1.5 text-xs text-bark-500">
                                            <span className={`w-1 h-1 rounded-full ${colors.dot}`} />
                                            {topic}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Outcomes */}
                              <div>
                                <p className="text-xs font-bold text-bark-700 uppercase tracking-wider mb-2">{t.program.education.outcomes}</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {program.outcomes.map((outcome) => (
                                    <span key={outcome} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-bark-50 text-bark-600 rounded-full border border-bark-200">
                                      <span className="material-icons-outlined text-xs text-bark-400">check_circle</span>
                                      {outcome}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Extra Info */}
                              <div className="text-xs text-bark-400 space-y-1">
                                <p><strong className="text-bark-600">{t.program.education.target}:</strong> {program.targetAudience}</p>
                                <p><strong className="text-bark-600">{t.program.education.location}:</strong> {program.location}</p>
                              </div>
                            </div>
                          </div>

                          {/* Action */}
                          <div className="pt-4 border-t border-bark-100 mt-auto">
                            <Link
                              href="/contact"
                              className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-xl transition-all ${colors.buttonSolid}`}
                            >
                              {t.common.apply}
                              <span className="material-icons-outlined text-base">arrow_forward</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </AnimatedSection>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ────────────── PROGRAM FEATURES ────────────── */}
          <section className="py-24 lg:py-32 bg-bark-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="honeycomb-features" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
                    <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" fill="none" stroke="#FFC72C" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#honeycomb-features)" />
              </svg>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
              <AnimatedSection className="text-center mb-16">
                <p className="text-honey-400 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.program.education.whySpecial.subtitle}</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                  {t.program.education.whySpecial.title} <span className="text-honey-400">{t.program.education.whySpecial.titleHighlight}</span>
                </h2>
              </AnimatedSection>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {t.program.education.whySpecial.items.map((item: { title: string; desc: string }, idx: number) => (
                  <AnimatedSection key={item.title} delay={idx * 0.08}>
                    <div className="group bg-bark-800 rounded-2xl p-6 border border-bark-700 hover:border-honey-500/40 transition-all h-full">
                      <div className="w-11 h-11 rounded-xl bg-honey-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-icons-outlined text-honey-400 text-xl">
                          {['precision_manufacturing', 'person', 'workspace_premium', 'nature', 'support_agent', 'trending_up'][idx]}
                        </span>
                      </div>
                      <h3 className="text-base font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-bark-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ════════════════════════════════════════════════════════════════
          HEALING AGRICULTURE TAB
          ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'healing' && (
        <>
          {/* ────────────── HEALING BEEKEEPING INTRO ────────────── */}
          <section id="programs" className="py-24 lg:py-32 bg-white scroll-mt-32 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-bee-100/40 rounded-full translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-honey-100/30 rounded-full -translate-x-1/3 translate-y-1/3" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
              <div className="flex flex-col lg:flex-row items-center gap-16 mb-20">
                {/* Text */}
                <AnimatedSection className="flex-1" animation="slide-right">
                  <p className="text-bee-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.program.healing.subtitle}</p>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
                    {t.program.healing.titleLine1}
                    <br />
                    <span className="text-bee-600">{t.program.healing.titleHighlight}</span> {t.program.healing.titleEnd}
                  </h2>
                  <p className="mt-6 text-bark-500 leading-relaxed">
                    {t.program.healing.description}
                  </p>
                  <div className="mt-8 space-y-4">
                    {[
                      { icon: 'spa', title: t.program.healing.features.nature.title, desc: t.program.healing.features.nature.desc, iconColor: 'text-bee-600', bgColor: 'bg-bee-50' },
                      { icon: 'psychology', title: t.program.healing.features.expert.title, desc: t.program.healing.features.expert.desc, iconColor: 'text-honey-600', bgColor: 'bg-honey-50' },
                      { icon: 'handshake', title: t.program.healing.features.partnership.title, desc: t.program.healing.features.partnership.desc, iconColor: 'text-farm-600', bgColor: 'bg-farm-50' },
                    ].map((item) => (
                      <div key={item.title} className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-lg ${item.bgColor} flex items-center justify-center shrink-0 mt-0.5`}>
                          <span className={`material-icons-outlined ${item.iconColor} text-lg`}>{item.icon}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-bark-900 text-sm">{item.title}</h4>
                          <p className="text-sm text-bark-500 mt-1">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AnimatedSection>

                {/* Visual — Effect Stats */}
                <AnimatedSection className="flex-1 w-full" animation="slide-left">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-bee-900 to-bee-800 rounded-3xl p-8 lg:p-10 text-white">
                      <div className="text-center mb-8">
                        <span className="material-icons-outlined text-6xl text-bee-300/80">favorite</span>
                        <h3 className="text-2xl font-bold mt-4">{t.program.healing.effectsTitle}</h3>
                        <p className="text-bee-200/70 text-sm mt-2">{t.program.healing.effectsNote}</p>
                      </div>
                      <div className="space-y-4">
                        {[
                          { label: t.program.healing.effects.emotional, value: 94 },
                          { label: t.program.healing.effects.social, value: 89 },
                          { label: t.program.healing.effects.selfEsteem, value: 87 },
                          { label: t.program.healing.effects.physical, value: 82 },
                          { label: t.program.healing.effects.lifeSatisfaction, value: 91 },
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="flex items-center justify-between text-sm mb-1.5">
                              <span className="text-bee-100">{item.label}</span>
                              <span className="font-bold text-bee-300">{item.value}%</span>
                            </div>
                            <div className="h-2 bg-bee-800/50 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-bee-400 to-bee-300 rounded-full transition-all duration-1000"
                                style={{ width: `${item.value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-bee-100 rounded-2xl -z-10 hidden sm:block" />
                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-honey-100 rounded-2xl -z-10 hidden sm:block" />
                  </div>
                </AnimatedSection>
              </div>

              {/* ── Healing Beekeeping Programs Grid ── */}
              <AnimatedSection className="text-center mb-12">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-bark-900">
                  {t.program.healing.detailTitle} <span className="text-bee-600">{t.program.healing.detailTitleHighlight}</span>
                </h3>
                <p className="mt-3 text-bark-500 max-w-xl mx-auto">
                  {t.program.healing.detailDescription}
                </p>
              </AnimatedSection>

              <div className="grid sm:grid-cols-2 gap-6">
                {healingPrograms.map((program, idx) => {
                  const isExpanded = expandedHealing === program.id;
                  return (
                    <AnimatedSection key={program.id} delay={idx * 0.1}>
                      <div className={`group bg-white rounded-2xl p-6 lg:p-8 border transition-all duration-500 h-full ${
                        isExpanded ? 'border-bee-300 shadow-xl shadow-bee-100/30' : 'border-bark-200 hover:border-bee-300 hover:shadow-xl hover:shadow-bee-100/30'
                      }`}>
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-bee-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <span className="material-icons-outlined text-bee-600 text-2xl">{program.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-bold text-bark-900 mb-1">{program.title}</h4>
                            <p className="text-xs text-bee-600 font-medium">{program.target}</p>
                          </div>
                        </div>

                        <p className="mt-4 text-sm text-bark-500 leading-relaxed">{program.desc}</p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {program.tags.map((tag: string) => (
                            <span key={tag} className="px-2.5 py-1 text-xs font-medium bg-bee-50 text-bee-700 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Expand toggle */}
                        <button
                          onClick={() => toggleHealing(program.id)}
                          className="w-full flex items-center justify-center gap-1 px-4 py-2 text-xs font-medium text-bee-700 bg-bee-50 hover:bg-bee-100 rounded-lg transition-colors mt-4"
                        >
                          <span className="material-icons-outlined text-sm" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
                            expand_more
                          </span>
                          {isExpanded ? t.program.healing.collapse : t.program.healing.expandActivities}
                        </button>

                        {/* Expanded Detail */}
                        <div
                          className="overflow-hidden transition-all duration-500"
                          style={{ maxHeight: isExpanded ? '500px' : '0px', opacity: isExpanded ? 1 : 0 }}
                        >
                          <div className="pt-4 space-y-4">
                            {/* Activities */}
                            <div>
                              <p className="text-xs font-bold text-bark-700 uppercase tracking-wider mb-2">{t.program.healing.activities}</p>
                              <div className="grid grid-cols-2 gap-2">
                                {program.activities.map((activity: string) => (
                                  <div key={activity} className="flex items-center gap-1.5 text-xs text-bark-600 bg-bark-50 p-2 rounded-lg">
                                    <span className="material-icons-outlined text-bee-500 text-xs">check</span>
                                    {activity}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Effects */}
                            <div>
                              <p className="text-xs font-bold text-bark-700 uppercase tracking-wider mb-2">{t.program.healing.expectedEffects}</p>
                              <div className="space-y-1.5">
                                {program.effects.map((effect: string) => (
                                  <div key={effect} className="flex items-center gap-2 text-xs text-bark-600">
                                    <span className="w-4 h-4 rounded-full bg-bee-100 flex items-center justify-center shrink-0">
                                      <span className="material-icons-outlined text-bee-600 text-[10px]">trending_up</span>
                                    </span>
                                    {effect}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-bark-100 text-xs text-bark-400">
                          <span className="flex items-center gap-1">
                            <span className="material-icons-outlined text-sm">schedule</span>
                            {program.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-icons-outlined text-sm">people</span>
                            {program.capacity}
                          </span>
                          <Link
                            href="/contact"
                            className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-bee-700 bg-bee-50 hover:bg-bee-100 rounded-full transition-colors"
                          >
                            {t.common.apply}
                            <span className="material-icons-outlined text-xs">arrow_forward</span>
                          </Link>
                        </div>
                      </div>
                    </AnimatedSection>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ────────────── HEALING AGRICULTURE (FARMING) SECTION ────────────── */}
          <section className="py-24 lg:py-32 bg-bark-50 relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-72 h-72 bg-bee-100/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
              <AnimatedSection className="text-center mb-16">
                <p className="text-bee-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Healing Farm</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
                  {t.program.healing.agricultureTitle} <span className="text-bee-600">{t.program.healing.agricultureTitleHighlight}</span>
                </h2>
                <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
                  {t.program.healing.agricultureDescription}
                </p>
              </AnimatedSection>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {healingAgriculturePrograms.map((program, idx) => {
                  const colors = colorMap[program.color as keyof typeof colorMap];
                  return (
                    <AnimatedSection key={program.title} delay={idx * 0.1}>
                      <div className="bg-white rounded-2xl p-6 border border-bark-200 hover:border-bee-300 hover:shadow-lg transition-all h-full flex flex-col group">
                        <div className={`w-14 h-14 rounded-2xl ${colors.lightBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <span className={`material-icons-outlined ${colors.text} text-2xl`}>{program.icon}</span>
                        </div>
                        <h4 className="text-base font-bold text-bark-900 mb-2">{program.title}</h4>
                        <p className="text-sm text-bark-500 leading-relaxed mb-4 flex-1">{program.desc}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-bark-100">
                          <span className="flex items-center gap-1 text-xs text-bark-400">
                            <span className="material-icons-outlined text-sm">schedule</span>
                            {program.duration}
                          </span>
                          <Link
                            href="/contact"
                            className={`text-xs font-bold ${colors.text} hover:underline`}
                          >
                            {t.common.inquiry} &rarr;
                          </Link>
                        </div>
                      </div>
                    </AnimatedSection>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ────────────── HEALING PHILOSOPHY ────────────── */}
          <section className="py-24 lg:py-32 bg-gradient-to-br from-bee-900 to-bee-800 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04]">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="leaf-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                    <path d="M40 0C40 22.09 22.09 40 0 40C22.09 40 40 57.91 40 80C40 57.91 57.91 40 80 40C57.91 40 40 22.09 40 0Z" fill="none" stroke="#22C55E" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#leaf-pattern)" />
              </svg>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
              <AnimatedSection className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                  {t.program.healing.philosophy.title} <span className="text-bee-300">{t.program.healing.philosophy.titleHighlight}</span>
                </h2>
              </AnimatedSection>

              <div className="grid sm:grid-cols-3 gap-8">
                {t.program.healing.philosophy.items.map((item: { title: string; desc: string }, idx: number) => {
                  const philosophyIcons = ['psychology', 'diversity_3', 'self_improvement'];
                  const itemWithIcon = { ...item, icon: philosophyIcons[idx] };
                  return itemWithIcon;
                }).map((item: { title: string; desc: string; icon: string }, idx: number) => (
                  <AnimatedSection key={item.title} delay={idx * 0.12}>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-bee-700/50 border border-bee-600/30 flex items-center justify-center mx-auto mb-5">
                        <span className="material-icons-outlined text-bee-300 text-3xl">{item.icon}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                      <p className="text-sm text-bee-200/80 leading-relaxed">{item.desc}</p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ════════════════════════════════════════════════════════════════
          COMMON SECTIONS (Both tabs)
          ════════════════════════════════════════════════════════════════ */}

      {/* ────────────── UPCOMING SCHEDULE ────────────── */}
      <section id="schedule" className="py-24 lg:py-32 bg-white scroll-mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Schedule</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
              {t.program.schedule.title}
            </h2>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-3">
              {upcomingSchedules.map((schedule, idx) => {
                const colors = colorMap[schedule.color as keyof typeof colorMap];
                return (
                  <AnimatedSection key={idx} delay={idx * 0.06}>
                    <div className="flex items-center gap-4 p-4 sm:p-5 bg-white border border-bark-200 rounded-2xl hover:shadow-lg hover:border-bark-300 transition-all group">
                      {/* Date */}
                      <div className="hidden sm:flex flex-col items-center justify-center w-16 shrink-0">
                        <span className="text-xs text-bark-400 font-medium">{schedule.date.split('.')[0]}.{schedule.date.split('.')[1]}</span>
                        <span className="text-2xl font-black text-bark-900">{schedule.date.split('.')[2]}</span>
                      </div>
                      <div className="sm:hidden shrink-0">
                        <span className="text-xs text-bark-500 font-medium">{schedule.date}</span>
                      </div>

                      {/* Divider */}
                      <div className="hidden sm:block w-px h-10 bg-bark-200" />

                      {/* Program Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-bark-900 text-sm sm:text-base truncate">{schedule.program}</h4>
                        <p className="text-xs text-bark-400 mt-0.5">{schedule.spots}</p>
                      </div>

                      {/* Status Badge */}
                      <span className={`hidden sm:inline-flex px-3 py-1 text-xs font-bold rounded-full ${colors.statusBg}`}>
                        {schedule.status}
                      </span>

                      {/* Action */}
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold text-white bg-bark-900 rounded-full hover:bg-bark-800 transition-colors shrink-0"
                      >
                        {t.common.apply}
                        <span className="material-icons-outlined text-sm">arrow_forward</span>
                      </Link>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── INSTRUCTORS ────────────── */}
      <section id="instructors" className="py-24 lg:py-32 bg-bark-50 scroll-mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Instructors</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
              {t.program.instructors.title}
            </h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructors.map((instructor: { name: string; role: string; career: string; speciality: string; icon: string; certifications: string[] }, idx: number) => (
              <AnimatedSection key={instructor.name} delay={idx * 0.1}>
                <div className="bg-white rounded-2xl p-6 border border-bark-200 hover:border-honey-300 hover:shadow-xl transition-all text-center group h-full flex flex-col">
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-honey-100 to-honey-200 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-icons-outlined text-honey-600 text-3xl">{instructor.icon}</span>
                  </div>
                  <h4 className="text-lg font-bold text-bark-900">{instructor.name}</h4>
                  <p className="text-sm text-honey-600 font-medium mt-1">{instructor.role}</p>
                  <p className="text-xs text-bark-400 mt-1">{instructor.career}</p>

                  <div className="mt-3 pt-3 border-t border-bark-100 flex-1">
                    <p className="text-xs text-bark-500 mb-2">
                      <strong className="text-bark-700">{instructor.speciality}</strong>
                    </p>
                    <div className="space-y-1">
                      {instructor.certifications.map((cert: string) => (
                        <div key={cert} className="flex items-center gap-1 text-[11px] text-bark-400">
                          <span className="material-icons-outlined text-honey-500 text-xs">verified</span>
                          {cert}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────── TESTIMONIALS ────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
              {t.program.testimonialsTitle} <span className="text-honey-600">{t.program.testimonialsTitleHighlight}</span>
            </h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial: { name: string; program: string; text: string; rating: number }, idx: number) => (
              <AnimatedSection key={idx} delay={idx * 0.08}>
                <div className="bg-bark-50 rounded-2xl p-6 border border-bark-200 h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <span key={i} className="material-icons-outlined text-honey-500 text-sm">star</span>
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="text-sm text-bark-600 leading-relaxed flex-1">&ldquo;{testimonial.text}&rdquo;</p>
                  {/* Author */}
                  <div className="mt-4 pt-3 border-t border-bark-200">
                    <p className="text-sm font-bold text-bark-900">{testimonial.name}</p>
                    <p className="text-xs text-honey-600">{testimonial.program}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────── HOW TO PARTICIPATE ────────────── */}
      <section id="process" className="py-24 lg:py-32 bg-bark-50 scroll-mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">How to Join</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
              {t.program.processTitle} <span className="text-honey-600">{t.program.processTitleHighlight}</span>
            </h2>
            <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
              {t.program.processDescription}
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step: { step: string; icon: string; title: string; desc: string }, idx: number) => (
              <AnimatedSection key={step.step} delay={idx * 0.12}>
                <div className="relative text-center group">
                  {/* Connector line */}
                  {idx < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-bark-200" />
                  )}
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-honey-50 border-2 border-honey-200 mb-6 group-hover:border-honey-400 group-hover:shadow-lg group-hover:shadow-honey-100 transition-all">
                    <span className="material-icons-outlined text-honey-600 text-2xl">{step.icon}</span>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-honey-500 text-white text-xs font-bold flex items-center justify-center">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-bark-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-bark-500">{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────── FAQ SECTION ────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
              {t.program.faqTitle} <span className="text-honey-600">{t.program.faqTitleHighlight}</span>
            </h2>
          </AnimatedSection>

          <div className="space-y-4">
            {t.program.faq.map((faq: { q: string; a: string }, idx: number) => (
              <AnimatedSection key={idx} delay={idx * 0.08}>
                <div className="bg-bark-50 rounded-2xl p-6 border border-bark-200 hover:border-bark-300 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-honey-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-honey-700 text-sm font-bold">Q</span>
                    </span>
                    <div>
                      <h4 className="font-bold text-bark-900">{faq.q}</h4>
                      <p className="mt-2 text-sm text-bark-500 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────── CTA ────────────── */}
      <section className="py-24 lg:py-32 bg-gradient-to-r from-honey-400 via-honey-500 to-farm-400 text-bark-900 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-bark-900/10 rotate-12 rounded-2xl hidden sm:block" />
        <div className="absolute bottom-10 right-10 w-40 h-40 border-2 border-bark-900/10 -rotate-12 rounded-2xl hidden sm:block" />

        <AnimatedSection className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative" animation="scale-in">
          <span className="material-icons-outlined text-5xl text-bark-900/20 mb-4 block">hive</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
            {t.program.ctaTitle}
          </h2>
          <p className="text-bark-800/70 mt-4 mb-8 max-w-xl mx-auto">
            {t.program.ctaDescription}
            <br className="hidden sm:block" />
            {t.program.ctaDescription2}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-honey-500 bg-bark-900 rounded-full hover:bg-bark-800 transition-colors shadow-lg"
            >
              {t.common.apply}
              <span className="material-icons-outlined text-lg">arrow_forward</span>
            </Link>
            <a
              href="tel:02-363-4999"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-bark-900 border-2 border-bark-900/30 rounded-full hover:bg-bark-900/10 transition-colors"
            >
              <span className="material-icons-outlined text-lg">phone</span>
              {t.common.phone} 02-363-4999
            </a>
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}
