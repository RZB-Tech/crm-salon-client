import React from 'react';
import {
  Badge,
  Button,
  Group,
  Table,
  Text,
} from '@mantine/core';
import type { Transaction } from '@/shared/api/types';
import { ListPanelBody, listPageStyles, SortableTh } from '@/shared/ui';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import {
  formatDateTime,
  formatPrice,
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_METHOD_LABELS,
  TRANSACTION_TYPE_LABELS,
} from '@/shared/lib/format';
import { getSignedAmount } from '../../lib/transactionHelpers';

interface TransactionsTableProps extends TableSortProps {
  items: Transaction[];
  onCancel: (id: number) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  items,
  sort,
  onSort,
  onCancel,
}) => (
  <ListPanelBody>
    <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
      <Table.Thead>
        <Table.Tr>
          <SortableTh column="id" sort={sort} onSort={onSort}>
            ID
          </SortableTh>
          <SortableTh column="type" sort={sort} onSort={onSort}>
            Тип
          </SortableTh>
          <SortableTh column="category" sort={sort} onSort={onSort}>
            Категория
          </SortableTh>
          <SortableTh column="amount" sort={sort} onSort={onSort}>
            Сумма
          </SortableTh>
          <SortableTh column="method" sort={sort} onSort={onSort}>
            Способ
          </SortableTh>
          <Table.Th className={listPageStyles.headCell}>Связь</Table.Th>
          <SortableTh column="status" sort={sort} onSort={onSort}>
            Статус
          </SortableTh>
          <SortableTh column="date" sort={sort} onSort={onSort}>
            Дата
          </SortableTh>
          <Table.Th className={listPageStyles.headCell} w={100} />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={9}>
              <Text size="sm" c="dimmed" ta="center" py="xl">
                Транзакций нет
              </Text>
            </Table.Td>
          </Table.Tr>
        ) : (
          items.map((transaction) => {
            const cancelled = Boolean(transaction.cancelled);
            const canCancel = !transaction.auto_generated && !cancelled;

            return (
              <Table.Tr
                key={transaction.id}
                className={`${listPageStyles.row}${cancelled ? ` ${listPageStyles.mutedRow}` : ''}`}
              >
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" ff="monospace" c="rgba(72,72,72,0.4)">
                    #{transaction.id}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Badge
                    size="sm"
                    variant="light"
                    color={transaction.type === 'income' ? 'green' : 'red'}
                  >
                    {TRANSACTION_TYPE_LABELS[transaction.type] ?? transaction.type}
                  </Badge>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" c="#484848">
                    {TRANSACTION_CATEGORY_LABELS[transaction.category] ?? transaction.category}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text
                    size="sm"
                    fw={600}
                    c={transaction.type === 'income' ? 'green' : 'red'}
                    td={cancelled ? 'line-through' : undefined}
                  >
                    {formatPrice(Math.abs(getSignedAmount(transaction)))}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" c="rgba(72,72,72,0.4)">
                    {TRANSACTION_METHOD_LABELS[transaction.method] ?? transaction.method}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  {transaction.receipt_id != null && (
                    <Text size="xs">Чек #{transaction.receipt_id}</Text>
                  )}
                  {transaction.payout_id != null && (
                    <Text size="xs">Выплата #{transaction.payout_id}</Text>
                  )}
                  {transaction.receipt_id == null && transaction.payout_id == null && (
                    <Text size="xs" c="dimmed">
                      —
                    </Text>
                  )}
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Group gap={6}>
                    {transaction.auto_generated ? (
                      <Badge size="xs" variant="outline" color="sage">
                        Авто
                      </Badge>
                    ) : (
                      <Badge size="xs" variant="outline" color="gray">
                        Ручная
                      </Badge>
                    )}
                    {cancelled && (
                      <Badge size="xs" variant="light" color="gray">
                        Отменена
                      </Badge>
                    )}
                  </Group>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="xs" c="rgba(72,72,72,0.4)">
                    {formatDateTime(transaction.created_at)}
                  </Text>
                  {transaction.notes && (
                    <Text size="xs" c="dimmed" lineClamp={1}>
                      {transaction.notes}
                    </Text>
                  )}
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  {canCancel && (
                    <Button
                      size="xs"
                      variant="subtle"
                      color="red"
                      onClick={() => onCancel(transaction.id)}
                    >
                      Отменить
                    </Button>
                  )}
                </Table.Td>
              </Table.Tr>
            );
          })
        )}
      </Table.Tbody>
    </Table>
  </ListPanelBody>
);
