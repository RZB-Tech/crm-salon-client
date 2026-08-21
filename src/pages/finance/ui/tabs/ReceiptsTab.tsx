import React from 'react';
import { Box } from '@mantine/core';
import type { Receipt } from '@/shared/api/types';
import { useCancelReceipt } from '@/shared/api/hooks/useReceipts';
import { ConfirmModal, ListPanelBody, ListPaginationFooter, listPageStyles } from '@/shared/ui';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { sortTime, useTableSort } from '@/shared/lib/hooks/useTableSort';
import { useResolvedById } from '@/shared/lib/hooks/useResolvedById';
import { ReceiptHistoryModal } from './ReceiptHistoryModal';
import { useI18n } from '@/shared/lib/i18n';
import { ReceiptsTable } from './ReceiptsTable';

const RECEIPT_SORT_GETTERS = {
  id: (item: Receipt) => item.id,
  type: (item: Receipt) => item.receipt_type,
  amount: (item: Receipt) => item.total_amount,
  remaining: (item: Receipt) => item.remaining_amount,
  status: (item: Receipt) => item.status,
  date: (item: Receipt) => sortTime(item.created_at),
};

interface ReceiptsTabProps {
  receipts: Receipt[];
  onPayReceipt: (receiptId: number) => void;
}

export const ReceiptsTab: React.FC<ReceiptsTabProps> = ({ receipts, onPayReceipt }) => {
  const { t } = useI18n();
  const [cancelTarget, setCancelTarget] = React.useState<number | null>(null);
  const [historyReceiptId, setHistoryReceiptId] = React.useState<number | null>(null);
  const cancelReceipt = useCancelReceipt();
  const historyReceipt = useResolvedById(receipts, historyReceiptId);

  const { sort, sortedItems, toggleSort } = useTableSort(receipts, RECEIPT_SORT_GETTERS, {
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
        <ReceiptsTable
          items={paginatedItems}
          sort={sort}
          onSort={toggleSort}
          onShowHistory={setHistoryReceiptId}
          onPayReceipt={onPayReceipt}
          onCancelReceipt={setCancelTarget}
        />
      </ListPanelBody>

      <ListPaginationFooter
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      <ConfirmModal
        opened={cancelTarget != null}
        title={t('finance.cancelReceiptTitle')}
        message={t('finance.cancelReceiptConfirm')}
        loading={cancelReceipt.isPending}
        onConfirm={() =>
          cancelTarget != null &&
          cancelReceipt.mutate(cancelTarget, { onSuccess: () => setCancelTarget(null) })
        }
        onClose={() => setCancelTarget(null)}
      />

      <ReceiptHistoryModal
        receipt={historyReceipt}
        onClose={() => setHistoryReceiptId(null)}
      />
    </Box>
  );
};
