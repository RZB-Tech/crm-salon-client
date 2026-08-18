import React from 'react';
import { useCancelTransaction, useTransactions } from '@/shared/api/hooks/useTransactions';
import type { Transaction } from '@/shared/api/types';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { sortTime, useTableSort } from '@/shared/lib/hooks/useTableSort';
import {
  calculateTransactionSummary,
  filterTransactions,
  getSignedAmount,
} from './transactionHelpers';

const TRANSACTION_SORT_GETTERS = {
  id: (item: Transaction) => item.id,
  type: (item: Transaction) => item.type,
  category: (item: Transaction) => item.category,
  amount: (item: Transaction) => getSignedAmount(item),
  method: (item: Transaction) => item.method,
  status: (item: Transaction) => Number(Boolean(item.cancelled)),
  date: (item: Transaction) => sortTime(item.created_at),
};

export function useTransactionsTab(enabled: boolean) {
  const [formOpen, setFormOpen] = React.useState(false);
  const [cancelTarget, setCancelTarget] = React.useState<number | null>(null);
  const [typeFilter, setTypeFilter] = React.useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = React.useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = React.useState<string | null>(null);

  const { data: transactions, isLoading, isError } = useTransactions({ enabled });
  const cancelTransaction = useCancelTransaction();

  const filteredTransactions = React.useMemo(
    () => filterTransactions(transactions, { type: typeFilter, category: categoryFilter, source: sourceFilter }),
    [transactions, typeFilter, categoryFilter, sourceFilter],
  );

  const { sort, sortedItems, toggleSort } = useTableSort(
    filteredTransactions,
    TRANSACTION_SORT_GETTERS,
    { key: 'date', dir: 'desc' },
  );
  const pagination = usePagination(sortedItems, { defaultPageSize: 20 });

  React.useEffect(() => {
    pagination.resetPage();
  }, [typeFilter, categoryFilter, sourceFilter, sort.key, sort.dir, pagination.resetPage]);

  const summary = React.useMemo(
    () => calculateTransactionSummary(transactions),
    [transactions],
  );

  const openForm = React.useCallback(() => setFormOpen(true), []);
  const closeForm = React.useCallback(() => setFormOpen(false), []);

  const confirmCancel = React.useCallback(() => {
    if (cancelTarget == null) return;
    cancelTransaction.mutate(cancelTarget, { onSuccess: () => setCancelTarget(null) });
  }, [cancelTarget, cancelTransaction]);

  return {
    formOpen,
    openForm,
    closeForm,
    cancelTarget,
    setCancelTarget,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    sourceFilter,
    setSourceFilter,
    isLoading,
    isError,
    pagination,
    sort,
    toggleSort,
    summary,
    cancelTransaction,
    confirmCancel,
  };
}
