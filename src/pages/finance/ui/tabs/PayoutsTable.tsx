import React from 'react';
import { Badge, Table, Text } from '@mantine/core';
import type { Payout } from '@/shared/api/types';
import { listPageStyles, SortableTh } from '@/shared/ui';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import { formatDateTime, formatPrice } from '@/shared/lib/format';
import { PAYOUT_TYPE_LABELS } from '../../lib/payoutHelpers';
import { useI18n } from '@/shared/lib/i18n';

interface PayoutsTableProps extends TableSortProps {
  items: Payout[];
  employeeMap: Map<number, string>;
}

export const PayoutsTable: React.FC<PayoutsTableProps> = ({ items, employeeMap, sort, onSort }) => {
  const { t } = useI18n();
  return (
  <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
    <Table.Thead>
      <Table.Tr>
        <SortableTh column="id" sort={sort} onSort={onSort}>
          ID
        </SortableTh>
        <SortableTh column="employee" sort={sort} onSort={onSort}>
          {t('form.employee')}
        </SortableTh>
        <SortableTh column="type" sort={sort} onSort={onSort}>
          {t('form.type')}
        </SortableTh>
        <SortableTh column="amount" sort={sort} onSort={onSort}>
          {t('form.amount')}
        </SortableTh>
        <SortableTh column="method" sort={sort} onSort={onSort}>
          {t('form.methodShort')}
        </SortableTh>
        <SortableTh column="status" sort={sort} onSort={onSort}>
          {t('common.status')}
        </SortableTh>
        <SortableTh column="date" sort={sort} onSort={onSort}>
          {t('common.date')}
        </SortableTh>
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      {items.length === 0 ? (
        <Table.Tr>
          <Table.Td colSpan={7}>
            <Text size="sm" c="dimmed" ta="center" py="xl">
              {t('finance.emptyPayouts')}
            </Text>
          </Table.Td>
        </Table.Tr>
      ) : (
        items.map((payout) => (
          <Table.Tr
            key={payout.id}
            className={`${listPageStyles.row}${payout.cancelled ? ` ${listPageStyles.mutedRow}` : ''}`}
          >
            <Table.Td className={listPageStyles.bodyCell}>
              <Text size="sm" ff="monospace" c="rgba(72,72,72,0.4)">
                #{payout.id}
              </Text>
            </Table.Td>
            <Table.Td className={listPageStyles.bodyCell}>
              <Text size="sm" fw={500} c="#484848">
                {employeeMap.get(payout.employee_id) ?? `#${payout.employee_id}`}
              </Text>
            </Table.Td>
            <Table.Td className={listPageStyles.bodyCell}>
              <Badge size="sm" variant="light" color="gray">
                {PAYOUT_TYPE_LABELS[payout.type] ?? payout.type}
              </Badge>
            </Table.Td>
            <Table.Td className={listPageStyles.bodyCell}>
              <Text size="sm" fw={600} c="#484848">
                {formatPrice(payout.total_amount)}
              </Text>
            </Table.Td>
            <Table.Td className={listPageStyles.bodyCell}>
              <Text size="sm" c="rgba(72,72,72,0.4)">
                {payout.method === 'cash' ? t('labels.payment.cash') : t('labels.payment.card')}
              </Text>
            </Table.Td>
            <Table.Td className={listPageStyles.bodyCell}>
              <Badge size="sm" variant="light" color={payout.cancelled ? 'red' : 'green'}>
                {payout.cancelled ? t('finance.cancelled') : t('finance.completed')}
              </Badge>
            </Table.Td>
            <Table.Td className={listPageStyles.bodyCell}>
              <Text size="xs" c="rgba(72,72,72,0.4)">
                {formatDateTime(payout.created_at)}
              </Text>
            </Table.Td>
          </Table.Tr>
        ))
      )}
    </Table.Tbody>
  </Table>
  );
};
