import type {
  ManualTransactionCategory,
  Transaction,
  TransactionMethod,
  TransactionType,
} from '@/shared/api/types';
import { TRANSACTION_CATEGORY_LABELS } from '@/shared/lib/format';

export interface TransactionFormState {
  type: TransactionType;
  category: ManualTransactionCategory;
  method: TransactionMethod;
  amount: number;
  notes: string;
}

export const DEFAULT_FORM: TransactionFormState = {
  type: 'expense',
  category: 'other',
  method: 'cash',
  amount: 0,
  notes: '',
};

export const CATEGORY_FILTER_OPTIONS = Object.entries(TRANSACTION_CATEGORY_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export const SOURCE_FILTER_OPTIONS = [
  { value: 'auto', label: 'Автоматические' },
  { value: 'manual', label: 'Ручные' },
];

export const isActiveTransaction = (transaction: Transaction): boolean => !transaction.cancelled;

export const getSignedAmount = (transaction: Transaction): number =>
  transaction.type === 'income' ? transaction.amount : -transaction.amount;

export interface TransactionFilters {
  type: string | null;
  category: string | null;
  source: string | null;
}

export const filterTransactions = (
  transactions: Transaction[] | undefined,
  filters: TransactionFilters,
): Transaction[] => {
  let items = [...(transactions ?? [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  if (filters.type) {
    items = items.filter((item) => item.type === filters.type);
  }

  if (filters.category) {
    items = items.filter((item) => item.category === filters.category);
  }

  if (filters.source === 'auto') {
    items = items.filter((item) => item.auto_generated);
  }

  if (filters.source === 'manual') {
    items = items.filter((item) => !item.auto_generated);
  }

  return items;
};

export const calculateTransactionSummary = (transactions: Transaction[] | undefined) => {
  const active = (transactions ?? []).filter(isActiveTransaction);

  const income = active
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

  const expense = active
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  return { income, expense, balance: income - expense };
};
