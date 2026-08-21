import { t } from '@/shared/lib/i18n';

export const formatDuration = (minutes: number): string => {
  if (minutes <= 0) return t('common.dash');
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return t('services.durationMin', { n: mins });
  const hourLabel =
    hours === 1 ? t('services.durationHourOne') : t('services.durationHours', { n: hours });
  if (mins === 0) return hourLabel;
  return `${hourLabel} ${t('services.durationMinutes', { n: mins })}`;
};
