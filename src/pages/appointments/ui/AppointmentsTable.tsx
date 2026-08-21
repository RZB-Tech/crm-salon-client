import React from 'react';
import { Table, Text } from '@mantine/core';
import type { Appointment } from '@/shared/api/types';
import { listPageStyles, SortableTh } from '@/shared/ui';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import { AppointmentTableRow } from './AppointmentTableRow';
import { useI18n } from '@/shared/lib/i18n';

interface AppointmentsTableProps extends TableSortProps {
  items: Appointment[];
  showArchived: boolean;
  canUpdate: boolean;
  restorePending: boolean;
  onRowClick: (appointment: Appointment) => void;
  onRestore: (event: React.MouseEvent, id: number) => void;
  onArchive: (event: React.MouseEvent, appointment: Appointment) => void;
}

export const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  items,
  showArchived,
  sort,
  onSort,
  canUpdate,
  restorePending,
  onRowClick,
  onRestore,
  onArchive,
}) => {
  const { t } = useI18n();
  return (
  <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
    <Table.Thead>
      <Table.Tr>
        <SortableTh column="id" sort={sort} onSort={onSort} w={64}>
          №
        </SortableTh>
        <SortableTh column="date" sort={sort} onSort={onSort} miw={160}>
          {t('appointments.dateTime')}
        </SortableTh>
        <SortableTh column="client" sort={sort} onSort={onSort} miw={160}>
          {t('appointments.client')}
        </SortableTh>
        <Table.Th className={listPageStyles.headCell} miw={140}>
          {t('appointments.employees')}
        </Table.Th>
        <Table.Th className={listPageStyles.headCell} miw={220}>
          {t('appointments.servicesAndProducts')}
        </Table.Th>
        <SortableTh column="amount" sort={sort} onSort={onSort} w={120}>
          {t('form.amount')}
        </SortableTh>
        <SortableTh column="status" sort={sort} onSort={onSort} w={120}>
          {t('common.status')}
        </SortableTh>
        <SortableTh column="paid" sort={sort} onSort={onSort} w={110}>
          {t('board.tabPayment')}
        </SortableTh>
        <Table.Th className={listPageStyles.headCell} miw={140}>
          {t('common.comment')}
        </Table.Th>
        <SortableTh column="created" sort={sort} onSort={onSort} w={130}>
          {t('appointments.created')}
        </SortableTh>
        <Table.Th className={listPageStyles.headCell} w={48} />
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      {items.length === 0 ? (
        <Table.Tr>
          <Table.Td colSpan={11}>
            <Text c="dimmed" ta="center" py="xl">
              {t('appointments.notFound')}
            </Text>
          </Table.Td>
        </Table.Tr>
      ) : (
        items.map((appointment) => (
          <AppointmentTableRow
            key={appointment.id}
            appointment={appointment}
            showArchived={showArchived}
            canUpdate={canUpdate}
            restorePending={restorePending}
            onRowClick={onRowClick}
            onRestore={onRestore}
            onArchive={onArchive}
          />
        ))
      )}
    </Table.Tbody>
  </Table>
  );
};
