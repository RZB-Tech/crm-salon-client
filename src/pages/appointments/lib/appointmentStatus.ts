import type { AppointmentStatus, FilterFieldSchema } from '@/shared/api/types';
import { enumOptionsFromSchema } from './appointmentFilters';

export const PAID_OPTIONS = [
  { value: 'true', label: 'Оплачено' },
  { value: 'false', label: 'Не оплачено' },
];

export const DEFAULT_APPOINTMENT_STATUS_OPTIONS = [
  { value: 'awaiting', label: 'Ожидание' },
  { value: 'started', label: 'Начата' },
  { value: 'finished', label: 'Завершена' },
  { value: 'cancelled', label: 'Отменена' },
];

export const statusColor = (status: AppointmentStatus): string => {
  if (status === 'cancelled') return 'red';
  if (status === 'finished') return 'teal';
  if (status === 'started') return 'blue';
  return 'gray';
};

export const paidBadgeColor = (paid: boolean): string => (paid ? 'teal' : 'orange');

export const paidLabel = (paid: boolean): string => (paid ? 'Оплачено' : 'Не оплачено');

export const resolveStatusFilterOptions = (
  field: FilterFieldSchema | undefined,
): { value: string; label: string }[] => {
  const fromSchema = enumOptionsFromSchema(field);
  if (fromSchema.length > 0) return fromSchema;
  return DEFAULT_APPOINTMENT_STATUS_OPTIONS;
};
