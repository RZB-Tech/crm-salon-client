import type { BaseEntity } from './common';
import type { Payroll } from './employee';

export type ReceiptType = 'appointment' | 'direct sale';
export type ReceiptStatus = 'pending' | 'paid' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'bank transfer' | 'deposit';

export interface ReceiptItem extends BaseEntity {
  material_id: number | null;
  appointment_service_id: number | null;
  price: number;
  quantity: number;
  notes: string | null;
  subtotal: number;
}

export interface Receipt extends BaseEntity {
  receipt_type: ReceiptType;
  appointment_id: number | null;
  client_id: number | null;
  items: ReceiptItem[];
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  status: ReceiptStatus;
  change_amount: number;
  change_to_deposit: boolean;
}

export interface ReceiptItemCreatePayload {
  material_id: number;
  quantity?: number;
}

export interface ReceiptCreatePayload {
  receipt_type?: ReceiptType;
  appointment_id?: number | null;
  client_id?: number | null;
  receipt_items?: ReceiptItemCreatePayload[] | null;
}

export interface PaymentCreatePayload {
  receipt_id: number;
  amount: number;
  method: PaymentMethod;
  add_change_to_deposit?: boolean;
}

export interface ReceiptPaymentPayload {
  receipt_id: number;
  amount: number;
  method: PaymentMethod;
  add_change_to_deposit?: boolean;
}

export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'receipt'
  | 'employee payment'
  | 'utility'
  | 'internet'
  | 'telephone'
  | 'other';

export type ManualTransactionCategory = 'utility' | 'internet' | 'telephone' | 'other';

export type TransactionMethod = 'card' | 'cash' | 'bank transfer' | 'deposit';

export type PayoutType = 'salary' | 'advance salary' | 'other';
export type PayoutMethod = 'cash' | 'card';

export interface Payout {
  id: number;
  created_at: string;
  updated_at: string;
  employee_id: number;
  type: PayoutType;
  method: PayoutMethod;
  amount: number | null;
  notes: string | null;
  cancelled: boolean;
  total_amount: number;
  payrolls: Payroll[];
}

export interface PayoutCreatePayload {
  employee_id: number;
  type?: PayoutType;
  amount?: number | null;
  method?: PayoutMethod;
  notes?: string | null;
  payrolls?: number[] | null;
  start_date?: string | null;
  end_date?: string | null;
}

export interface Transaction extends BaseEntity {
  amount: number;
  type: TransactionType;
  method: TransactionMethod;
  category: TransactionCategory;
  receipt_id: number | null;
  payout_id: number | null;
  notes: string | null;
  auto_generated: boolean;
  /** Нет в API — см. docs/backend-changes.md; выставляется локально после cancel */
  cancelled?: boolean;
}

export interface TransactionCreatePayload {
  type: TransactionType;
  category: ManualTransactionCategory;
  method: TransactionMethod;
  amount: number;
  notes?: string | null;
}
