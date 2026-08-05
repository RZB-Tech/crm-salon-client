import React from 'react';
import { ActionIcon, Skeleton, Table, Text, Badge } from '@mantine/core';
import { ArchiveIcon } from '@phosphor-icons/react';
import type { Payroll } from '@/shared/api/types';
import { DataTable, DataTableRow } from '@/shared/ui';
import { formatDate, formatPrice, PAYROLL_TYPE_LABELS } from '@/shared/lib/format';

interface PayrollTableProps {
  payrolls: Payroll[] | undefined;
  isLoading: boolean;
  onEdit: (payroll: Payroll) => void;
  onArchive: (payrollId: number) => void;
}

export const PayrollTable: React.FC<PayrollTableProps> = ({
  payrolls,
  isLoading,
  onEdit,
  onArchive,
}) => {
  if (isLoading) {
    return <Skeleton height={160} radius="md" />;
  }

  const items = payrolls ?? [];

  return (
    <DataTable
      compact
      stickyHeader={false}
      maxHeight={420}
      columns={[
        { key: 'type', label: 'Тип' },
        { key: 'amount', label: 'Сумма' },
        { key: 'notes', label: 'Заметка' },
        { key: 'date', label: 'Дата' },
        { key: 'actions', label: '', width: 48 },
      ]}
      isEmpty={items.length === 0}
      emptyMessage="Выплат пока нет"
    >
      {items.map((payroll) => (
        <DataTableRow
          key={payroll.id}
          onClick={() => onEdit(payroll)}
          style={{ cursor: 'pointer' }}
        >
          <Table.Td>
            <Badge size="sm" variant="light">
              {PAYROLL_TYPE_LABELS[payroll.type]}
            </Badge>
          </Table.Td>
          <Table.Td>
            <Text size="sm" fw={600}>
              {formatPrice(payroll.amount)}
            </Text>
          </Table.Td>
          <Table.Td>
            <Text size="sm">{payroll.notes || '—'}</Text>
          </Table.Td>
          <Table.Td>
            <Text size="sm">{formatDate(payroll.created_at)}</Text>
          </Table.Td>
          <Table.Td>
            <ActionIcon
              variant="subtle"
              color="orange"
              size="sm"
              aria-label="Архивировать"
              onClick={(e) => {
                e.stopPropagation();
                onArchive(payroll.id);
              }}
            >
              <ArchiveIcon size={16} />
            </ActionIcon>
          </Table.Td>
        </DataTableRow>
      ))}
    </DataTable>
  );
};
