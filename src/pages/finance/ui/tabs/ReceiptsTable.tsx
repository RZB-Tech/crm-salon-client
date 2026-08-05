import React from 'react';
import { Badge, Button, Group, Table, Text } from '@mantine/core';
import type { Receipt } from '@/shared/api/types';
import { listPageStyles } from '@/shared/ui';
import {
  formatDateTime,
  formatPrice,
  RECEIPT_STATUS_LABELS,
  RECEIPT_TYPE_LABELS,
} from '@/shared/lib/format';

interface ReceiptsTableProps {
  items: Receipt[];
  onShowHistory: (receiptId: number) => void;
  onPayReceipt: (receiptId: number) => void;
  onCancelReceipt: (receiptId: number) => void;
}

export const ReceiptsTable: React.FC<ReceiptsTableProps> = ({
  items,
  onShowHistory,
  onPayReceipt,
  onCancelReceipt,
}) => (
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
      {items.length === 0 ? (
        <Table.Tr>
          <Table.Td colSpan={7}>
            <Text size="sm" c="dimmed" ta="center" py="xl">
              Чеков нет
            </Text>
          </Table.Td>
        </Table.Tr>
      ) : (
        items.map((receipt) => (
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
                <Button size="xs" variant="subtle" onClick={() => onShowHistory(receipt.id)}>
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
                      onClick={() => onCancelReceipt(receipt.id)}
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
);
