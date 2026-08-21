import type { AbsenceType, PayrollType, Sex } from '@/shared/api/types';
import { liveLabels } from './liveLabels';

export const SEX_LABELS: Record<Sex, string> = liveLabels({
  male: 'labels.sex.male',
  female: 'labels.sex.female',
});

export const PAYROLL_TYPE_LABELS: Record<PayrollType, string> = liveLabels({
  salary: 'labels.payroll.salary',
  bonus: 'labels.payroll.bonus',
  penalty: 'labels.payroll.penalty',
  commission: 'labels.payroll.commission',
});

export const ABSENCE_TYPE_LABELS: Record<AbsenceType, string> = liveLabels({
  sick: 'labels.absence.sick',
  vacation: 'labels.absence.vacation',
  'day off': 'labels.absence.dayOff',
  weekend: 'labels.absence.weekend',
  other: 'labels.absence.other',
});

export const DAY_OF_WEEK_LABELS: Record<number, string> = liveLabels({
  1: 'labels.weekday.1',
  2: 'labels.weekday.2',
  3: 'labels.weekday.3',
  4: 'labels.weekday.4',
  5: 'labels.weekday.5',
  6: 'labels.weekday.6',
  7: 'labels.weekday.7',
});

export const MEASUREMENT_UNIT_LABELS = liveLabels({
  piece: 'labels.unit.piece',
  pack: 'labels.unit.pack',
  box: 'labels.unit.box',
  bottle: 'labels.unit.bottle',
  milliliter: 'labels.unit.milliliter',
  liter: 'labels.unit.liter',
  gramm: 'labels.unit.gramm',
  kilogram: 'labels.unit.kilogram',
});

export const PAYMENT_METHOD_LABELS = liveLabels({
  cash: 'labels.payment.cash',
  card: 'labels.payment.card',
  'bank transfer': 'labels.payment.bankTransfer',
  deposit: 'labels.payment.deposit',
  'gift card': 'labels.payment.giftCard',
});

export const APPOINTMENT_STATUS_LABELS = liveLabels({
  awaiting: 'labels.appointmentStatus.awaiting',
  started: 'labels.appointmentStatus.started',
  finished: 'labels.appointmentStatus.finished',
  cancelled: 'labels.appointmentStatus.cancelled',
});

export const RECEIPT_STATUS_LABELS = liveLabels({
  pending: 'labels.receiptStatus.pending',
  paid: 'labels.receiptStatus.paid',
  cancelled: 'labels.receiptStatus.cancelled',
});

export const APPOINTMENT_CANCELLED_REASON_LABELS = liveLabels({
  'client changed his mind': 'labels.cancelReason.changedMind',
  'mistaken input': 'labels.cancelReason.mistakenInput',
  'incorrect client': 'labels.cancelReason.incorrectClient',
  'incorrect date': 'labels.cancelReason.incorrectDate',
});

export const RECEIPT_TYPE_LABELS = liveLabels({
  appointment: 'labels.receiptType.appointment',
  'direct sale': 'labels.receiptType.directSale',
});

export const NOTIFICATION_TYPE_LABELS = liveLabels({
  reminder: 'labels.notificationType.reminder',
  other: 'labels.notificationType.other',
});

export const TRANSACTION_TYPE_LABELS = liveLabels({
  income: 'labels.transactionType.income',
  expense: 'labels.transactionType.expense',
});

export const TRANSACTION_CATEGORY_LABELS = liveLabels({
  receipt: 'labels.transactionCategory.receipt',
  'employee payment': 'labels.transactionCategory.employeePayment',
  'gift card': 'labels.transactionCategory.giftCard',
  utility: 'labels.transactionCategory.utility',
  internet: 'labels.transactionCategory.internet',
  telephone: 'labels.transactionCategory.telephone',
  other: 'labels.transactionCategory.other',
});

export const TRANSACTION_METHOD_LABELS = PAYMENT_METHOD_LABELS;

export const GIFT_CARD_STATUS_LABELS = liveLabels({
  active: 'labels.giftCardStatus.active',
  used: 'labels.giftCardStatus.used',
  expired: 'labels.giftCardStatus.expired',
  cancelled: 'labels.giftCardStatus.cancelled',
});
