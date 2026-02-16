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

  return (
    <div
      className={`inline-flex items-center gap-1 ${compact ? 'text-xs' : 'text-sm'} ${className}`}
      role="radiogroup"
      aria-label="Language selection"
    >
      {LANG_OPTIONS.map((opt, idx) => {
        const isActive = locale === opt.locale;
        return (
          <span key={opt.locale} className="inline-flex items-center">
            <button
              onClick={() => setLocale(opt.locale)}
              role="radio"
              aria-checked={isActive}
              aria-label={opt.label}
              className={`transition-colors duration-200 select-none cursor-pointer ${
                isActive
                  ? 'font-bold text-white'
                  : 'font-normal text-bark-400 hover:text-bark-200'
              }`}
            >
              {opt.short}
            </button>
            {idx < LANG_OPTIONS.length - 1 && (
              <span className="text-bark-500 mx-1" aria-hidden="true">|</span>
            )}
          </span>
        );
      })}
    </div>
  );
}
