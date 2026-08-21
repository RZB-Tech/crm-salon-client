import React from 'react';
import { ActionIcon, Skeleton, Table, Text, Badge } from '@mantine/core';
import { ArchiveIcon } from '@phosphor-icons/react';
import type { Payroll } from '@/shared/api/types';
import { DataTable, DataTableRow } from '@/shared/ui';
import { formatDate, formatPrice, PAYROLL_TYPE_LABELS } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';

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
  const { t } = useI18n();
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
        { key: 'type', label: t('form.type') },
        { key: 'amount', label: t('form.amount') },
        { key: 'notes', label: t('board.note') },
        { key: 'date', label: t('common.date') },
        { key: 'actions', label: '', width: 48 },
      ]}
      isEmpty={items.length === 0}
      emptyMessage={t('employees.noPayrolls')}
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
              aria-label={t('common.archive')}
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
