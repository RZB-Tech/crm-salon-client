import type { Locale } from './locale';
import { dictionaries } from './dictionaries';
import { lookupMessage } from './lookup';
import { readStoredLocale, writeStoredLocale } from './storage';

type Translate = (key: string, vars?: Record<string, string | number>) => string;

let currentLocale: Locale = readStoredLocale();

export const t: Translate = (key, vars) =>
  lookupMessage(dictionaries[currentLocale], dictionaries.ru, key, vars);

export const getLocale = (): Locale => currentLocale;

export const getDateLocale = (): string => (currentLocale === 'uz' ? 'uz-UZ' : 'ru-RU');

export const getDayjsLocale = (): string => (currentLocale === 'uz' ? 'uz-latn' : 'ru');

export const getCollatorLocale = (): string => (currentLocale === 'uz' ? 'uz' : 'ru');

export const applyDocumentLocale = (locale: Locale) => {
  currentLocale = locale;
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale === 'uz' ? 'uz' : 'ru';
  }
};

applyDocumentLocale(currentLocale);

export { writeStoredLocale };
export type { Translate };
