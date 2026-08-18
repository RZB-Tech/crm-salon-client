import React from 'react';
import { Skeleton, Table } from '@mantine/core';
import { useClientFinanceReport } from '@/shared/api/hooks/useClientFinanceReport';
import { DataTable, DataTableRow } from '@/shared/ui';
import { formatPrice } from '@/shared/lib/format';
import { formatFinanceMonth } from '../lib/clientDisplay';
import styles from './client-modals.module.css';

interface ClientFinanceTabProps {
  clientId: number;
}

export const ClientFinanceTab: React.FC<ClientFinanceTabProps> = ({ clientId }) => {
  const { data: financeReport, isLoading } = useClientFinanceReport({ clientID: clientId });
  const months = Object.entries(financeReport?.items ?? {});

  if (isLoading) return <Skeleton height={120} />;

  return (
    <div className={styles.tableBlock}>
      <p className={styles.tableLabel}>Финансы</p>
      <DataTable
        compact
        stickyHeader={false}
        maxHeight={280}
        className={styles.tableCard}
        hideEmptyIcon
        columns={[
          { key: 'month', label: 'Месяц' },
          { key: 'income', label: 'Доход' },
          { key: 'net', label: 'Нетто' },
          { key: 'transactions', label: 'Операции' },
        ]}
        isEmpty={months.length === 0}
        emptyMessage="Финансовых данных нет"
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
