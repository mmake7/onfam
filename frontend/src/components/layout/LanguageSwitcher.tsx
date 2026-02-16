'use client';

import { useTranslation, type Locale } from '@/context/LanguageContext';

interface LanguageSwitcherProps {
  className?: string;
  /** Compact mode for tight spaces like the top bar */
  compact?: boolean;
}

const LANG_OPTIONS: { locale: Locale; label: string; short: string }[] = [
  { locale: 'ko', label: '한국어', short: 'KO' },
  { locale: 'en', label: 'English', short: 'EN' },
];

export default function LanguageSwitcher({ className = '', compact = false }: LanguageSwitcherProps) {
  const { locale, setLocale } = useTranslation();

  const currentIndex = LANG_OPTIONS.findIndex((o) => o.locale === locale);

  return (
    <div
      className={`relative inline-flex items-center rounded-full bg-bark-800 border border-bark-700/50 p-0.5 ${className}`}
      role="radiogroup"
      aria-label="Language selection"
    >
      {/* Sliding indicator */}
      <span
        className="absolute top-0.5 h-[calc(100%-4px)] rounded-full bg-honey-400 transition-all duration-300 ease-in-out"
        style={{
          width: `calc(${100 / LANG_OPTIONS.length}% - 2px)`,
          left: `calc(${(currentIndex * 100) / LANG_OPTIONS.length}% + 2px)`,
        }}
        aria-hidden="true"
      />
      {LANG_OPTIONS.map((opt) => {
        const isActive = locale === opt.locale;
        return (
          <button
            key={opt.locale}
            onClick={() => setLocale(opt.locale)}
            role="radio"
            aria-checked={isActive}
            aria-label={opt.label}
            className={`relative z-10 flex items-center justify-center gap-1 transition-all duration-300 font-semibold select-none cursor-pointer ${
              compact
                ? 'px-2.5 py-1 text-[11px] min-w-[36px]'
                : 'px-3 py-1.5 text-xs min-w-[44px]'
            } rounded-full ${
              isActive
                ? 'text-bark-900'
                : 'text-bark-400 hover:text-bark-200'
            }`}
          >
            <span className="material-icons-outlined text-[14px] leading-none" aria-hidden="true">
              translate
            </span>
            {compact ? opt.short : opt.short}
          </button>
        );
      })}
    </div>
  );
}
