'use client';

import { useState } from 'react';
import { useScrollAnimation, useCountUp } from '@/lib/useScrollAnimation';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';

/* ── Data arrays moved inside component to access translations ── */

const ACTIVITY_BARS = [
  { h: '15%', c: 'bg-bark-700' }, { h: '10%', c: 'bg-bark-700' }, { h: '8%', c: 'bg-bark-700' },
  { h: '5%', c: 'bg-bark-700' }, { h: '5%', c: 'bg-bark-700' }, { h: '20%', c: 'bg-bark-600' },
  { h: '45%', c: 'bg-honey-600' }, { h: '65%', c: 'bg-honey-500' }, { h: '85%', c: 'bg-honey-400' },
  { h: '95%', c: 'bg-honey-400' }, { h: '100%', c: 'bg-honey-400' }, { h: '90%', c: 'bg-honey-400' },
  { h: '75%', c: 'bg-honey-500' }, { h: '80%', c: 'bg-honey-500' }, { h: '85%', c: 'bg-honey-400' },
  { h: '70%', c: 'bg-honey-500' }, { h: '50%', c: 'bg-honey-600' }, { h: '30%', c: 'bg-bark-600' },
  { h: '20%', c: 'bg-bark-700' }, { h: '15%', c: 'bg-bark-700' }, { h: '12%', c: 'bg-bark-700' },
  { h: '10%', c: 'bg-bark-700' }, { h: '12%', c: 'bg-bark-700' }, { h: '15%', c: 'bg-bark-700' },
];

/* TECH_SPECS moved inside component */

const WEIGHT_BARS = [
  { h: '40%', c: 'bg-honey-200' }, { h: '50%', c: 'bg-honey-200' }, { h: '55%', c: 'bg-honey-300' },
  { h: '65%', c: 'bg-honey-300' }, { h: '70%', c: 'bg-honey-400' }, { h: '80%', c: 'bg-honey-400' },
  { h: '90%', c: 'bg-gradient-to-t from-honey-500 to-honey-400' },
];

/* ── Helper component ── */
function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.8s ease-out ${delay}ms, transform 0.8s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Stat Counter ── */
function StatCounter({ target, suffix = '', label, icon }: { target: number; suffix?: string; label: string; icon: string }) {
  const { ref, isVisible } = useScrollAnimation();
  const count = useCountUp(target, isVisible);
  return (
    <div ref={ref} className="text-center">
      <div className="w-12 h-12 rounded-xl bg-honey-500/15 flex items-center justify-center mx-auto mb-3">
        <span className="material-icons-outlined text-honey-400 text-xl">{icon}</span>
      </div>
      <p className="text-3xl sm:text-4xl font-black text-honey-400">
        {count}{suffix}
      </p>
      <p className="text-xs sm:text-sm text-bark-400 mt-2">{label}</p>
    </div>
  );
}

/* ── SVG Illustrations ── */
function SensorIllustration() {
  return (
    <svg viewBox="0 0 240 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base board */}
      <rect x="40" y="50" width="160" height="100" rx="12" fill="#292524" stroke="#44403C" strokeWidth="2" />
      {/* Circuit traces */}
      <path d="M60 80H100M100 80V110M100 110H140" stroke="#FFC72C" strokeWidth="1" opacity="0.3" />
      <path d="M70 90H90M90 90V120" stroke="#22C55E" strokeWidth="1" opacity="0.3" />
      <path d="M150 70V100M150 100H180" stroke="#FB923C" strokeWidth="1" opacity="0.3" />
      {/* Sensor chips */}
      <rect x="55" y="65" width="24" height="18" rx="3" fill="#FFC72C" opacity="0.8" />
      <rect x="95" y="90" width="24" height="18" rx="3" fill="#22C55E" opacity="0.8" />
      <rect x="140" y="75" width="24" height="18" rx="3" fill="#FB923C" opacity="0.8" />
      {/* LEDs */}
      <circle cx="175" cy="60" r="3" fill="#4ADE80" opacity="0.9" />
      <circle cx="185" cy="60" r="3" fill="#FFC72C" opacity="0.9" />
      {/* Antenna */}
      <rect x="50" y="30" width="4" height="22" rx="2" fill="#78716C" />
      <circle cx="52" cy="28" r="4" fill="none" stroke="#78716C" strokeWidth="1.5" />
      {/* Signal waves */}
      <path d="M35 25C35 15 52 5 69 15" stroke="#FFC72C" strokeWidth="1" opacity="0.4" fill="none" />
      <path d="M40 30C40 22 52 14 64 22" stroke="#FFC72C" strokeWidth="1" opacity="0.3" fill="none" />
      {/* Solar panel indicator */}
      <rect x="160" y="125" width="30" height="15" rx="2" fill="#1C1917" stroke="#FFC72C" strokeWidth="1" opacity="0.5" />
      <line x1="165" y1="130" x2="185" y2="130" stroke="#FFC72C" strokeWidth="0.5" opacity="0.3" />
      <line x1="165" y1="133" x2="185" y2="133" stroke="#FFC72C" strokeWidth="0.5" opacity="0.3" />
      <line x1="165" y1="136" x2="185" y2="136" stroke="#FFC72C" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

/* ── Page Component ── */
export default function SolutionsPage() {
  const { t } = useTranslation();
  const [activeProduct, setActiveProduct] = useState(0);

  /* ── Section nav anchors ── */
  const SECTION_NAV = [
    { id: 'overview', label: t.solutions.hero.sectionNav.overview, icon: 'hub' },
    { id: 'products', label: t.solutions.hero.sectionNav.products, icon: 'devices' },
    { id: 'smart-control', label: t.solutions.hero.sectionNav.smartControl, icon: 'tune' },
    { id: 'nectar', label: t.solutions.hero.sectionNav.nectarMap, icon: 'map' },
    { id: 'monitoring', label: t.solutions.hero.sectionNav.monitoring, icon: 'monitoring' },
    { id: 'activity', label: t.solutions.hero.sectionNav.alertSystem, icon: 'warning' },
    { id: 'specs', label: t.solutions.hero.sectionNav.techSpecs, icon: 'precision_manufacturing' },
  ];

  /* ── Data ── */
  const QUICK_STATS = [
    { icon: 'thermostat', color: 'text-honey-400', label: t.solutions.hero.quickStats.autoTemp },
    { icon: 'map', color: 'text-bee-400', label: t.solutions.hero.quickStats.nectarMap },
    { icon: 'monitor_heart', color: 'text-farm-400', label: t.solutions.hero.quickStats.realTimeMonitoring },
    { icon: 'warning', color: 'text-red-400', label: t.solutions.hero.quickStats.swarmHornetAlert },
  ];

  const KEY_FEATURES = [
    { icon: 'device_thermostat', bgClass: 'bg-honey-100', textClass: 'text-honey-600', hoverBorderClass: 'hover:border-honey-200', title: t.solutions.overview.keyFeatures.autoTemp.title, desc: t.solutions.overview.keyFeatures.autoTemp.desc },
    { icon: 'water_drop', bgClass: 'bg-bee-100', textClass: 'text-bee-600', hoverBorderClass: 'hover:border-bee-200', title: t.solutions.overview.keyFeatures.autoFeed.title, desc: t.solutions.overview.keyFeatures.autoFeed.desc },
    { icon: 'monitoring', bgClass: 'bg-farm-100', textClass: 'text-farm-600', hoverBorderClass: 'hover:border-farm-200', title: t.solutions.overview.keyFeatures.realTimeMonitoring.title, desc: t.solutions.overview.keyFeatures.realTimeMonitoring.desc },
    { icon: 'notification_important', bgClass: 'bg-red-100', textClass: 'text-red-600', hoverBorderClass: 'hover:border-red-200', title: t.solutions.overview.keyFeatures.anomalyAlert.title, desc: t.solutions.overview.keyFeatures.anomalyAlert.desc },
  ];

  const PRODUCT_ITEMS = [
    {
      id: 'sensor',
      icon: 'sensors',
      gradient: 'from-honey-400 to-farm-500',
      shadow: 'shadow-honey-500/20',
      title: t.solutions.products.items.sensor.title,
      subtitle: t.solutions.products.items.sensor.subtitle,
      desc: t.solutions.products.items.sensor.desc,
      features: t.solutions.products.items.sensor.features,
      specs: [
        { label: t.solutions.products.items.sensor.specs.size.label, value: t.solutions.products.items.sensor.specs.size.value },
        { label: t.solutions.products.items.sensor.specs.weight.label, value: t.solutions.products.items.sensor.specs.weight.value },
        { label: t.solutions.products.items.sensor.specs.battery.label, value: t.solutions.products.items.sensor.specs.battery.value },
        { label: t.solutions.products.items.sensor.specs.comm.label, value: t.solutions.products.items.sensor.specs.comm.value },
      ],
    },
    {
      id: 'controller',
      icon: 'tune',
      gradient: 'from-bee-400 to-bee-600',
      shadow: 'shadow-bee-500/20',
      title: t.solutions.products.items.controller.title,
      subtitle: t.solutions.products.items.controller.subtitle,
      desc: t.solutions.products.items.controller.desc,
      features: t.solutions.products.items.controller.features,
      specs: [
        { label: t.solutions.products.items.controller.specs.tempRange.label, value: t.solutions.products.items.controller.specs.tempRange.value },
        { label: t.solutions.products.items.controller.specs.feedCapacity.label, value: t.solutions.products.items.controller.specs.feedCapacity.value },
        { label: t.solutions.products.items.controller.specs.power.label, value: t.solutions.products.items.controller.specs.power.value },
        { label: t.solutions.products.items.controller.specs.control.label, value: t.solutions.products.items.controller.specs.control.value },
      ],
    },
    {
      id: 'gateway',
      icon: 'router',
      gradient: 'from-farm-400 to-farm-600',
      shadow: 'shadow-farm-500/20',
      title: t.solutions.products.items.gateway.title,
      subtitle: t.solutions.products.items.gateway.subtitle,
      desc: t.solutions.products.items.gateway.desc,
      features: t.solutions.products.items.gateway.features,
      specs: [
        { label: t.solutions.products.items.gateway.specs.connection.label, value: t.solutions.products.items.gateway.specs.connection.value },
        { label: t.solutions.products.items.gateway.specs.interval.label, value: t.solutions.products.items.gateway.specs.interval.value },
        { label: t.solutions.products.items.gateway.specs.storage.label, value: t.solutions.products.items.gateway.specs.storage.value },
        { label: t.solutions.products.items.gateway.specs.size.label, value: t.solutions.products.items.gateway.specs.size.value },
      ],
    },
  ];

  const SMART_FEATURES = [
    {
      gradient: 'from-honey-400 to-farm-500',
      shadow: 'shadow-honey-500/20',
      icon: 'thermostat_auto',
      title: t.solutions.smartControl.features.autoTemp.title,
      desc: t.solutions.smartControl.features.autoTemp.desc,
      tags: t.solutions.smartControl.features.autoTemp.tags,
      tagBgClass: 'bg-honey-500/10',
      tagTextClass: 'text-honey-400',
      tagBorderClass: 'border-honey-500/20',
      hoverBorder: 'hover:border-honey-500/50',
    },
    {
      gradient: 'from-bee-400 to-bee-600',
      shadow: 'shadow-bee-500/20',
      icon: 'water_drop',
      title: t.solutions.smartControl.features.autoFeed.title,
      desc: t.solutions.smartControl.features.autoFeed.desc,
      tags: t.solutions.smartControl.features.autoFeed.tags,
      tagBgClass: 'bg-bee-500/10',
      tagTextClass: 'text-bee-400',
      tagBorderClass: 'border-bee-500/20',
      hoverBorder: 'hover:border-bee-500/50',
    },
    {
      gradient: 'from-farm-400 to-farm-600',
      shadow: 'shadow-farm-500/20',
      icon: 'smartphone',
      title: t.solutions.smartControl.features.mobileApp.title,
      desc: t.solutions.smartControl.features.mobileApp.desc,
      tags: t.solutions.smartControl.features.mobileApp.tags,
      tagBgClass: 'bg-farm-500/10',
      tagTextClass: 'text-farm-400',
      tagBorderClass: 'border-farm-500/20',
      hoverBorder: 'hover:border-farm-500/50',
    },
  ];

  const NECTAR_SOURCES = [
    { emoji: '🌸', name: t.solutions.nectarMap.nectarInfo.sources[0].name, season: t.solutions.nectarMap.nectarInfo.sources[0].season, bg: 'bg-pink-50', border: 'border-pink-100' },
    { emoji: '🌳', name: t.solutions.nectarMap.nectarInfo.sources[1].name, season: t.solutions.nectarMap.nectarInfo.sources[1].season, bg: 'bg-bee-50', border: 'border-bee-100' },
    { emoji: '🌲', name: t.solutions.nectarMap.nectarInfo.sources[2].name, season: t.solutions.nectarMap.nectarInfo.sources[2].season, bg: 'bg-amber-50', border: 'border-amber-100' },
  ];

  const TECH_SPECS = t.solutions.techSpecs.items.map((item: { title: string; specs: string[]; note: string }, idx: number) => ({
    icon: ['thermostat', 'water_drop', 'scale', 'co2', 'wifi', 'battery_charging_full'][idx],
    color: ['text-honey-600', 'text-blue-600', 'text-bark-600', 'text-bee-600', 'text-farm-600', 'text-red-600'][idx],
    title: item.title,
    specs: item.specs,
    note: item.note,
  }));

  return (
    <>
      {/* ============================================================ */}
      {/* HERO */}
      {/* ============================================================ */}
      <header className="relative overflow-hidden bg-bark-900 text-white pt-16">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-[20rem] sm:w-[30rem] h-[20rem] sm:h-[30rem] bg-honey-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-[20rem] sm:w-[40rem] h-[20rem] sm:h-[40rem] bg-bee-500/[0.08] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        {/* Honeycomb pattern */}
        <div className="absolute inset-0 opacity-[0.04]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="honeycomb-hero" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" fill="none" stroke="#FFC72C" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#honeycomb-hero)" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bark-900/50 via-transparent to-bark-900/80" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 lg:py-36">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left">
              <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-honey-500/30 text-honey-400 text-xs font-semibold tracking-wider uppercase mb-8 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-honey-400 animate-pulse" />
                {t.solutions.hero.badge}
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight animate-fade-up">
                {t.solutions.hero.titleLine1}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-honey-300 via-honey-400 to-bee-400">
                  {t.solutions.hero.titleHighlight}
                </span>
              </h1>
              <p className="mt-6 text-base sm:text-lg text-bark-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-fade-up" style={{ animationDelay: '0.15s' }}>
                {t.solutions.hero.descLine1}
                <br className="hidden sm:block" />
                {t.solutions.hero.descLine2}
              </p>

              {/* Quick stat pills */}
              <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-3 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                {QUICK_STATS.map((s) => (
                  <div key={s.label} className="flex items-center gap-2 bg-bark-800/60 backdrop-blur rounded-full px-4 py-2 border border-bark-700/50">
                    <span className={`material-icons-outlined ${s.color} text-lg`}>{s.icon}</span>
                    <span className="text-sm text-bark-300">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual - Sensor Illustration */}
            <div className="flex-1 flex items-center justify-center animate-scale-in max-w-full" style={{ animationDelay: '0.3s' }}>
              <div className="relative w-52 h-52 sm:w-72 sm:h-72 lg:w-[24rem] lg:h-[24rem]">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-honey-500/20 animate-spin-slow" />
                <div className="absolute inset-6 rounded-full border border-honey-500/15 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '20s' }} />
                <div className="absolute inset-12 rounded-full bg-gradient-to-br from-honey-500/20 to-farm-500/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-32 h-32 sm:w-44 sm:h-44">
                    <SensorIllustration />
                  </div>
                </div>
                {/* Orbiting Icons */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-bark-800 border border-honey-500/30 flex items-center justify-center shadow-lg animate-float">
                  <span className="material-icons-outlined text-honey-400 text-lg sm:text-xl">thermostat</span>
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-bark-800 border border-bee-500/30 flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                  <span className="material-icons-outlined text-bee-400 text-lg sm:text-xl">co2</span>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-bark-800 border border-farm-500/30 flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
                  <span className="material-icons-outlined text-farm-400 text-lg sm:text-xl">scale</span>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 right-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-bark-800 border border-honey-500/30 flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '1.5s' }}>
                  <span className="material-icons-outlined text-honey-400 text-lg sm:text-xl">wifi</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="relative border-t border-bark-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex overflow-x-auto scrollbar-hide gap-1 py-3">
              {SECTION_NAV.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-bark-400 hover:text-honey-400 hover:bg-bark-800/60 transition-all whitespace-nowrap"
                >
                  <span className="material-icons-outlined text-sm">{s.icon}</span>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* STATS COUNTER BAND */}
      {/* ============================================================ */}
      <section className="py-12 lg:py-16 bg-bark-900 text-white border-t border-bark-800/50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hc-stats" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.2)">
                <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" fill="none" stroke="#FFC72C" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hc-stats)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <StatCounter target={500} suffix="+" label={t.home.stats.farms} icon="hive" />
            <StatCounter target={150} suffix="+" label={t.home.stats.sensors} icon="sensors" />
            <StatCounter target={98} suffix="%" label={t.home.stats.accuracy} icon="verified" />
            <StatCounter target={24} suffix="h" label={t.home.hero.stats.monitoring} icon="schedule" />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 1: 디지털 양봉 시스템 개요 */}
      {/* ============================================================ */}
      <section id="overview" className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.solutions.overview.subtitle}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
              {t.solutions.overview.title} <span className="text-honey-600">{t.solutions.overview.titleHighlight}</span>
            </h2>
            <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
              {t.solutions.overview.description}
            </p>
          </AnimatedSection>

          {/* Architecture Diagram */}
          <AnimatedSection className="max-w-5xl mx-auto mb-16" delay={100}>
            <div className="bg-gradient-to-br from-bark-900 to-bark-800 rounded-3xl p-8 sm:p-12 border border-bark-700/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-honey-500/5 rounded-full blur-3xl" />
              <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 text-center">
                {/* Layer 1: Sensors */}
                <div className="bg-bark-800/80 rounded-2xl p-6 border border-bark-700 hover:border-honey-500/30 transition-all group">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-honey-400 to-honey-600 flex items-center justify-center mb-4 shadow-lg shadow-honey-500/20 group-hover:scale-110 transition-transform">
                    <span className="material-icons-outlined text-white text-2xl">sensors</span>
                  </div>
                  <h4 className="text-white font-bold text-sm mb-2">{t.solutions.overview.layers.sensor.title}</h4>
                  <div className="space-y-1.5 text-xs text-bark-400">
                    {t.solutions.overview.layers.sensor.items.map((item: string) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </div>

                {/* Arrow + Layer 2: Cloud (desktop) */}
                <div className="hidden sm:flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 text-honey-400">
                      <div className="w-16 h-px bg-gradient-to-r from-honey-500 to-transparent" />
                      <span className="material-icons-outlined text-2xl">sync_alt</span>
                      <div className="w-16 h-px bg-gradient-to-l from-honey-500 to-transparent" />
                    </div>
                    <div className="bg-bark-800/80 rounded-2xl p-6 border border-bark-700 hover:border-bee-500/30 transition-all group w-full">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-bee-500 to-bee-700 flex items-center justify-center mb-4 shadow-lg shadow-bee-500/20 group-hover:scale-110 transition-transform">
                        <span className="material-icons-outlined text-white text-2xl">cloud</span>
                      </div>
                      <h4 className="text-white font-bold text-sm mb-2">{t.solutions.overview.layers.cloud.title}</h4>
                      <div className="space-y-1.5 text-xs text-bark-400">
                        {t.solutions.overview.layers.cloud.items.map((item: string) => (
                          <p key={item}>{item}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Layer 2: Cloud (mobile) */}
                <div className="sm:hidden bg-bark-800/80 rounded-2xl p-6 border border-bark-700">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-bee-500 to-bee-700 flex items-center justify-center mb-4 shadow-lg shadow-bee-500/20">
                    <span className="material-icons-outlined text-white text-2xl">cloud</span>
                  </div>
                  <h4 className="text-white font-bold text-sm mb-2">{t.solutions.overview.layers.cloud.title}</h4>
                  <div className="space-y-1.5 text-xs text-bark-400">
                    {t.solutions.overview.layers.cloud.items.map((item: string) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </div>

                {/* Layer 3: User Apps */}
                <div className="bg-bark-800/80 rounded-2xl p-6 border border-bark-700 hover:border-farm-500/30 transition-all group">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-farm-400 to-farm-600 flex items-center justify-center mb-4 shadow-lg shadow-farm-500/20 group-hover:scale-110 transition-transform">
                    <span className="material-icons-outlined text-white text-2xl">smartphone</span>
                  </div>
                  <h4 className="text-white font-bold text-sm mb-2">{t.solutions.overview.layers.ui.title}</h4>
                  <div className="space-y-1.5 text-xs text-bark-400">
                    {t.solutions.overview.layers.ui.items.map((item: string) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Data flow description */}
              <div className="mt-8 bg-bark-800/50 rounded-xl p-4 border border-bark-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-icons-outlined text-honey-400 text-sm">info</span>
                  <span className="text-xs font-bold text-bark-300">{t.solutions.overview.dataFlow.label}</span>
                </div>
                <p className="text-xs text-bark-500 leading-relaxed">
                  {t.solutions.overview.dataFlow.description}
                </p>
              </div>

              {/* Legend */}
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-bark-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-honey-400" />
                  <span>{t.solutions.overview.legend.hardware}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-bee-500" />
                  <span>{t.solutions.overview.legend.software}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-farm-500" />
                  <span>{t.solutions.overview.legend.userApp}</span>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Key Features Summary */}
          <AnimatedSection delay={200}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {KEY_FEATURES.map((f) => (
                <div key={f.title} className={`bg-bark-50 rounded-2xl p-6 border border-bark-100 ${f.hoverBorderClass} hover:shadow-md transition-all group`}>
                  <div className={`w-12 h-12 rounded-xl ${f.bgClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <span className={`material-icons-outlined ${f.textClass} text-2xl`}>{f.icon}</span>
                  </div>
                  <h4 className="font-bold text-bark-900 mb-2">{f.title}</h4>
                  <p className="text-sm text-bark-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2: 제품 소개 (NEW - Interactive Product Showcase) */}
      {/* ============================================================ */}
      <section id="products" className="py-24 lg:py-32 bg-bark-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-honey-100 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-bee-50 rounded-full translate-y-1/3 -translate-x-1/4 opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.solutions.products.subtitle}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
              {t.solutions.products.title} <span className="text-honey-600">{t.solutions.products.titleHighlight}</span>
            </h2>
            <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
              {t.solutions.products.description}
            </p>
          </AnimatedSection>

          {/* Product Tabs */}
          <AnimatedSection delay={100}>
            <div className="flex justify-center mb-10">
              <div className="inline-flex bg-white rounded-2xl p-1.5 border border-bark-200 shadow-sm">
                {PRODUCT_ITEMS.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveProduct(idx)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      activeProduct === idx
                        ? 'bg-bark-900 text-honey-400 shadow-md'
                        : 'text-bark-500 hover:text-bark-700'
                    }`}
                  >
                    <span className="material-icons-outlined text-lg">{p.icon}</span>
                    <span className="hidden sm:inline">{p.title.replace('BeeOnFarm ', '')}</span>
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Active Product Detail */}
          <AnimatedSection delay={200}>
            {PRODUCT_ITEMS.map((product, idx) => (
              <div
                key={product.id}
                className={`transition-all duration-500 ${
                  activeProduct === idx ? 'opacity-100 block' : 'opacity-0 hidden'
                }`}
              >
                <div className="bg-white rounded-3xl border border-bark-200 overflow-hidden shadow-lg">
                  <div className="grid lg:grid-cols-2">
                    {/* Product Visual */}
                    <div className="bg-gradient-to-br from-bark-900 to-bark-800 p-8 lg:p-12 flex items-center justify-center relative overflow-hidden min-h-[320px]">
                      <div className="absolute inset-0 opacity-[0.04]">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <pattern id={`hc-prod-${idx}`} x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
                              <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" fill="none" stroke="#FFC72C" strokeWidth="0.5" />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill={`url(#hc-prod-${idx})`} />
                        </svg>
                      </div>
                      <div className="relative text-center">
                        <div className={`w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-3xl bg-gradient-to-br ${product.gradient} flex items-center justify-center shadow-2xl ${product.shadow} mb-6`}>
                          <span className="material-icons-outlined text-white text-5xl sm:text-6xl">{product.icon}</span>
                        </div>
                        <h3 className="text-white text-xl font-bold">{product.title}</h3>
                        <p className="text-bark-400 text-sm mt-2">{product.subtitle}</p>
                        {/* Feature badges */}
                        <div className="flex flex-wrap justify-center gap-2 mt-6">
                          {product.features.map((f) => (
                            <span key={f} className="px-3 py-1 text-xs rounded-full bg-honey-500/10 text-honey-400 border border-honey-500/20">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-8 lg:p-12">
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`w-3 h-3 rounded-full bg-gradient-to-br ${product.gradient}`} />
                        <span className="text-xs font-bold text-bark-400 tracking-wider uppercase">Product Details</span>
                      </div>
                      <h3 className="text-2xl font-bold text-bark-900 mb-4">{product.title}</h3>
                      <p className="text-bark-500 leading-relaxed mb-8">{product.desc}</p>

                      {/* Specs Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        {product.specs.map((spec) => (
                          <div key={spec.label} className="bg-bark-50 rounded-xl p-4 border border-bark-100">
                            <p className="text-xs text-bark-400 mb-1">{spec.label}</p>
                            <p className="text-sm font-bold text-bark-900">{spec.value}</p>
                          </div>
                        ))}
                      </div>

                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-bark-900 bg-honey-400 rounded-full hover:bg-honey-300 transition-colors"
                      >
                        {t.common.inquiryContact}
                        <span className="material-icons-outlined text-lg">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3: 모바일 자동제어 시스템 */}
      {/* ============================================================ */}
      <section id="smart-control" className="py-24 lg:py-32 bg-bark-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-honey-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-bee-500/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-400 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.solutions.smartControl.subtitle}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              {t.solutions.smartControl.title} <span className="text-honey-400">{t.solutions.smartControl.titleHighlight}</span> {t.solutions.smartControl.titleEnd}
            </h2>
            <p className="mt-4 text-bark-400 max-w-2xl mx-auto">
              {t.solutions.smartControl.description}
            </p>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Feature Details */}
            <AnimatedSection delay={100}>
              <div className="space-y-8">
                {SMART_FEATURES.map((f) => (
                  <div key={f.title} className={`bg-bark-800/60 rounded-2xl p-6 border border-bark-700 ${f.hoverBorder} transition-all`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center shrink-0 shadow-lg ${f.shadow}`}>
                        <span className="material-icons-outlined text-white text-xl">{f.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                        <p className="text-sm text-bark-400 leading-relaxed mb-3">{f.desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {f.tags.map((tag) => (
                            <span key={tag} className={`px-3 py-1 text-xs rounded-full ${f.tagBgClass} ${f.tagTextClass} border ${f.tagBorderClass}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Right: Phone Mockup */}
            <AnimatedSection delay={200}>
              <div className="relative">
                <div className="bg-gradient-to-br from-bark-800 to-bark-700 rounded-3xl p-8 border border-bark-600/50 overflow-hidden">
                  <div className="max-w-xs mx-auto">
                    <div className="bg-bark-900 rounded-[2rem] p-3 border-2 border-bark-600 shadow-2xl">
                      <div className="bg-bark-800 rounded-[1.5rem] overflow-hidden">
                        {/* Status Bar */}
                        <div className="flex items-center justify-between px-5 py-2 text-xs text-bark-400">
                          <span>9:41</span>
                          <div className="flex items-center gap-1">
                            <span className="material-icons-outlined text-xs">signal_cellular_alt</span>
                            <span className="material-icons-outlined text-xs">wifi</span>
                            <span className="material-icons-outlined text-xs">battery_full</span>
                          </div>
                        </div>
                        {/* App Header */}
                        <div className="px-5 py-3 bg-bark-900/50">
                          <div className="flex items-center gap-2">
                            <span className="material-icons-outlined text-honey-400 text-xl">hexagon</span>
                            <span className="text-white font-bold text-sm">BeeOnFarm</span>
                            <span className="ml-auto text-[10px] px-2 py-0.5 bg-bee-500/20 text-bee-400 rounded-full">v3.0</span>
                          </div>
                        </div>
                        {/* Dashboard Content */}
                        <div className="px-4 py-4 space-y-3">
                          {/* Temp */}
                          <div className="bg-bark-700/50 rounded-xl p-3 border border-bark-600/50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-bark-400">{t.solutions.smartControl.phone.hiveTemp}</span>
                              <span className="text-xs text-bee-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-bee-400" />
                                {t.solutions.smartControl.phone.normal}
                              </span>
                            </div>
                            <div className="flex items-end gap-1">
                              <span className="text-2xl font-black text-honey-400">35.2</span>
                              <span className="text-sm text-bark-400 mb-1">℃</span>
                            </div>
                            <div className="mt-2 h-1.5 bg-bark-600 rounded-full overflow-hidden">
                              <div className="h-full w-3/4 bg-gradient-to-r from-bee-500 to-honey-400 rounded-full" />
                            </div>
                          </div>
                          {/* Humidity */}
                          <div className="bg-bark-700/50 rounded-xl p-3 border border-bark-600/50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-bark-400">{t.solutions.smartControl.phone.humidity}</span>
                              <span className="text-xs text-bee-400">{t.solutions.smartControl.phone.optimal}</span>
                            </div>
                            <div className="flex items-end gap-1">
                              <span className="text-2xl font-black text-bee-400">62</span>
                              <span className="text-sm text-bark-400 mb-1">%</span>
                            </div>
                          </div>
                          {/* Feed status */}
                          <div className="bg-bark-700/50 rounded-xl p-3 border border-bark-600/50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-bark-400">{t.solutions.smartControl.phone.feedRemaining}</span>
                              <span className="text-xs text-farm-400">{t.solutions.smartControl.phone.refillScheduled}</span>
                            </div>
                            <div className="flex items-end gap-1">
                              <span className="text-2xl font-black text-farm-400">38</span>
                              <span className="text-sm text-bark-400 mb-1">%</span>
                            </div>
                            <div className="mt-2 h-1.5 bg-bark-600 rounded-full overflow-hidden">
                              <div className="h-full w-[38%] bg-gradient-to-r from-farm-500 to-farm-400 rounded-full" />
                            </div>
                          </div>
                          {/* Quick Actions */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-honey-500/10 rounded-lg p-2.5 text-center border border-honey-500/20">
                              <span className="material-icons-outlined text-honey-400 text-lg">thermostat</span>
                              <p className="text-xs text-honey-400 mt-1">{t.solutions.smartControl.phone.tempSetting}</p>
                            </div>
                            <div className="bg-bee-500/10 rounded-lg p-2.5 text-center border border-bee-500/20">
                              <span className="material-icons-outlined text-bee-400 text-lg">water_drop</span>
                              <p className="text-xs text-bee-400 mt-1">{t.solutions.smartControl.phone.startFeed}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Floating labels */}
                  <div className="absolute top-8 left-4 hidden sm:flex items-center gap-2 bg-bark-900/90 backdrop-blur rounded-full pl-2 pr-3 py-1.5 border border-bark-700 animate-float">
                    <div className="w-6 h-6 rounded-full bg-honey-400 flex items-center justify-center">
                      <span className="material-icons-outlined text-bark-900 text-xs">thermostat</span>
                    </div>
                    <span className="text-xs text-bark-300">{t.solutions.smartControl.phone.autoMaintain}</span>
                  </div>
                  <div className="absolute bottom-8 right-4 hidden sm:flex items-center gap-2 bg-bark-900/90 backdrop-blur rounded-full pl-2 pr-3 py-1.5 border border-bark-700 animate-float" style={{ animationDelay: '2s' }}>
                    <div className="w-6 h-6 rounded-full bg-bee-500 flex items-center justify-center">
                      <span className="material-icons-outlined text-white text-xs">water_drop</span>
                    </div>
                    <span className="text-xs text-bark-300">{t.solutions.smartControl.phone.autoFeedActive}</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4: 밀원정보 및 양봉농가 위치 서비스 */}
      {/* ============================================================ */}
      <section id="nectar" className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-bee-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.solutions.nectarMap.subtitle}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
              {t.solutions.nectarMap.title} <span className="text-bee-600">{t.solutions.nectarMap.titleHighlight}</span> {t.solutions.nectarMap.titleEnd}
            </h2>
            <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
              {t.solutions.nectarMap.description}
            </p>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Map Mockup */}
            <AnimatedSection delay={100}>
              <div className="relative bg-gradient-to-br from-bee-50 to-bark-50 rounded-3xl p-6 border border-bee-200/50 overflow-hidden">
                <div className="bg-white rounded-2xl border border-bark-200 overflow-hidden shadow-sm">
                  {/* Map header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-bark-50 border-b border-bark-200">
                    <div className="flex items-center gap-2">
                      <span className="material-icons-outlined text-bee-600 text-lg">map</span>
                      <span className="text-sm font-bold text-bark-900">{t.solutions.nectarMap.mapHeader}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-bark-400">
                      <span className="material-icons-outlined text-xs">layers</span>
                      <span>{t.solutions.nectarMap.layers}</span>
                    </div>
                  </div>
                  {/* Map body */}
                  <div className="relative h-80 bg-gradient-to-b from-bee-50 to-bee-100 p-4">
                    {/* Grid lines */}
                    <div className="absolute inset-4 opacity-10">
                      <div className="h-full w-full border border-bark-400" style={{ backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    </div>
                    {/* Nectar clusters */}
                    <div className="absolute top-8 left-12 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-pink-300/60 flex items-center justify-center border-2 border-pink-400/50 animate-pulse-glow">
                        <span className="text-xs font-bold text-pink-800">🌸</span>
                      </div>
                      <span className="text-[10px] text-bark-600 mt-1 font-medium bg-white/80 px-1.5 rounded">{t.solutions.nectarMap.cherryBlossom}</span>
                    </div>
                    <div className="absolute top-16 right-16 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-bee-300/60 flex items-center justify-center border-2 border-bee-400/50 animate-pulse-glow" style={{ animationDelay: '1s' }}>
                        <span className="text-xs font-bold text-bee-800">🌳</span>
                      </div>
                      <span className="text-[10px] text-bark-600 mt-1 font-medium bg-white/80 px-1.5 rounded">{t.solutions.nectarMap.acacia}</span>
                    </div>
                    <div className="absolute bottom-20 left-1/3 flex flex-col items-center">
                      <div className="w-11 h-11 rounded-full bg-amber-300/60 flex items-center justify-center border-2 border-amber-400/50 animate-pulse-glow" style={{ animationDelay: '2s' }}>
                        <span className="text-xs font-bold text-amber-800">🌲</span>
                      </div>
                      <span className="text-[10px] text-bark-600 mt-1 font-medium bg-white/80 px-1.5 rounded">{t.solutions.nectarMap.chestnut}</span>
                    </div>
                    {/* Farm markers */}
                    <div className="absolute top-24 left-1/2 flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-honey-400 flex items-center justify-center border-2 border-white shadow-md">
                        <span className="material-icons-outlined text-bark-900 text-sm">hive</span>
                      </div>
                      <span className="text-[10px] text-bark-700 mt-1 font-bold bg-white/90 px-1.5 rounded shadow-sm">{t.solutions.nectarMap.beekeeper1}</span>
                    </div>
                    <div className="absolute bottom-28 right-20 flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-honey-400 flex items-center justify-center border-2 border-white shadow-md">
                        <span className="material-icons-outlined text-bark-900 text-sm">hive</span>
                      </div>
                      <span className="text-[10px] text-bark-700 mt-1 font-bold bg-white/90 px-1.5 rounded shadow-sm">{t.solutions.nectarMap.beekeeper2}</span>
                    </div>
                    <div className="absolute top-12 right-1/3 flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-honey-400 flex items-center justify-center border-2 border-white shadow-md">
                        <span className="material-icons-outlined text-bark-900 text-sm">hive</span>
                      </div>
                    </div>
                    {/* Route hint */}
                    <div className="absolute bottom-16 left-16 right-20 h-px border-t-2 border-dashed border-farm-400/50" />
                    <div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-farm-400/90 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">{t.solutions.nectarMap.routeRecommendation}</div>
                  </div>
                  {/* Map legend */}
                  <div className="flex items-center justify-center gap-4 px-4 py-3 bg-bark-50 border-t border-bark-200 text-xs text-bark-500">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-pink-300 border border-pink-400" />{t.solutions.nectarMap.cherryBlossom}</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-bee-300 border border-bee-400" />{t.solutions.nectarMap.acacia}</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-300 border border-amber-400" />{t.solutions.nectarMap.chestnut}</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-honey-400 border border-honey-500" />{t.solutions.nectarMap.beeFarm}</div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Feature Description */}
            <AnimatedSection className="space-y-8" delay={200}>
              {/* Nectar source info */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-bee-400 to-bee-600 flex items-center justify-center shadow-md">
                    <span className="material-icons-outlined text-white text-xl">park</span>
                  </div>
                  <h3 className="text-xl font-bold text-bark-900">{t.solutions.nectarMap.nectarInfo.title}</h3>
                </div>
                <p className="text-bark-500 text-sm leading-relaxed mb-4">
                  {t.solutions.nectarMap.nectarInfo.desc}
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {NECTAR_SOURCES.map((n) => (
                    <div key={n.name} className={`text-center ${n.bg} rounded-xl p-3 border ${n.border}`}>
                      <p className="text-lg font-bold">{n.emoji}</p>
                      <p className="text-xs font-bold text-bark-900 mt-1">{n.name}</p>
                      <p className="text-[10px] text-bark-400">{n.season}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Beekeeper location */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-honey-400 to-farm-500 flex items-center justify-center shadow-md">
                    <span className="material-icons-outlined text-white text-xl">my_location</span>
                  </div>
                  <h3 className="text-xl font-bold text-bark-900">{t.solutions.nectarMap.farmLocation.title}</h3>
                </div>
                <p className="text-bark-500 text-sm leading-relaxed mb-4">
                  {t.solutions.nectarMap.farmLocation.desc}
                </p>
                <div className="space-y-3">
                  {[
                    { icon: 'route', color: 'text-farm-500', text: t.solutions.nectarMap.farmLocation.features[0] },
                    { icon: 'density_medium', color: 'text-bee-500', text: t.solutions.nectarMap.farmLocation.features[1] },
                    { icon: 'forum', color: 'text-honey-500', text: t.solutions.nectarMap.farmLocation.features[2] },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3 bg-bark-50 rounded-xl p-3 border border-bark-100">
                      <span className={`material-icons-outlined ${item.color} text-lg`}>{item.icon}</span>
                      <span className="text-sm text-bark-700">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5: 통합 모니터링 시스템 */}
      {/* ============================================================ */}
      <section id="monitoring" className="py-24 lg:py-32 bg-bark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-farm-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.solutions.monitoring.subtitle}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
              {t.solutions.monitoring.title} <span className="text-farm-600">{t.solutions.monitoring.titleHighlight}</span> {t.solutions.monitoring.titleEnd}
            </h2>
            <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
              {t.solutions.monitoring.description}
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1: 이상 환경 감지 */}
            <AnimatedSection delay={0}>
              <div className="bg-white rounded-3xl p-8 border border-bark-200 hover:border-honey-300 hover:shadow-xl hover:shadow-honey-100/30 transition-all duration-300 group h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-400 to-farm-500 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="material-icons-outlined text-white text-2xl">warning</span>
                </div>
                <h3 className="text-lg font-bold text-bark-900 mb-3">{t.solutions.monitoring.anomaly.title}</h3>
                <p className="text-sm text-bark-500 leading-relaxed mb-5">
                  {t.solutions.monitoring.anomaly.desc}
                </p>
                <div className="bg-bark-50 rounded-xl p-4 border border-bark-100">
                  <div className="flex items-center justify-between text-xs text-bark-400 mb-3">
                    <span>{t.solutions.monitoring.anomaly.sensorData}</span>
                    <span className="text-bee-500 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-bee-400" />
                      {t.solutions.monitoring.anomaly.statusNormal}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: t.solutions.monitoring.anomaly.temp, value: '35.2℃', w: 'w-[72%]', gradient: 'from-bee-400 to-honey-400' },
                      { label: t.solutions.monitoring.anomaly.humidity, value: '62%', w: 'w-[62%]', gradient: 'from-blue-400 to-blue-500' },
                      { label: 'CO₂', value: '420ppm', w: 'w-[42%]', gradient: 'from-bark-300 to-bark-400' },
                    ].map((d) => (
                      <div key={d.label}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-bark-600">{d.label}</span>
                          <span className="font-bold text-bark-900">{d.value}</span>
                        </div>
                        <div className="h-1.5 bg-bark-200 rounded-full overflow-hidden">
                          <div className={`h-full ${d.w} bg-gradient-to-r ${d.gradient} rounded-full`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Card 2: 꿀 수확 시기 예측 */}
            <AnimatedSection delay={100}>
              <div className="bg-white rounded-3xl p-8 border border-bark-200 hover:border-honey-300 hover:shadow-xl hover:shadow-honey-100/30 transition-all duration-300 group h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-honey-400 to-honey-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="material-icons-outlined text-white text-2xl">scale</span>
                </div>
                <h3 className="text-lg font-bold text-bark-900 mb-3">{t.solutions.monitoring.harvest.title}</h3>
                <p className="text-sm text-bark-500 leading-relaxed mb-5">
                  {t.solutions.monitoring.harvest.desc}
                </p>
                <div className="bg-bark-50 rounded-xl p-4 border border-bark-100">
                  <div className="flex items-center justify-between text-xs text-bark-400 mb-3">
                    <span>{t.solutions.monitoring.harvest.weightTrend}</span>
                    <span className="text-honey-600 font-medium">+2.3kg</span>
                  </div>
                  <div className="flex items-end justify-between gap-1.5 h-20">
                    {WEIGHT_BARS.map((b, i) => (
                      <div key={i} className={`flex-1 ${b.c} rounded-t-sm`} style={{ height: b.h }} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-bark-400 mt-2">
                    {t.solutions.monitoring.harvest.days.map((day: string) => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-xs bg-honey-50 rounded-lg p-2 border border-honey-100">
                    <span className="material-icons-outlined text-honey-600 text-sm">tips_and_updates</span>
                    <span className="text-honey-700 font-medium">{t.solutions.monitoring.harvest.harvestTip}</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Card 3: 화분 모니터링 */}
            <AnimatedSection delay={200}>
              <div className="bg-white rounded-3xl p-8 border border-bark-200 hover:border-honey-300 hover:shadow-xl hover:shadow-honey-100/30 transition-all duration-300 group h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-bee-400 to-bee-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="material-icons-outlined text-white text-2xl">filter_vintage</span>
                </div>
                <h3 className="text-lg font-bold text-bark-900 mb-3">{t.solutions.monitoring.pollen.title}</h3>
                <p className="text-sm text-bark-500 leading-relaxed mb-5">
                  {t.solutions.monitoring.pollen.desc}
                </p>
                <div className="bg-bark-50 rounded-xl p-4 border border-bark-100">
                  <div className="flex items-center justify-between text-xs text-bark-400 mb-3">
                    <span>{t.solutions.monitoring.pollen.collectionStatus}</span>
                    <span className="text-bee-600 font-medium">{t.solutions.monitoring.pollen.statusGood}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center text-sm">🌻</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-bark-600">{t.solutions.monitoring.pollen.morningCollection}</span>
                          <span className="font-bold text-bark-900">128g</span>
                        </div>
                        <div className="h-1.5 bg-bark-200 rounded-full overflow-hidden">
                          <div className="h-full w-[85%] bg-gradient-to-r from-bee-300 to-bee-500 rounded-full" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-sm">🌺</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-bark-600">{t.solutions.monitoring.pollen.afternoonCollection}</span>
                          <span className="font-bold text-bark-900">96g</span>
                        </div>
                        <div className="h-1.5 bg-bark-200 rounded-full overflow-hidden">
                          <div className="h-full w-[64%] bg-gradient-to-r from-farm-300 to-farm-500 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-xs bg-bee-50 rounded-lg p-2 border border-bee-100">
                    <span className="material-icons-outlined text-bee-600 text-sm">check_circle</span>
                    <span className="text-bee-700 font-medium">{t.solutions.monitoring.pollen.colonyStrengthGood}</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 6: 봉군 활동량 / 분봉·말벌 경고 */}
      {/* ============================================================ */}
      <section id="activity" className="py-24 lg:py-32 bg-bark-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-honey-500/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <AnimatedSection className="text-center mb-16">
            <p className="text-red-400 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.solutions.activity.subtitle}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              {t.solutions.activity.title} <span className="text-red-400">{t.solutions.activity.titleHighlight}</span>
            </h2>
            <p className="mt-4 text-bark-400 max-w-2xl mx-auto">
              {t.solutions.activity.description}
            </p>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Activity Monitoring */}
            <AnimatedSection delay={100}>
              <div className="bg-bark-800/60 rounded-3xl p-8 border border-bark-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-honey-400 to-honey-600 flex items-center justify-center">
                    <span className="material-icons-outlined text-white text-xl">pest_control</span>
                  </div>
                  <h3 className="text-xl font-bold">{t.solutions.activity.analysis.title}</h3>
                </div>
                <p className="text-bark-400 text-sm leading-relaxed mb-6">
                  {t.solutions.activity.analysis.desc}
                </p>

                {/* Activity chart */}
                <div className="bg-bark-900/50 rounded-2xl p-5 border border-bark-700/50 mb-6">
                  <div className="flex items-center justify-between text-xs text-bark-400 mb-4">
                    <span>{t.solutions.activity.analysis.chartLabel}</span>
                    <span className="text-bee-400">{t.solutions.activity.analysis.today}</span>
                  </div>
                  <div className="flex items-end justify-between gap-1 h-24">
                    {ACTIVITY_BARS.map((b, i) => (
                      <div key={i} className={`flex-1 ${b.c} rounded-t`} style={{ height: b.h }} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-bark-500 mt-2">
                    <span>00</span><span>06</span><span>12</span><span>18</span><span>24</span>
                  </div>
                </div>

                {/* Activity stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-bark-900/50 rounded-xl p-3 text-center border border-bark-700/50">
                    <p className="text-xl font-black text-honey-400">1,247</p>
                    <p className="text-[10px] text-bark-400 mt-1">{t.solutions.activity.analysis.todayCount}</p>
                  </div>
                  <div className="bg-bark-900/50 rounded-xl p-3 text-center border border-bark-700/50">
                    <p className="text-xl font-black text-bee-400">98%</p>
                    <p className="text-[10px] text-bark-400 mt-1">{t.solutions.activity.analysis.normalRatio}</p>
                  </div>
                  <div className="bg-bark-900/50 rounded-xl p-3 text-center border border-bark-700/50">
                    <p className="text-xl font-black text-bark-300">14:00</p>
                    <p className="text-[10px] text-bark-400 mt-1">{t.solutions.activity.analysis.peakTime}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Right: Alert System */}
            <AnimatedSection className="space-y-6" delay={200}>
              {/* Swarming Alert */}
              <div className="bg-bark-800/60 rounded-2xl p-6 border border-bark-700 hover:border-amber-500/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 shadow-lg">
                    <span className="material-icons-outlined text-white text-xl">swipe_up</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-white">{t.solutions.activity.swarming.title}</h3>
                      <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">ALERT</span>
                    </div>
                    <p className="text-sm text-bark-400 leading-relaxed mb-4">
                      {t.solutions.activity.swarming.desc}
                    </p>
                    <div className="bg-amber-500/10 rounded-xl p-3 border border-amber-500/20">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-icons-outlined text-amber-400 text-sm">warning</span>
                        <span className="text-xs font-bold text-amber-400">{t.solutions.activity.swarming.alertLabel}</span>
                        <span className="text-[10px] text-bark-500 ml-auto">{t.solutions.activity.swarming.alertTime}</span>
                      </div>
                      <p className="text-xs text-bark-400">{t.solutions.activity.swarming.alertDesc}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hornet Alert */}
              <div className="bg-bark-800/60 rounded-2xl p-6 border border-bark-700 hover:border-red-500/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shrink-0 shadow-lg">
                    <span className="material-icons-outlined text-white text-xl">crisis_alert</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-white">{t.solutions.activity.hornet.title}</h3>
                      <span className="px-2 py-0.5 text-[10px] rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold">DANGER</span>
                    </div>
                    <p className="text-sm text-bark-400 leading-relaxed mb-4">
                      {t.solutions.activity.hornet.desc}
                    </p>
                    <div className="bg-red-500/10 rounded-xl p-3 border border-red-500/20">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-icons-outlined text-red-400 text-sm animate-pulse">crisis_alert</span>
                        <span className="text-xs font-bold text-red-400">{t.solutions.activity.hornet.alertLabel}</span>
                        <span className="text-[10px] text-bark-500 ml-auto">{t.solutions.activity.hornet.alertTime}</span>
                      </div>
                      <p className="text-xs text-bark-400">{t.solutions.activity.hornet.alertDesc}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification channels */}
              <div className="bg-bark-800/60 rounded-2xl p-6 border border-bark-700">
                <h4 className="font-bold text-white mb-4">{t.solutions.activity.notifications.title}</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: 'smartphone', color: 'text-honey-400', label: t.solutions.activity.notifications.push },
                    { icon: 'sms', color: 'text-bee-400', label: t.solutions.activity.notifications.sms },
                    { icon: 'campaign', color: 'text-farm-400', label: t.solutions.activity.notifications.siren },
                    { icon: 'mail', color: 'text-bark-300', label: t.solutions.activity.notifications.emailReport },
                  ].map((ch) => (
                    <div key={ch.label} className="flex items-center gap-2 bg-bark-900/50 rounded-xl p-3 border border-bark-700/50">
                      <span className={`material-icons-outlined ${ch.color} text-lg`}>{ch.icon}</span>
                      <span className="text-sm text-bark-300">{ch.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TECH SPECS */}
      {/* ============================================================ */}
      <section id="specs" className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.solutions.techSpecs.subtitle}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
              {t.solutions.techSpecs.title} <span className="text-honey-600">{t.solutions.techSpecs.titleHighlight}</span>
            </h2>
            <p className="mt-4 text-bark-500 max-w-2xl mx-auto">{t.solutions.techSpecs.description}</p>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {TECH_SPECS.map((spec) => (
                <div key={spec.title} className="bg-bark-50 rounded-2xl p-6 border border-bark-100 hover:border-honey-200 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`material-icons-outlined ${spec.color} group-hover:scale-110 transition-transform`}>{spec.icon}</span>
                    <h4 className="font-bold text-bark-900 text-sm">{spec.title}</h4>
                  </div>
                  {spec.specs.map((s) => (
                    <p key={s} className="text-sm text-bark-500">{s}</p>
                  ))}
                  <p className="text-xs text-bark-400 mt-2 italic">{spec.note}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Comparison Table */}
          <AnimatedSection className="mt-16 max-w-4xl mx-auto" delay={200}>
            <div className="bg-bark-900 rounded-3xl p-8 sm:p-10 border border-bark-700/50 overflow-hidden">
              <h3 className="text-xl font-bold text-white text-center mb-8">
                {t.solutions.techSpecs.comparison.title} <span className="text-honey-400">{t.solutions.techSpecs.comparison.titleHighlight}</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-bark-700">
                      <th className="text-left py-3 px-4 text-bark-400 font-medium">{t.solutions.techSpecs.comparison.headers.item}</th>
                      <th className="text-center py-3 px-4 text-bark-400 font-medium">{t.solutions.techSpecs.comparison.headers.traditional}</th>
                      <th className="text-center py-3 px-4 text-honey-400 font-medium">{t.solutions.techSpecs.comparison.headers.beeonFarm}</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs sm:text-sm">
                    {t.solutions.techSpecs.comparison.rows.map((row: { item: string; old: string; new: string }) => (
                      <tr key={row.item} className="border-b border-bark-800">
                        <td className="py-3 px-4 text-bark-300 font-medium">{row.item}</td>
                        <td className="py-3 px-4 text-center text-bark-500">{row.old}</td>
                        <td className="py-3 px-4 text-center text-honey-400 font-medium">{row.new}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CTA SECTION */}
      {/* ============================================================ */}
      <section className="py-24 lg:py-32 bg-gradient-to-r from-honey-400 via-honey-500 to-farm-400 text-bark-900 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-bark-900/10 rotate-12 rounded-2xl hidden sm:block" />
        <div className="absolute bottom-10 right-10 w-40 h-40 border-2 border-bark-900/10 -rotate-12 rounded-2xl hidden sm:block" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-bark-900/5 rotate-45 rounded-xl hidden lg:block" />
        <AnimatedSection className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
          <span className="material-icons-outlined text-5xl sm:text-6xl text-bark-900/20 mb-6 block">hive</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
            {t.solutions.cta.titleLine1}<br />{t.solutions.cta.titleLine2}
          </h2>
          <p className="mt-6 text-bark-800/70 text-lg max-w-2xl mx-auto leading-relaxed">
            {t.solutions.cta.description}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-honey-500 bg-bark-900 rounded-full hover:bg-bark-800 transition-colors text-center shadow-lg"
            >
              {t.solutions.cta.ctaPrimary}
            </Link>
            <Link
              href="/program"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-bark-900 border-2 border-bark-900/30 rounded-full hover:bg-bark-900/10 transition-colors text-center"
            >
              {t.solutions.cta.ctaSecondary}
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}
