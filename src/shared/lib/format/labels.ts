import type { AbsenceType, PayrollType, Sex } from '@/shared/api/types';
import { t } from '@/shared/lib/i18n';

export const SEX_LABELS: Record<Sex, string> = {
  get male() {
    return t('labels.sex.male');
  },
  get female() {
    return t('labels.sex.female');
  },
};

export const PAYROLL_TYPE_LABELS: Record<PayrollType, string> = {
  get salary() {
    return t('labels.payroll.salary');
  },
  get bonus() {
    return t('labels.payroll.bonus');
  },
  get penalty() {
    return t('labels.payroll.penalty');
  },
  get commission() {
    return t('labels.payroll.commission');
  },
};

export const ABSENCE_TYPE_LABELS: Record<AbsenceType, string> = {
  get sick() {
    return t('labels.absence.sick');
  },
  get vacation() {
    return t('labels.absence.vacation');
  },
  get 'day off'() {
    return t('labels.absence.dayOff');
  },
  get weekend() {
    return t('labels.absence.weekend');
  },
  get other() {
    return t('labels.absence.other');
  },
};

export const DAY_OF_WEEK_LABELS: Record<number, string> = {
  get 1() {
    return t('labels.weekday.1');
  },
  get 2() {
    return t('labels.weekday.2');
  },
  get 3() {
    return t('labels.weekday.3');
  },
  get 4() {
    return t('labels.weekday.4');
  },
  get 5() {
    return t('labels.weekday.5');
  },
  get 6() {
    return t('labels.weekday.6');
  },
  get 7() {
    return t('labels.weekday.7');
  },
};

export const MEASUREMENT_UNIT_LABELS: Record<string, string> = {
  get piece() {
    return t('labels.unit.piece');
  },
  get pack() {
    return t('labels.unit.pack');
  },
  get box() {
    return t('labels.unit.box');
  },
  get bottle() {
    return t('labels.unit.bottle');
  },
  get milliliter() {
    return t('labels.unit.milliliter');
  },
  get liter() {
    return t('labels.unit.liter');
  },
  get gramm() {
    return t('labels.unit.gramm');
  },
  get kilogram() {
    return t('labels.unit.kilogram');
  },
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  get cash() {
    return t('labels.payment.cash');
  },
  get card() {
    return t('labels.payment.card');
  },
  get 'bank transfer'() {
    return t('labels.payment.bankTransfer');
  },
  get deposit() {
    return t('labels.payment.deposit');
  },
  get 'gift card'() {
    return t('labels.payment.giftCard');
  },
};

export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  get awaiting() {
    return t('labels.appointmentStatus.awaiting');
  },
  get started() {
    return t('labels.appointmentStatus.started');
  },
  get finished() {
    return t('labels.appointmentStatus.finished');
  },
  get cancelled() {
    return t('labels.appointmentStatus.cancelled');
  },
};

export const RECEIPT_STATUS_LABELS: Record<string, string> = {
  get pending() {
    return t('labels.receiptStatus.pending');
  },
  get paid() {
    return t('labels.receiptStatus.paid');
  },
  get cancelled() {
    return t('labels.receiptStatus.cancelled');
  },
};

export const APPOINTMENT_CANCELLED_REASON_LABELS: Record<string, string> = {
  get 'client changed his mind'() {
    return t('labels.cancelReason.changedMind');
  },
  get 'mistaken input'() {
    return t('labels.cancelReason.mistakenInput');
  },
  get 'incorrect client'() {
    return t('labels.cancelReason.incorrectClient');
  },
  get 'incorrect date'() {
    return t('labels.cancelReason.incorrectDate');
  },
};

export const RECEIPT_TYPE_LABELS: Record<string, string> = {
  get appointment() {
    return t('labels.receiptType.appointment');
  },
  get 'direct sale'() {
    return t('labels.receiptType.directSale');
  },
};

export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  get reminder() {
    return t('labels.notificationType.reminder');
  },
  get other() {
    return t('labels.notificationType.other');
  },
};

export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  get income() {
    return t('labels.transactionType.income');
  },
  get expense() {
    return t('labels.transactionType.expense');
  },
};

export const TRANSACTION_CATEGORY_LABELS: Record<string, string> = {
  get receipt() {
    return t('labels.transactionCategory.receipt');
  },
  get 'employee payment'() {
    return t('labels.transactionCategory.employeePayment');
  },
  get 'gift card'() {
    return t('labels.transactionCategory.giftCard');
  },
  get utility() {
    return t('labels.transactionCategory.utility');
  },
  get internet() {
    return t('labels.transactionCategory.internet');
  },
  get telephone() {
    return t('labels.transactionCategory.telephone');
  },
  get other() {
    return t('labels.transactionCategory.other');
  },
};

export const TRANSACTION_METHOD_LABELS: Record<string, string> = {
  get cash() {
    return t('labels.payment.cash');
  },
  get card() {
    return t('labels.payment.card');
  },
  get 'bank transfer'() {
    return t('labels.payment.bankTransfer');
  },
  get deposit() {
    return t('labels.payment.deposit');
  },
  get 'gift card'() {
    return t('labels.payment.giftCard');
  },
};

export const GIFT_CARD_STATUS_LABELS: Record<string, string> = {
  get active() {
    return t('labels.giftCardStatus.active');
  },
  get used() {
    return t('labels.giftCardStatus.used');
  },
  get expired() {
    return t('labels.giftCardStatus.expired');
  },
  get cancelled() {
    return t('labels.giftCardStatus.cancelled');
  },
};
