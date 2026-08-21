import { getDateLocale, t } from '@/shared/lib/i18n';

export const formatTime = (time: string): string => time.slice(0, 5);

const API_DATETIME_RE = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})/;

export interface ApiDateTimeParts {
  date: string;
  hours: number;
  minutes: number;
}

/** Парсит datetime с API как «настенное» время салона, без сдвига UTC → local. */
export const parseApiDateTimeParts = (value: string): ApiDateTimeParts => {
  const match = value.match(API_DATETIME_RE);
  if (!match) {
    const fallback = new Date(value);
    return {
      date: toDateInput(fallback),
      hours: fallback.getHours(),
      minutes: fallback.getMinutes(),
    };
  }

  return {
    date: match[1],
    hours: Number(match[2]),
    minutes: Number(match[3]),
  };
};

export const parseApiDateFromDateTime = (value: string): string =>
  parseApiDateTimeParts(value).date;

export const parseApiTimeFromDateTime = (value: string): string => {
  const { hours, minutes } = parseApiDateTimeParts(value);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export const formatAppointmentDateTime = (value: string): string => {
  const { date, hours, minutes } = parseApiDateTimeParts(value);
  const [year, month, day] = date.split('-').map(Number);
  const local = new Date(year, month - 1, day, hours, minutes);
  return local.toLocaleString(getDateLocale(), {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDate = (value: string | null): string => {
  if (!value) return t('common.dash');
  return new Date(value).toLocaleDateString(getDateLocale());
};

export const formatDateTime = (value: string): string =>
  new Date(value).toLocaleString(getDateLocale(), {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

const padTime = (hours: number, minutes: number) =>
  `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

const isTimezoneAware = (value: string): boolean =>
  /[zZ]|[+-]\d{2}:\d{2}$/.test(value.trim());

/** Для уведомлений с TZ — локальные часы салона; иначе настенное время из API. */
const parseNotificationDateTimeParts = (value: string): ApiDateTimeParts => {
  if (isTimezoneAware(value)) {
    const local = new Date(value);
    if (!Number.isNaN(local.getTime())) {
      return {
        date: toDateInput(local),
        hours: local.getHours(),
        minutes: local.getMinutes(),
      };
    }
  }

  return parseApiDateTimeParts(value);
};

/** Попап уведомления: `16.08.2026. • 12:30` */
export const formatNotificationAlertStamp = (value: string): string => {
  const { date, hours, minutes } = parseNotificationDateTimeParts(value);
  const [year, month, day] = date.split('-');
  return `${day}.${month}.${year}. • ${padTime(hours, minutes)}`;
};

/** Список в колокольчике: `23 Мая 14:09` */
export const formatNotificationListStamp = (value: string): string => {
  const { date, hours, minutes } = parseNotificationDateTimeParts(value);
  const [, month, day] = date.split('-').map(Number);
  return `${day} ${t(`labels.months.${month}`)} ${padTime(hours, minutes)}`;
};

export const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const toDateInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const toApiTime = (time: string): string => {
  if (!time) return '00:00';
  return time.slice(0, 5);
};
