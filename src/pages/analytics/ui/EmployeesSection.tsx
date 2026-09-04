import React from 'react';
import { Table, Text } from '@mantine/core';
import { useEmployeeAnalytics } from '@/shared/api/hooks/useAnalytics';
import type { AnalyticsFilters } from '@/shared/api/types';
import { formatPrice } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { DataTable, DataTableRow } from '@/shared/ui';
import { shareOf } from '../lib/analyticsHelpers';
import { AnalyticsSection } from './AnalyticsSection';
import styles from './analytics.module.css';

interface EmployeesSectionProps {
  filters: AnalyticsFilters;
}

export const EmployeesSection: React.FC<EmployeesSectionProps> = ({ filters }) => {
  const { t } = useI18n();
  const { data, isLoading, isError } = useEmployeeAnalytics(filters);
  const rows = React.useMemo(() => {
    const items = [...(data?.items ?? [])];
    items.sort((a, b) => b.revenue - a.revenue);
    return items;
  }, [data]);
  const maxRevenue = rows[0]?.revenue ?? 0;

  return (
    <AnalyticsSection title={t('analytics.employees')} loading={isLoading} error={isError}>
      <div className={styles.tableWrap}>
        <DataTable
          compact
          maxHeight={360}
          columns={[
            { key: 'name', label: t('form.employee') },
            { key: 'appointments', label: t('analytics.colAppointments'), align: 'right' },
            { key: 'revenue', label: t('analytics.colRevenue'), align: 'right' },
          ]}
          isEmpty={rows.length === 0}
          emptyMessage={t('analytics.employeesEmpty')}
        >
          {rows.map((row) => (
            <DataTableRow key={row.employee_id}>
              <Table.Td>
                <Text size="sm" fw={600}>
                  {row.employee_fullname}
                </Text>
                <div className={styles.shareTrack}>
                  <div className={styles.shareBar} style={{ width: `${shareOf(row.revenue, maxRevenue)}%` }} />
                </div>
              </Table.Td>
              <Table.Td ta="right">{row.appointments}</Table.Td>
              <Table.Td ta="right">
                <Text size="sm" fw={600}>
                  {formatPrice(row.revenue)}
                </Text>
              </Table.Td>
            </DataTableRow>
          ))}
        </DataTable>
      </div>
    </AnalyticsSection>
  );
};
