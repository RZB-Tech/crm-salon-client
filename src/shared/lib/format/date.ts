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
  return local.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDate = (value: string | null): string => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('ru-RU');
};

export const formatDateTime = (value: string): string =>
  new Date(value).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

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
