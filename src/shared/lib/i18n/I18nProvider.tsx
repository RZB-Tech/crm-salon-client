import React from 'react';
import type { Locale } from './locale';
import { dictionaries } from './dictionaries';
import { lookupMessage } from './lookup';
import { applyDocumentLocale, writeStoredLocale, type Translate } from './runtime';
import { readStoredLocale } from './storage';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translate;
}

const I18nContext = React.createContext<I18nContextValue | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = React.useState<Locale>(() => {
    const initial = readStoredLocale();
    applyDocumentLocale(initial);
    return initial;
  });

  const setLocale = React.useCallback((next: Locale) => {
    applyDocumentLocale(next);
    writeStoredLocale(next);
    setLocaleState(next);
  }, []);

  const value = React.useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, vars) => lookupMessage(dictionaries[locale], dictionaries.ru, key, vars),
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  const ctx = React.useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
};
