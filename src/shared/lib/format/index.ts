import type { AbsenceType, Client, Employee, PayrollType, Sex } from '@/shared/api/types';

const AVATAR_COLORS = ['#6366f1', '#8b5cf6', '#0ea5e9', '#10b981', '#ec4899', '#f59e0b'];

export const getEmployeeFullName = (
  employee: Pick<Employee, 'firstname' | 'lastname' | 'middlename'>,
): string => [employee.firstname, employee.middlename, employee.lastname].filter(Boolean).join(' ');

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

export const getClientFullName = (
  client: Pick<Client, 'firstname' | 'lastname' | 'middlename'>,
): string => [client.firstname, client.middlename, client.lastname].filter(Boolean).join(' ');

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

export const PAYROLL_TYPE_LABELS: Record<PayrollType, string> = {
  salary: 'Зарплата',
  bonus: 'Бонус',
  penalty: 'Штраф',
  commission: 'Комиссия',
};

export const PAYROLL_TYPE_OPTIONS = Object.entries(PAYROLL_TYPE_LABELS).map(([value, label]) => ({
  value: value as PayrollType,
  label,
}));

export const ABSENCE_TYPE_LABELS: Record<AbsenceType, string> = {
  sick: 'Больничный',
  vacation: 'Отпуск',
  'day off': 'Выходной',
  weekend: 'Выходные',
  other: 'Другое',
};

export const ABSENCE_TYPE_OPTIONS = Object.entries(ABSENCE_TYPE_LABELS).map(([value, label]) => ({
  value: value as AbsenceType,
  label,
}));

export const formatTime = (time: string): string => time.slice(0, 5);

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

export const toApiTime = (time: string): string => (time.length === 5 ? `${time}:00` : time);
