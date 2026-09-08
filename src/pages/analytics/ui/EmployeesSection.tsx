import React from 'react';
import { useEmployeeAnalytics } from '@/shared/api/hooks/useAnalytics';
import type { AnalyticsFilters } from '@/shared/api/types';
import { useI18n } from '@/shared/lib/i18n';
import { AnalyticsRankedTable, type AnalyticsRankedRow } from './AnalyticsRankedTable';

interface EmployeesSectionProps {
  filters: AnalyticsFilters;
}

export const EmployeesSection: React.FC<EmployeesSectionProps> = ({ filters }) => {
  const { t } = useI18n();
  const { data, isLoading, isError } = useEmployeeAnalytics(filters);
  const rows = React.useMemo<AnalyticsRankedRow[]>(() => {
    const items = [...(data?.items ?? [])];
    items.sort((a, b) => b.revenue - a.revenue);
    return items.map((item) => ({
      id: item.employee_id,
      name: item.employee_fullname,
      revenue: item.revenue,
      metrics: [item.appointments, item.services],
    }));
  }, [data]);

  return (
    <AnalyticsRankedTable
      title={t('analytics.employees')}
      loading={isLoading}
      error={isError}
      columns={[
        { key: 'name', label: t('form.employee') },
        { key: 'appointments', label: t('analytics.colAppointments'), align: 'right' },
        { key: 'services', label: t('analytics.colServices'), align: 'right' },
        { key: 'revenue', label: t('analytics.colRevenue'), align: 'right' },
      ]}
      rows={rows}
      emptyMessage={t('analytics.employeesEmpty')}
    />
  );
};
