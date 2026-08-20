import type { GiftCard, GiftCardCreatePayload, GiftCardUpdatePayload, PaymentMethod } from '@/shared/api/types';
import { parseApiDateFromDateTime } from '@/shared/lib/format';

export interface GiftCardFormState {
  clientId: string | null;
  initialAmount: number;
  expirationDate: string;
  paymentMethod: PaymentMethod;
}

export const emptyGiftCardForm = (): GiftCardFormState => ({
  clientId: null,
  initialAmount: 0,
  expirationDate: '',
  paymentMethod: 'cash',
});

export const giftCardToForm = (card: GiftCard): GiftCardFormState => ({
  clientId: card.client_id != null ? String(card.client_id) : null,
  initialAmount: card.initial_amount,
  expirationDate: card.expiration_date ? parseApiDateFromDateTime(card.expiration_date) : '',
  paymentMethod: 'cash',
});

export const isGiftCardFormValid = (form: GiftCardFormState, isEdit: boolean): boolean => {
  if (isEdit) return true;
  return form.initialAmount >= 1;
};

const dateToApiEndOfDay = (value: string): string | null => {
  if (!value) return null;
  return `${value}T23:59:59`;
};

export const formToCreatePayload = (form: GiftCardFormState): GiftCardCreatePayload => ({
  client_id: form.clientId ? Number(form.clientId) : null,
  initial_amount: form.initialAmount,
  issue_date: new Date().toISOString(),
  expiration_date: dateToApiEndOfDay(form.expirationDate),
  payment_method: form.paymentMethod,
});

export const formToUpdatePayload = (id: number, form: GiftCardFormState): GiftCardUpdatePayload => ({
  id,
  expiration_date: dateToApiEndOfDay(form.expirationDate),
});
