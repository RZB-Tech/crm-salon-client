import { isLocale, LOCALE_STORAGE_KEY, type Locale } from './locale';

export const readStoredLocale = (): Locale => {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    /* ignore */
  }
  return 'ru';
};

export const writeStoredLocale = (locale: Locale): void => {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
};
