import { parseApiDateTimeParts } from '@/shared/lib/format';

/** «12.08. • 13:45» — дата записи в карточке клиента */
export const formatClientAppointmentStamp = (value: string): string => {
  const { date, hours, minutes } = parseApiDateTimeParts(value);
  const [, month, day] = date.split('-');
  const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  return `${day}.${month}. • ${time}`;
};

/** «август 2026» из ключа отчёта (`2026-08`, `2026-08-01` или уже готовой строки) */
export const formatFinanceMonth = (key: string): string => {
  const match = key.match(/^(\d{4})-(\d{2})/);
  if (!match) return key;
  const label = new Date(Number(match[1]), Number(match[2]) - 1, 1).toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric',
  });
  return label;
};
