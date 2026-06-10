import type { Client, Employee, PaymentType, Sex } from '@/shared/api/types';

const AVATAR_COLORS = ['#6366f1', '#8b5cf6', '#0ea5e9', '#10b981', '#ec4899', '#f59e0b'];

export const getEmployeeFullName = (employee: Pick<Employee, 'firstname' | 'lastname' | 'middlename'>): string =>
  [employee.firstname, employee.middlename, employee.lastname].filter(Boolean).join(' ');

export const getEmployeeInitials = (employee: Pick<Employee, 'firstname' | 'lastname'>): string => {
  const first = employee.firstname.charAt(0).toUpperCase();
  const last = employee.lastname?.charAt(0).toUpperCase() ?? '';
  return `${first}${last}` || first;
};

export const getEmployeeColor = (id: number): string => AVATAR_COLORS[id % AVATAR_COLORS.length];

export const getEmployeeLightColor = (color: string): string =>
  `color-mix(in srgb, ${color} 12%, white)`;

export const formatPrice = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('ru-RU').format(num) + ' сум';
};

export const ensureArray = <T>(value: unknown): T[] =>
  Array.isArray(value) ? (value as T[]) : [];

export const DAY_OF_WEEK_LABELS: Record<number, string> = {
  0: 'Понедельник',
  1: 'Вторник',
  2: 'Среда',
  3: 'Четверг',
  4: 'Пятница',
  5: 'Суббота',
  6: 'Воскресенье',
};

export const getClientFullName = (client: Pick<Client, 'firstname' | 'lastname' | 'middlename'>): string =>
  [client.firstname, client.middlename, client.lastname].filter(Boolean).join(' ');

export const getClientInitials = (client: Pick<Client, 'firstname' | 'lastname'>): string =>
  getEmployeeInitials(client);

export const SEX_LABELS: Record<Sex, string> = {
  male: 'Мужской',
  female: 'Женский',
};

export const SEX_OPTIONS = [
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
] as const;

export const PAYMENT_TYPE_LABELS: Record<string, string> = {
  salary: 'Зарплата',
  bonus: 'Бонус',
  penalty: 'Штраф',
  'percent from services': 'Процент от услуг',
  'percent from sefl services': 'Процент от своих услуг',
  'percent from sales': 'Процент от продаж',
  'percent from self sales': 'Процент от своих продаж',
  'precent from attracting client': 'Процент за привлечение клиента',
  'precent from developing client': 'Процент за развитие клиента',
};

export const PAYMENT_TYPE_OPTIONS: { value: PaymentType; label: string }[] = Object.entries(
  PAYMENT_TYPE_LABELS,
).map(([value, label]) => ({ value: value as PaymentType, label }));

export const DAY_OF_WEEK_OPTIONS = Object.entries(DAY_OF_WEEK_LABELS).map(([value, label]) => ({
  value: String(value),
  label,
}));

export const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const formatTime = (time: string): string => time.slice(0, 5);
