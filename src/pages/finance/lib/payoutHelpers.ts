import type { PayoutCreatePayload, PayoutMethod, PayoutType } from '@/shared/api/types';

export const PAYOUT_TYPE_LABELS: Record<PayoutType, string> = {
  salary: 'Зарплата',
  'advance salary': 'Аванс',
  other: 'Прочее',
};

export const PAYOUT_TYPE_OPTIONS = Object.entries(PAYOUT_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const PAYOUT_METHOD_OPTIONS = [
  { value: 'cash', label: 'Наличные' },
  { value: 'card', label: 'Карта' },
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
