import type { AbsenceType, PayrollType } from '@/shared/api/types';
import {
  ABSENCE_TYPE_LABELS,
  APPOINTMENT_CANCELLED_REASON_LABELS,
  APPOINTMENT_STATUS_LABELS,
  DAY_OF_WEEK_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYROLL_TYPE_LABELS,
  SEX_LABELS,
  TRANSACTION_METHOD_LABELS,
  TRANSACTION_TYPE_LABELS,
} from './labels';

export const SEX_OPTIONS = [
  { value: 'male', label: SEX_LABELS.male },
  { value: 'female', label: SEX_LABELS.female },
] as const;

export const PAYROLL_TYPE_OPTIONS = Object.entries(PAYROLL_TYPE_LABELS).map(([value, label]) => ({
  value: value as PayrollType,
  label,
}));

export const ABSENCE_TYPE_OPTIONS = Object.entries(ABSENCE_TYPE_LABELS).map(([value, label]) => ({
  value: value as AbsenceType,
  label,
}));

export const DAY_OF_WEEK_OPTIONS = Object.entries(DAY_OF_WEEK_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const APPOINTMENT_STATUS_OPTIONS = [
  { value: 'awaiting', label: APPOINTMENT_STATUS_LABELS.awaiting },
  { value: 'started', label: APPOINTMENT_STATUS_LABELS.started },
  { value: 'finished', label: APPOINTMENT_STATUS_LABELS.finished },
];

export const PAYMENT_METHOD_OPTIONS = Object.entries(PAYMENT_METHOD_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export const APPOINTMENT_CANCELLED_REASON_OPTIONS = Object.entries(
  APPOINTMENT_CANCELLED_REASON_LABELS,
).map(([value, label]) => ({ value, label }));

export const MANUAL_TRANSACTION_CATEGORY_OPTIONS = [
  { value: 'utility', label: 'Коммунальные' },
  { value: 'internet', label: 'Интернет' },
  { value: 'telephone', label: 'Телефон' },
  { value: 'other', label: 'Прочее' },
] as const;

export const TRANSACTION_TYPE_OPTIONS = Object.entries(TRANSACTION_TYPE_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export const TRANSACTION_METHOD_OPTIONS = Object.entries(TRANSACTION_METHOD_LABELS).map(
  ([value, label]) => ({ value, label }),
);
