import type { BaseEntity, Sex } from './common';
import type { Transaction } from './finance';

export interface Client extends BaseEntity {
  firstname: string;
  lastname: string | null;
  middlename: string | null;
  phone: string | null;
  birth_date: string | null;
  sex: Sex;
  deposit: number;
  notes: string | null;
}

export interface ClientCreatePayload {
  firstname: string;
  lastname?: string | null;
  middlename?: string | null;
  phone?: string | null;
  birth_date?: string | null;
  sex: Sex;
  deposit?: number;
  notes?: string | null;
}

export interface ClientUpdatePayload {
  id: number;
  firstname?: string;
  lastname?: string | null;
  middlename?: string | null;
  phone?: string | null;
  birth_date?: string | null;
  sex?: Sex;
  notes?: string | null;
}

export interface ClientDepositPayload {
  id: number;
  operation: 1 | -1;
  amount: number;
}

export interface ClientFinanceReportPayload {
  clientID: number;
  start_date?: string | null;
  end_date?: string | null;
}

export interface FinanceReportMonth {
  income: number;
  net: number;
  transactions: Transaction[];
}

export interface ClientFinanceReport {
  items: Record<string, FinanceReportMonth>;
  total: number;
}
