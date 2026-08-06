import React from 'react';
import { Badge, Skeleton, Stack, Table, Text } from '@mantine/core';
import { useClientFinanceReport } from '@/shared/api/hooks/useClientFinanceReport';
import { DataTable, DataTableRow, formModalStyles } from '@/shared/ui';
import { formatPrice } from '@/shared/lib/format';

interface ClientFinanceTabProps {
  clientId: number;
}

export const ClientFinanceTab: React.FC<ClientFinanceTabProps> = ({ clientId }) => {
  const { data: financeReport, isLoading } = useClientFinanceReport({ clientID: clientId });

  if (isLoading) return <Skeleton height={120} />;

  if (!financeReport || Object.keys(financeReport.items).length === 0) {
    return <div className={formModalStyles.emptyState}>Финансовых данных нет</div>;
  }

  return (
    <Stack gap='sm'>
      <Text size='sm' fw={600}>
        Итого: {formatPrice(financeReport.total)}
      </Text>
      <DataTable
        compact
        stickyHeader={false}
        maxHeight={320}
        columns={[
          { key: 'month', label: 'Месяц' },
          { key: 'income', label: 'Доход' },
          { key: 'net', label: 'Нетто' },
          { key: 'transactions', label: 'Операций' }
        ]}
        isEmpty={false}
        emptyMessage=''
      >
        {Object.entries(financeReport.items).map(([month, data]) => (
          <DataTableRow key={month}>
            <Table.Td>
              <Text size='xs'>{month}</Text>
            </Table.Td>
            <Table.Td>
              <Text size='xs' c='green'>
                {formatPrice(data.income)}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text size='xs' fw={600}>
                {formatPrice(data.net)}
              </Text>
            </Table.Td>
            <Table.Td>
              <Badge size='xs' variant='light'>
                {data.transactions.length}
              </Badge>
            </Table.Td>
          </DataTableRow>
        ))}
      </DataTable>
    </Stack>
  );
};
