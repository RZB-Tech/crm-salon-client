import { t } from '@/shared/lib/i18n';

/** Подписи читаются в момент обращения — язык переключается без пересборки объекта. */
export function liveLabels<T extends Record<string, string>>(
  keyByValue: T,
): { [K in keyof T]: string } {
  const result = {} as { [K in keyof T]: string };
  for (const value of Object.keys(keyByValue) as (keyof T)[]) {
    Object.defineProperty(result, value, {
      enumerable: true,
      get: () => t(keyByValue[value]),
    });
  }
  return result;
}
