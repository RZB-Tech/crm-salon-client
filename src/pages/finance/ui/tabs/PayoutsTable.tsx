import React from 'react';
import { Badge, Table, Text } from '@mantine/core';
import type { Payout } from '@/shared/api/types';
import { listPageStyles } from '@/shared/ui';
import { formatDateTime, formatPrice } from '@/shared/lib/format';
import { PAYOUT_TYPE_LABELS } from '../../lib/payoutHelpers';

interface PayoutsTableProps {
  items: Payout[];
  employeeMap: Map<number, string>;
}

export const PayoutsTable: React.FC<PayoutsTableProps> = ({ items, employeeMap }) => (
  <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
    <Table.Thead>
      <Table.Tr>
        <Table.Th className={listPageStyles.headCell}>ID</Table.Th>
        <Table.Th className={listPageStyles.headCell}>Сотрудник</Table.Th>
        <Table.Th className={listPageStyles.headCell}>Тип</Table.Th>
        <Table.Th className={listPageStyles.headCell}>Сумма</Table.Th>
        <Table.Th className={listPageStyles.headCell}>Способ</Table.Th>
        <Table.Th className={listPageStyles.headCell}>Статус</Table.Th>
        <Table.Th className={listPageStyles.headCell}>Дата</Table.Th>
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      {items.length === 0 ? (
        <Table.Tr>
          <Table.Td colSpan={7}>
            <Text size="sm" c="dimmed" ta="center" py="xl">
              Выплат нет
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
                {payout.method === 'cash' ? 'Наличные' : 'Карта'}
              </Text>
            </Table.Td>
            <Table.Td className={listPageStyles.bodyCell}>
              <Badge size="sm" variant="light" color={payout.cancelled ? 'red' : 'green'}>
                {payout.cancelled ? 'Отменена' : 'Проведена'}
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
