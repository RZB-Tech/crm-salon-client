import React from 'react';
import { Table, Text } from '@mantine/core';
import type { Appointment } from '@/shared/api/types';
import { listPageStyles } from '@/shared/ui';
import { AppointmentTableRow } from './AppointmentTableRow';

interface AppointmentsTableProps {
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
  canUpdate,
  restorePending,
  onRowClick,
  onRestore,
  onArchive,
}) => (
  <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
    <Table.Thead>
      <Table.Tr>
        <Table.Th className={listPageStyles.headCell} w={64}>
          №
        </Table.Th>
        <Table.Th className={listPageStyles.headCell} miw={160}>
          Дата и время
        </Table.Th>
        <Table.Th className={listPageStyles.headCell} miw={160}>
          Клиент
        </Table.Th>
        <Table.Th className={listPageStyles.headCell} miw={140}>
          Сотрудники
        </Table.Th>
        <Table.Th className={listPageStyles.headCell} miw={220}>
          Услуги и товары
        </Table.Th>
        <Table.Th className={listPageStyles.headCell} w={120}>
          Сумма
        </Table.Th>
        <Table.Th className={listPageStyles.headCell} w={120}>
          Статус
        </Table.Th>
        <Table.Th className={listPageStyles.headCell} w={110}>
          Оплата
        </Table.Th>
        <Table.Th className={listPageStyles.headCell} miw={140}>
          Комментарий
        </Table.Th>
        <Table.Th className={listPageStyles.headCell} w={130}>
          Создано
        </Table.Th>
        <Table.Th className={listPageStyles.headCell} w={48} />
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      {items.length === 0 ? (
        <Table.Tr>
          <Table.Td colSpan={11}>
            <Text c="dimmed" ta="center" py="xl">
              Посещений не найдено
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
