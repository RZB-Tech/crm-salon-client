import type { AbsenceType, Client, Employee, PayrollType, Sex } from '@/shared/api/types';


export const getEmployeeFullName = (
  employee: Pick<Employee, 'firstname' | 'lastname' | 'middlename'>
): string => [employee.firstname, employee.middlename, employee.lastname].filter(Boolean).join(' ');

export const getEmployeeInitials = (employee: Pick<Employee, 'firstname' | 'lastname'>): string => {
  const first = employee.firstname.charAt(0).toUpperCase();
  const last = employee.lastname?.charAt(0).toUpperCase() ?? '';
  return `${first}${last}` || first;
};

export const formatPrice = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('ru-RU').format(num) + ' сум';
};

export const getClientFullName = (
  client: Pick<Client, 'firstname' | 'lastname'> & { middlename?: string | null }
): string => [client.firstname, client.middlename, client.lastname].filter(Boolean).join(' ');

export const getClientInitials = (client: Pick<Client, 'firstname' | 'lastname'>): string =>
  getEmployeeInitials(client);

export const SEX_LABELS: Record<Sex, string> = {
  male: 'Мужской',
  female: 'Женский'
};

export const SEX_OPTIONS = [
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' }
] as const;

export const PAYROLL_TYPE_LABELS: Record<PayrollType, string> = {
  salary: 'Зарплата',
  bonus: 'Бонус',
  penalty: 'Штраф',
  commission: 'Комиссия'
};

export const PAYROLL_TYPE_OPTIONS = Object.entries(PAYROLL_TYPE_LABELS).map(([value, label]) => ({
  value: value as PayrollType,
  label
}));

export const ABSENCE_TYPE_LABELS: Record<AbsenceType, string> = {
  sick: 'Больничный',
  vacation: 'Отпуск',
  'day off': 'Выходной',
  weekend: 'Выходные',
  other: 'Другое'
};

export const ABSENCE_TYPE_OPTIONS = Object.entries(ABSENCE_TYPE_LABELS).map(([value, label]) => ({
  value: value as AbsenceType,
  label
}));

export const DAY_OF_WEEK_LABELS: Record<number, string> = {
  1: 'Пн',
  2: 'Вт',
  3: 'Ср',
  4: 'Чт',
  5: 'Пт',
  6: 'Сб',
  7: 'Вс',
};

export const DAY_OF_WEEK_OPTIONS = Object.entries(DAY_OF_WEEK_LABELS).map(([value, label]) => ({
  value,
  label,
}));

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
      minutes: fallback.getMinutes()
    };
  }

  return {
    date: match[1],
    hours: Number(match[2]),
    minutes: Number(match[3])
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
    minute: '2-digit'
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
    minute: '2-digit'
  });

export const MEASUREMENT_UNIT_LABELS: Record<string, string> = {
  piece: 'шт.',
  pack: 'уп.',
  box: 'кор.',
  bottle: 'фл.',
  milliliter: 'мл',
  liter: 'л',
  gramm: 'г',
  kilogram: 'кг'
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: 'Наличные',
  card: 'Карта',
  'bank transfer': 'Банковский перевод',
  deposit: 'Депозит',
};

export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  awaiting: 'Ожидание',
  started: 'Начата',
  finished: 'Завершена',
  cancelled: 'Отменена',
};

export const APPOINTMENT_STATUS_OPTIONS = [
  { value: 'awaiting', label: 'Ожидание' },
  { value: 'started', label: 'Начата' },
  { value: 'finished', label: 'Завершена' },
];

export const PAYMENT_METHOD_OPTIONS = Object.entries(PAYMENT_METHOD_LABELS).map(
  ([value, label]) => ({ value, label })
);

export const RECEIPT_STATUS_LABELS: Record<string, string> = {
  pending: 'Ожидает оплаты',
  paid: 'Оплачен',
  cancelled: 'Отменён'
};

export const APPOINTMENT_CANCELLED_REASON_LABELS: Record<string, string> = {
  'client changed his mind': 'Клиент передумал',
  'mistaken input': 'Ошибочный ввод',
  'incorrect client': 'Некорректный клиент',
  'incorrect date': 'Некорректная дата',
};

export const APPOINTMENT_CANCELLED_REASON_OPTIONS = Object.entries(
  APPOINTMENT_CANCELLED_REASON_LABELS,
).map(([value, label]) => ({ value, label }));

export const RECEIPT_TYPE_LABELS: Record<string, string> = {
  appointment: 'По записи',
  'direct sale': 'Прямая продажа'
};

export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  reminder: 'Напоминание',
  other: 'Другое'
};

export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  income: 'Доход',
  expense: 'Расход'
};

export const TRANSACTION_TYPE_OPTIONS = Object.entries(TRANSACTION_TYPE_LABELS).map(
  ([value, label]) => ({ value, label })
);

export const TRANSACTION_CATEGORY_LABELS: Record<string, string> = {
  receipt: 'Оплата чека',
  'employee payment': 'Выплата сотруднику',
  utility: 'Коммунальные',
  internet: 'Интернет',
  telephone: 'Телефон',
  other: 'Прочее'
};

export const MANUAL_TRANSACTION_CATEGORY_OPTIONS = [
  { value: 'utility', label: 'Коммунальные' },
  { value: 'internet', label: 'Интернет' },
  { value: 'telephone', label: 'Телефон' },
  { value: 'other', label: 'Прочее' }
] as const;

export const TRANSACTION_METHOD_LABELS: Record<string, string> = {
  cash: 'Наличные',
  card: 'Карта',
  'bank transfer': 'Банковский перевод',
  deposit: 'Депозит'
};

export const TRANSACTION_METHOD_OPTIONS = Object.entries(TRANSACTION_METHOD_LABELS).map(
  ([value, label]) => ({ value, label })
);

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
