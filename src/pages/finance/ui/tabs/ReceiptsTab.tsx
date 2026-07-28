import React from 'react';
import { Badge, Button, Group, Modal, Table, Text } from '@mantine/core';
import type { Receipt } from '@/shared/api/types';
import { useCancelReceipt } from '@/shared/api/hooks/useReceipts';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import { ConfirmModal, DataTable, DataTableRow } from '@/shared/ui';
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

  return (
    <>
      <DataTable
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'type', label: 'Тип' },
          { key: 'total', label: 'Сумма' },
          { key: 'remaining', label: 'Остаток' },
          { key: 'status', label: 'Статус' },
          { key: 'date', label: 'Дата' },
          { key: 'actions', label: '', width: 220 },
        ]}
        isEmpty={receipts.length === 0}
        emptyMessage="Чеков нет"
      >
        {receipts.map((receipt) => (
          <DataTableRow key={receipt.id}>
            <Table.Td>
              <Text size="sm" ff="monospace" c="dimmed">#{receipt.id}</Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm">{RECEIPT_TYPE_LABELS[receipt.receipt_type] ?? receipt.receipt_type}</Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm" fw={600}>{formatPrice(receipt.total_amount)}</Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm">{formatPrice(receipt.remaining_amount)}</Text>
            </Table.Td>
            <Table.Td>
              <Badge
                size="sm"
                variant="light"
                color={receipt.status === 'paid' ? 'green' : receipt.status === 'cancelled' ? 'gray' : 'orange'}
              >
                {RECEIPT_STATUS_LABELS[receipt.status] ?? receipt.status}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Text size="xs">{formatDateTime(receipt.created_at)}</Text>
            </Table.Td>
            <Table.Td>
              <Group gap={6}>
                <Button size="xs" variant="subtle" onClick={() => setHistoryReceipt(receipt)}>
                  История
                </Button>
                {receipt.status === 'pending' && (
                  <>
                    <Button size="xs" variant="light" onClick={() => onPayReceipt(receipt.id)}>
                      Оплатить
                    </Button>
                    <Button size="xs" variant="subtle" color="red" onClick={() => setCancelTarget(receipt.id)}>
                      Отменить
                    </Button>
                  </>
                )}
              </Group>
            </Table.Td>
          </DataTableRow>
        ))}
      </DataTable>

      <ConfirmModal
        opened={cancelTarget != null}
        title="Отменить чек"
        message="Отменить этот чек?"
        loading={cancelReceipt.isPending}
        onConfirm={() =>
          cancelTarget != null && cancelReceipt.mutate(cancelTarget, { onSuccess: () => setCancelTarget(null) })
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
            <Text size="sm" fw={600} mb="xs">Чек</Text>
            <AuditLogsPanel tableName="receipts" recordId={historyReceipt.id} />
            {historyReceipt.items.map((item) => (
              <React.Fragment key={item.id}>
                <Text size="sm" fw={600} mt="md" mb="xs">Позиция #{item.id}</Text>
                <AuditLogsPanel tableName="receipt_items" recordId={item.id} />
              </React.Fragment>
            ))}
          </>
        )}
      </Modal>
    </>
  );
};
