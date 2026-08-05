import React from 'react';
import { useCancelTransaction, useTransactions } from '@/shared/api/hooks/useTransactions';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import {
  calculateTransactionSummary,
  filterTransactions,
} from './transactionHelpers';

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

  const pagination = usePagination(filteredTransactions, { defaultPageSize: 20 });

  React.useEffect(() => {
    pagination.resetPage();
  }, [typeFilter, categoryFilter, sourceFilter, pagination.resetPage]);

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
    summary,
    cancelTransaction,
    confirmCancel,
  };
}
