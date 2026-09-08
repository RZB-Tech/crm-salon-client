import React from 'react';
import { Box } from '@mantine/core';
import type { Transaction } from '@/shared/api/types';
import { ListPanelBody, ListPaginationFooter, listPageStyles } from '@/shared/ui';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { sortTime, useTableSort } from '@/shared/lib/hooks/useTableSort';
import { useResolvedById } from '@/shared/lib/hooks/useResolvedById';
import { PaymentHistoryModal } from './PaymentHistoryModal';
import { PaymentsListBody } from './PaymentsListBody';

interface PaymentsTabProps {
  payments: Transaction[];
}

const PAYMENT_SORT_GETTERS = {
  id: (item: Transaction) => item.id,
  receipt: (item: Transaction) => item.receipt_id,
  amount: (item: Transaction) => item.amount,
  method: (item: Transaction) => item.method,
  date: (item: Transaction) => sortTime(item.created_at),
};

export const PaymentsTab: React.FC<PaymentsTabProps> = ({ payments }) => {
  const [historyPaymentId, setHistoryPaymentId] = React.useState<number | null>(null);
  const historyPayment = useResolvedById(payments, historyPaymentId);

  const { sort, sortedItems, toggleSort } = useTableSort(payments, PAYMENT_SORT_GETTERS, {
    key: 'date',
    dir: 'desc',
  });
  const { page, pageSize, paginatedItems, total, setPage, setPageSize, resetPage } = usePagination(
    sortedItems,
    { defaultPageSize: 20 },
  );

  React.useEffect(() => {
    resetPage();
  }, [sort.key, sort.dir, resetPage]);

  return (
    <Box className={listPageStyles.panel}>
      <ListPanelBody>
        <PaymentsListBody
          items={paginatedItems}
          sort={sort}
          onSort={toggleSort}
          onShowHistory={setHistoryPaymentId}
        />
      </ListPanelBody>

      <ListPaginationFooter
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      <PaymentHistoryModal payment={historyPayment} onClose={() => setHistoryPaymentId(null)} />
    </Box>
  );
};
