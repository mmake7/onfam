'use client';

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';

import ko from '../../locales/ko.json';
import en from '../../locales/en.json';

/* ─── Types ─── */
export type Locale = 'ko' | 'en';

type TranslationData = typeof ko;

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationData;
}

/* ─── Locale map ─── */
const translations: Record<Locale, TranslationData> = { ko, en };

export const LOCALE_LABELS: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
};

export const LOCALES: Locale[] = ['ko', 'en'];

/* ─── Context ─── */
const LanguageContext = createContext<LanguageContextValue | null>(null);

/* ─── Provider ─── */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('locale') as Locale | null;
      if (saved && translations[saved]) return saved;
    }
    return 'ko';
  });

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', next);
      document.documentElement.lang = next;
    }
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, setLocale, t: translations[locale] }),
    [locale, setLocale],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/* ─── Hooks ─── */

/** Access translations for the current locale. */
export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useTranslation must be used within a LanguageProvider');
  return ctx;
}
