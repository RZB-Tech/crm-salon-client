import React from 'react';
import { Skeleton, Table } from '@mantine/core';
import { useClientAppointments } from '@/shared/api/hooks/useClients';
import { DataTable, DataTableRow } from '@/shared/ui';
import { formatPrice } from '@/shared/lib/format';
import { formatClientAppointmentStamp } from '../lib/clientDisplay';
import styles from './client-modals.module.css';

interface ClientAppointmentsTabProps {
  clientId: number;
}

export const ClientAppointmentsTab: React.FC<ClientAppointmentsTabProps> = ({ clientId }) => {
  const { data: appointments, isLoading } = useClientAppointments(clientId);

  if (isLoading) return <Skeleton height={120} />;

  return (
    <div className={styles.tableBlock}>
      <p className={styles.tableLabel}>Записи клиента</p>
      <DataTable
        compact
        stickyHeader={false}
        maxHeight={280}
        className={styles.tableCard}
        hideEmptyIcon
        columns={[
          { key: 'date', label: 'Дата' },
          { key: 'amount', label: 'Сумма' },
          { key: 'status', label: 'Статус' },
        ]}
        isEmpty={(appointments ?? []).length === 0}
        emptyMessage="Записей нет"
      >
        {(appointments ?? []).map((appt) => (
          <DataTableRow key={appt.id}>
            <Table.Td>{formatClientAppointmentStamp(appt.start_time_est)}</Table.Td>
            <Table.Td>{formatPrice(appt.total_price)}</Table.Td>
            <Table.Td>
              <span className={appt.paid ? styles.statusBadge : styles.statusBadgeUnpaid}>
                {appt.paid ? 'оплачено' : 'не оплачено'}
              </span>
            </Table.Td>
          </DataTableRow>
        ))}
      </DataTable>
    </div>
  );
};
