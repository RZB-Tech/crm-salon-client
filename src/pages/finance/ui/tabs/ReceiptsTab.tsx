import React from 'react';
import { Badge, Box, Button, Group, Modal, Table, Text } from '@mantine/core';
import type { Receipt } from '@/shared/api/types';
import { useCancelReceipt } from '@/shared/api/hooks/useReceipts';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import { ConfirmModal, ListPanelBody, ListPaginationFooter, listPageStyles } from '@/shared/ui';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import {
  formatDateTime,
  formatPrice,
  RECEIPT_STATUS_LABELS,
  RECEIPT_TYPE_LABELS,
} from '@/shared/lib/format';

interface ReceiptsTabProps {
  receipts: Receipt[];
  onPayReceipt: (receiptId: number) => void;
}

export const ReceiptsTab: React.FC<ReceiptsTabProps> = ({ receipts, onPayReceipt }) => {
  const [cancelTarget, setCancelTarget] = React.useState<number | null>(null);
  const [historyReceipt, setHistoryReceipt] = React.useState<Receipt | null>(null);
  const cancelReceipt = useCancelReceipt();

  const { page, pageSize, paginatedItems, total, setPage, setPageSize } = usePagination(receipts, {
    defaultPageSize: 20,
  });

  return (
    <Box className={listPageStyles.panel}>
      <ListPanelBody>
        <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className={listPageStyles.headCell}>ID</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Тип</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Сумма</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Остаток</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Статус</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Дата</Table.Th>
              <Table.Th className={listPageStyles.headCell} w={220} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedItems.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <Text size="sm" c="dimmed" ta="center" py="xl">
                    Чеков нет
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              paginatedItems.map((receipt) => (
                <Table.Tr key={receipt.id} className={listPageStyles.row}>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Text size="sm" ff="monospace" c="rgba(72,72,72,0.4)">
                      #{receipt.id}
                    </Text>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Text size="sm" c="#484848">
                      {RECEIPT_TYPE_LABELS[receipt.receipt_type] ?? receipt.receipt_type}
                    </Text>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Text size="sm" fw={600} c="#484848">
                      {formatPrice(receipt.total_amount)}
                    </Text>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Text size="sm" c="rgba(72,72,72,0.4)">
                      {formatPrice(receipt.remaining_amount)}
                    </Text>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Badge
                      size="sm"
                      variant="light"
                      color={
                        receipt.status === 'paid'
                          ? 'green'
                          : receipt.status === 'cancelled'
                            ? 'gray'
                            : 'orange'
                      }
                    >
                      {RECEIPT_STATUS_LABELS[receipt.status] ?? receipt.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Text size="xs" c="rgba(72,72,72,0.4)">
                      {formatDateTime(receipt.created_at)}
                    </Text>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Group gap={6}>
                      <Button size="xs" variant="subtle" onClick={() => setHistoryReceipt(receipt)}>
                        История
                      </Button>
                      {receipt.status === 'pending' && (
                        <>
                          <Button size="xs" variant="light" color="sage" onClick={() => onPayReceipt(receipt.id)}>
                            Оплатить
                          </Button>
                          <Button
                            size="xs"
                            variant="subtle"
                            color="red"
                            onClick={() => setCancelTarget(receipt.id)}
                          >
                            Отменить
                          </Button>
                        </>
                      )}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
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

      <Modal
        opened={Boolean(historyReceipt)}
        onClose={() => setHistoryReceipt(null)}
        title={historyReceipt ? `История чека #${historyReceipt.id}` : 'История чека'}
        radius="md"
        size="lg"
      >
        {historyReceipt && (
          <>
            <Text size="sm" fw={600} mb="xs">
              Чек
            </Text>
            <AuditLogsPanel tableName="receipts" recordId={historyReceipt.id} />
            {historyReceipt.items.map((item) => (
              <React.Fragment key={item.id}>
                <Text size="sm" fw={600} mt="md" mb="xs">
                  Позиция #{item.id}
                </Text>
                <AuditLogsPanel tableName="receipt_items" recordId={item.id} />
              </React.Fragment>
            ))}
          </>
        )}
      </Modal>
    </Box>
  );
};
