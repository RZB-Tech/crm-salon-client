import React from 'react';
import { Box, Skeleton, Text } from '@mantine/core';
import { ConfirmModal, ListPaginationFooter, listPageStyles } from '@/shared/ui';
import { TransactionFormModal } from '../TransactionFormModal';
import { useTransactionsTab } from '../../lib/useTransactionsTab';
import { TransactionsSummary } from './TransactionsSummary';
import { TransactionsFilters } from './TransactionsFilters';
import { TransactionsTable } from './TransactionsTable';

export type TransactionsTabHandle = {
  openCreate: () => void;
};

interface TransactionsTabProps {
  enabled: boolean;
}

export const TransactionsTab = React.forwardRef<TransactionsTabHandle, TransactionsTabProps>(
  function TransactionsTab({ enabled }, ref) {
    const {
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
    } = useTransactionsTab(enabled);

    React.useImperativeHandle(ref, () => ({ openCreate: openForm }), [openForm]);

    if (isLoading) {
      return (
        <Box className={listPageStyles.panel} p="md">
          <Skeleton height={72} mb="md" radius="md" />
          <Skeleton height={360} radius="md" />
        </Box>
      );
    }

    if (isError) {
      return (
        <Box className={listPageStyles.panel} p="xl">
          <Text c="red">Не удалось загрузить транзакции</Text>
        </Box>
      );
    }

    const { page, pageSize, paginatedItems, total, setPage, setPageSize } = pagination;

    return (
      <Box className={listPageStyles.panel}>
        <TransactionsSummary
          income={summary.income}
          expense={summary.expense}
          balance={summary.balance}
        />

        <TransactionsFilters
          typeFilter={typeFilter}
          categoryFilter={categoryFilter}
          sourceFilter={sourceFilter}
          onTypeChange={setTypeFilter}
          onCategoryChange={setCategoryFilter}
          onSourceChange={setSourceFilter}
        />

        <TransactionsTable items={paginatedItems} onCancel={setCancelTarget} />

        <ListPaginationFooter
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />

        <TransactionFormModal opened={formOpen} onClose={closeForm} />

        <ConfirmModal
          opened={cancelTarget != null}
          title="Отменить транзакцию"
          message="Отменить эту транзакцию? Действие необратимо."
          loading={cancelTransaction.isPending}
          onConfirm={confirmCancel}
          onClose={() => setCancelTarget(null)}
        />
      </Box>
    );
  },
);
