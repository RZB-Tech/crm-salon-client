import React from 'react';
import { Group, Button, TextInput, Table, Text, Skeleton, Badge } from '@mantine/core';
import { useEmployeeFinanceReport } from '@/shared/api/hooks/useEmployees';
import { formatPrice } from '@/shared/lib/format';
import styles from '../employee-profile.module.css';

interface FinanceTabProps {
  employeeId: number;
}

export const FinanceTab: React.FC<FinanceTabProps> = ({ employeeId }) => {
  const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo] = React.useState('');

  const { data: report, isLoading, refetch, isFetching } = useEmployeeFinanceReport(
    employeeId,
    dateFrom || undefined,
    dateTo || undefined,
  );

  const entries = React.useMemo(() => Object.entries(report ?? {}), [report]);
  const total = React.useMemo(
    () => entries.reduce((sum, [, amount]) => sum + amount, 0),
    [entries],
  );

  return (
    <div>
      <div className={styles.toolbar}>
        <Text fw={600}>
          Финансовый отчёт {entries.length > 0 ? `· итого ${formatPrice(total)}` : ''}
        </Text>
        <Group gap="sm" align="flex-end">
          <TextInput label="С" type="date" size="sm" value={dateFrom} onChange={(e) => setDateFrom(e.currentTarget.value)} />
          <TextInput label="По" type="date" size="sm" value={dateTo} onChange={(e) => setDateTo(e.currentTarget.value)} />
          <Button size="sm" onClick={() => refetch()} loading={isFetching}>
            Применить
          </Button>
        </Group>
      </div>

      {isLoading ? (
        <Skeleton height={160} radius="md" />
      ) : (
        <Table highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Период</Table.Th>
              <Table.Th>Итог за период</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {entries.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={2}>
                  <Text c="dimmed" ta="center" py="md">
                    Нет данных за выбранный период
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              entries.map(([period, amount]) => (
                <Table.Tr key={period}>
                  <Table.Td>{period}</Table.Td>
                  <Table.Td>
                    <Badge color={amount < 0 ? 'red' : 'green'} variant="light">
                      {formatPrice(amount)}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      )}
    </div>
  );
};
