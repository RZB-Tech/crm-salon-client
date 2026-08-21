export const LOCALES = ['ru', 'uz'] as const;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_STORAGE_KEY = 'salon-locale';

export const LOCALE_LABELS: Record<Locale, string> = {
  ru: 'RU',
  uz: 'UZ',
};

export const isLocale = (value: unknown): value is Locale =>
  value === 'ru' || value === 'uz';
