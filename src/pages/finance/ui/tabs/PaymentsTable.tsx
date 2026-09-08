import React from 'react';
import { Button, Table, Text } from '@mantine/core';
import type { Transaction } from '@/shared/api/types';
import { listPageStyles, SortableTh } from '@/shared/ui';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import { formatDateTime, formatPrice, PAYMENT_METHOD_LABELS } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';

interface PaymentsTableProps extends TableSortProps {
  items: Transaction[];
  onShowHistory: (paymentId: number) => void;
}

export const PaymentsTable: React.FC<PaymentsTableProps> = ({
  items,
  sort,
  onSort,
  onShowHistory,
}) => {
  const { t } = useI18n();

  return (
    <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
      <Table.Thead>
        <Table.Tr>
          <SortableTh column="id" sort={sort} onSort={onSort}>
            ID
          </SortableTh>
          <SortableTh column="receipt" sort={sort} onSort={onSort}>
            {t('form.receipt')}
          </SortableTh>
          <SortableTh column="amount" sort={sort} onSort={onSort}>
            {t('form.amount')}
          </SortableTh>
          <SortableTh column="method" sort={sort} onSort={onSort}>
            {t('form.methodShort')}
          </SortableTh>
          <SortableTh column="date" sort={sort} onSort={onSort}>
            {t('common.date')}
          </SortableTh>
          <Table.Th className={listPageStyles.headCell} w={100} />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={6}>
              <Text size="sm" c="dimmed" ta="center" py="xl">
                {t('finance.emptyPayments')}
              </Text>
            </Table.Td>
          </Table.Tr>
        ) : (
          items.map((payment) => (
            <Table.Tr key={payment.id} className={listPageStyles.row}>
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" ff="monospace" c="rgba(72,72,72,0.4)">
                  #{payment.id}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" c="#484848">
                  #{payment.receipt_id}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" fw={600} c="#484848">
                  {formatPrice(payment.amount)}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" c="rgba(72,72,72,0.4)">
                  {PAYMENT_METHOD_LABELS[payment.method] ?? payment.method}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="xs" c="rgba(72,72,72,0.4)">
                  {formatDateTime(payment.created_at)}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Button size="xs" variant="subtle" onClick={() => onShowHistory(payment.id)}>
                  {t('finance.history')}
                </Button>
              </Table.Td>
            </Table.Tr>
          ))
        )}
      </Table.Tbody>
    </Table>
  );
};
