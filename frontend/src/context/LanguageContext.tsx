'use client';

import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from 'react';

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

/* ─── Constants ─── */
const STORAGE_KEY = 'locale';
const DEFAULT_LOCALE: Locale = 'ko';

/* ─── Locale map ─── */
const translations: Record<Locale, TranslationData> = { ko, en };

export const LOCALE_LABELS: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
};

export const LOCALES: Locale[] = ['ko', 'en'];

/* ─── Helpers ─── */
function getSavedLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && translations[saved]) return saved;
  } catch { /* SSR or storage access denied */ }
  return DEFAULT_LOCALE;
}

/* ─── Context ─── */
const LanguageContext = createContext<LanguageContextValue | null>(null);

/* ─── Provider ─── */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Restore saved language preference after hydration
  useEffect(() => {
    const saved = getSavedLocale();
    if (saved !== DEFAULT_LOCALE) {
      setLocaleState(saved);
    }
    document.documentElement.lang = saved;
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch { /* storage full or access denied */ }
    document.documentElement.lang = next;
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
