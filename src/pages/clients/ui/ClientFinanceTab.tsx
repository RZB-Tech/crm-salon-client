import React from 'react';
import { Skeleton, Table } from '@mantine/core';
import { useClientFinanceReport } from '@/shared/api/hooks/useClientFinanceReport';
import { DataTable, DataTableRow } from '@/shared/ui';
import { formatPrice } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { formatFinanceMonth } from '../lib/clientDisplay';
import styles from './client-modals.module.css';

interface ClientFinanceTabProps {
  clientId: number;
}

export const ClientFinanceTab: React.FC<ClientFinanceTabProps> = ({ clientId }) => {
  const { t } = useI18n();
  const { data: financeReport, isLoading } = useClientFinanceReport({ clientID: clientId });
  const months = Object.entries(financeReport?.items ?? {});

  if (isLoading) return <Skeleton height={120} />;

  return (
    <div className={styles.tableBlock}>
      <p className={styles.tableLabel}>{t('clients.finance')}</p>
      <DataTable
        compact
        stickyHeader={false}
        maxHeight={280}
        className={styles.tableCard}
        hideEmptyIcon
        columns={[
          { key: 'month', label: t('clients.month') },
          { key: 'income', label: t('clients.income') },
          { key: 'net', label: t('clients.net') },
          { key: 'transactions', label: t('clients.operations') },
        ]}
        isEmpty={months.length === 0}
        emptyMessage={t('clients.noFinance')}
      >
        {months.map(([month, data]) => (
          <DataTableRow key={month}>
            <Table.Td>{formatFinanceMonth(month)}</Table.Td>
            <Table.Td>
              <span className={styles.incomeBadge}>{formatPrice(data.income)}</span>
            </Table.Td>
            <Table.Td>{formatPrice(data.net)}</Table.Td>
            <Table.Td>{data.transactions.length}</Table.Td>
          </DataTableRow>
        ))}
      </DataTable>
    </div>
  );
};
