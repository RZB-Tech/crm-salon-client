import type { BaseEntity } from './common';
import type { PaymentMethod } from './finance';

export type GiftCardStatus = 'active' | 'expired' | 'cancelled';

export interface GiftCard extends BaseEntity {
  code: string;
  client_id: number | null;
  receipt_id: number;
  initial_amount: number;
  remain_amount: number;
  status: GiftCardStatus;
  issue_date: string;
  expiration_date: string | null;
}

export interface GiftCardCreatePayload {
  client_id?: number | null;
  initial_amount: number;
  issue_date: string;
  expiration_date?: string | null;
  payment_method: PaymentMethod;
}

export interface GiftCardUpdatePayload {
  id: number;
  expiration_date?: string | null;
  archived?: boolean | null;
}

export interface GiftCardCancelPayload {
  id: number;
  cancelled_reason: string;
}
