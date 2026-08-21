import React from 'react';
import { Skeleton, Table } from '@mantine/core';
import { useClientAppointments } from '@/shared/api/hooks/useClients';
import { DataTable, DataTableRow } from '@/shared/ui';
import { formatPrice } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { formatClientAppointmentStamp } from '../lib/clientDisplay';
import styles from './client-modals.module.css';

interface ClientAppointmentsTabProps {
  clientId: number;
}

export const ClientAppointmentsTab: React.FC<ClientAppointmentsTabProps> = ({ clientId }) => {
  const { t } = useI18n();
  const { data: appointments, isLoading } = useClientAppointments(clientId);

  if (isLoading) return <Skeleton height={120} />;

  return (
    <div className={styles.tableBlock}>
      <p className={styles.tableLabel}>{t('clients.clientAppointments')}</p>
      <DataTable
        compact
        stickyHeader={false}
        maxHeight={280}
        className={styles.tableCard}
        hideEmptyIcon
        columns={[
          { key: 'date', label: t('common.date') },
          { key: 'amount', label: t('form.amount') },
          { key: 'status', label: t('common.status') },
        ]}
        isEmpty={(appointments ?? []).length === 0}
        emptyMessage={t('clients.noAppointments')}
      >
        {(appointments ?? []).map((appt) => (
          <DataTableRow key={appt.id}>
            <Table.Td>{formatClientAppointmentStamp(appt.start_time_est)}</Table.Td>
            <Table.Td>{formatPrice(appt.total_price)}</Table.Td>
            <Table.Td>
              <span className={appt.paid ? styles.statusBadge : styles.statusBadgeUnpaid}>
                {appt.paid ? t('board.paidLower') : t('board.unpaidLower')}
              </span>
            </Table.Td>
          </DataTableRow>
        ))}
      </DataTable>
    </div>
  );
};
