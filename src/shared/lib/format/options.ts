import type { AbsenceType, PayrollType } from '@/shared/api/types';
import {
  ABSENCE_TYPE_LABELS,
  APPOINTMENT_CANCELLED_REASON_LABELS,
  APPOINTMENT_STATUS_LABELS,
  DAY_OF_WEEK_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYROLL_TYPE_LABELS,
  SEX_LABELS,
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_METHOD_LABELS,
  TRANSACTION_TYPE_LABELS,
} from './labels';

export const getSexOptions = () => [
  { value: 'male' as const, label: SEX_LABELS.male },
  { value: 'female' as const, label: SEX_LABELS.female },
];

export const getPayrollTypeOptions = () =>
  Object.entries(PAYROLL_TYPE_LABELS).map(([value, label]) => ({
    value: value as PayrollType,
    label,
  }));

export const getAbsenceTypeOptions = () =>
  Object.entries(ABSENCE_TYPE_LABELS).map(([value, label]) => ({
    value: value as AbsenceType,
    label,
  }));

export const getDayOfWeekOptions = () =>
  Object.entries(DAY_OF_WEEK_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

export const getAppointmentStatusOptions = () => [
  { value: 'awaiting', label: APPOINTMENT_STATUS_LABELS.awaiting },
  { value: 'started', label: APPOINTMENT_STATUS_LABELS.started },
  { value: 'finished', label: APPOINTMENT_STATUS_LABELS.finished },
];

export const getPaymentMethodOptions = () =>
  Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => ({ value, label }));

export const getGiftCardPurchaseMethodOptions = () =>
  getPaymentMethodOptions().filter((item) => item.value !== 'gift card');

export const getAppointmentCancelledReasonOptions = () =>
  Object.entries(APPOINTMENT_CANCELLED_REASON_LABELS).map(([value, label]) => ({ value, label }));

export const getManualTransactionCategoryOptions = () => [
  { value: 'utility', label: TRANSACTION_CATEGORY_LABELS.utility },
  { value: 'internet', label: TRANSACTION_CATEGORY_LABELS.internet },
  { value: 'telephone', label: TRANSACTION_CATEGORY_LABELS.telephone },
  { value: 'other', label: TRANSACTION_CATEGORY_LABELS.other },
];

export const getTransactionTypeOptions = () =>
  Object.entries(TRANSACTION_TYPE_LABELS).map(([value, label]) => ({ value, label }));

export const getTransactionMethodOptions = () =>
  Object.entries(TRANSACTION_METHOD_LABELS)
    .filter(([value]) => value !== 'gift card')
    .map(([value, label]) => ({ value, label }));

export const SEX_OPTIONS = getSexOptions;
export const PAYROLL_TYPE_OPTIONS = getPayrollTypeOptions;
export const ABSENCE_TYPE_OPTIONS = getAbsenceTypeOptions;
export const DAY_OF_WEEK_OPTIONS = getDayOfWeekOptions;
export const APPOINTMENT_STATUS_OPTIONS = getAppointmentStatusOptions;
export const PAYMENT_METHOD_OPTIONS = getPaymentMethodOptions;
export const GIFT_CARD_PURCHASE_METHOD_OPTIONS = getGiftCardPurchaseMethodOptions;
export const APPOINTMENT_CANCELLED_REASON_OPTIONS = getAppointmentCancelledReasonOptions;
export const MANUAL_TRANSACTION_CATEGORY_OPTIONS = getManualTransactionCategoryOptions;
export const TRANSACTION_TYPE_OPTIONS = getTransactionTypeOptions;
export const TRANSACTION_METHOD_OPTIONS = getTransactionMethodOptions;

