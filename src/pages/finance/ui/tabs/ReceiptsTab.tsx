import React from 'react';
import { Box } from '@mantine/core';
import type { Receipt } from '@/shared/api/types';
import { useCancelReceipt } from '@/shared/api/hooks/useReceipts';
import { ConfirmModal, ListPanelBody, ListPaginationFooter, listPageStyles } from '@/shared/ui';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { useResolvedById } from '@/shared/lib/hooks/useResolvedById';
import { ReceiptHistoryModal } from './ReceiptHistoryModal';
import { ReceiptsTable } from './ReceiptsTable';

interface ReceiptsTabProps {
  receipts: Receipt[];
  onPayReceipt: (receiptId: number) => void;
}

export const ReceiptsTab: React.FC<ReceiptsTabProps> = ({ receipts, onPayReceipt }) => {
  const [cancelTarget, setCancelTarget] = React.useState<number | null>(null);
  const [historyReceiptId, setHistoryReceiptId] = React.useState<number | null>(null);
  const cancelReceipt = useCancelReceipt();
  const historyReceipt = useResolvedById(receipts, historyReceiptId);

  const { page, pageSize, paginatedItems, total, setPage, setPageSize } = usePagination(receipts, {
    defaultPageSize: 20,
  });

  return (
    <Box className={listPageStyles.panel}>
      <ListPanelBody>
        <ReceiptsTable
          items={paginatedItems}
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
        title="Отменить чек"
        message="Отменить этот чек?"
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
