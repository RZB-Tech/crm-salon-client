import type { AppointmentStatus, FilterFieldSchema } from '@/shared/api/types';
import { APPOINTMENT_STATUS_LABELS } from '@/shared/lib/format';
import { t } from '@/shared/lib/i18n';
import { enumOptionsFromSchema } from './appointmentFilters';

export const getPaidOptions = () => [
  { value: 'true', label: t('appointments.paid') },
  { value: 'false', label: t('appointments.unpaid') },
];

export const PAID_OPTIONS = getPaidOptions;

export const getDefaultAppointmentStatusOptions = () => [
  { value: 'awaiting', label: APPOINTMENT_STATUS_LABELS.awaiting },
  { value: 'started', label: APPOINTMENT_STATUS_LABELS.started },
  { value: 'finished', label: APPOINTMENT_STATUS_LABELS.finished },
  { value: 'cancelled', label: APPOINTMENT_STATUS_LABELS.cancelled },
];

export const DEFAULT_APPOINTMENT_STATUS_OPTIONS = getDefaultAppointmentStatusOptions;

export const statusColor = (status: AppointmentStatus): string => {
  if (status === 'cancelled') return 'red';
  if (status === 'finished') return 'teal';
  if (status === 'started') return 'blue';
  return 'gray';
};

export const paidBadgeColor = (paid: boolean): string => (paid ? 'teal' : 'orange');

export const paidLabel = (paid: boolean): string =>
  paid ? t('appointments.paid') : t('appointments.unpaid');

export const resolveStatusFilterOptions = (
  field: FilterFieldSchema | undefined,
): { value: string; label: string }[] => {
  const fromSchema = enumOptionsFromSchema(field);
  if (fromSchema.length > 0) return fromSchema;
  return getDefaultAppointmentStatusOptions();
};
