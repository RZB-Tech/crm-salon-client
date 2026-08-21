import type { PayoutCreatePayload, PayoutMethod, PayoutType } from '@/shared/api/types';
import { t } from '@/shared/lib/i18n';

export const PAYOUT_TYPE_LABELS: Record<PayoutType, string> = {
  get salary() {
    return t('labels.payoutType.salary');
  },
  get 'advance salary'() {
    return t('labels.payoutType.advance');
  },
  get other() {
    return t('labels.payoutType.other');
  },
};

export const PAYOUT_TYPE_OPTIONS = () =>
  (Object.entries(PAYOUT_TYPE_LABELS) as [PayoutType, string][]).map(([value, label]) => ({
    value,
    label,
  }));

export const PAYOUT_METHOD_OPTIONS = () => [
  { value: 'cash' as const, label: t('labels.payment.cash') },
  { value: 'card' as const, label: t('labels.payment.card') },
];

export interface PayoutFormState {
  payoutType: PayoutType;
  employeeId: string | null;
  method: PayoutMethod;
  amount: number;
  notes: string;
  startDate: string;
  endDate: string;
}

export const DEFAULT_PAYOUT_FORM: PayoutFormState = {
  payoutType: 'other',
  employeeId: null,
  method: 'cash',
  amount: 0,
  notes: '',
  startDate: '',
  endDate: '',
};

export const buildPayoutPayload = (form: PayoutFormState): PayoutCreatePayload | null => {
  if (!form.employeeId) return null;

  const payload: PayoutCreatePayload = {
    employee_id: Number(form.employeeId),
    type: form.payoutType,
    method: form.method,
    notes: form.notes || null,
  };

  if (form.payoutType === 'advance salary' && form.amount > 0) {
    payload.amount = form.amount;
  }

  if (form.payoutType === 'other' && form.startDate && form.endDate) {
    payload.start_date = form.startDate;
    payload.end_date = form.endDate;
  }

  return payload;
};
