import React from 'react';
import { useServiceAnalytics } from '@/shared/api/hooks/useAnalytics';
import type { AnalyticsFilters } from '@/shared/api/types';
import { useI18n } from '@/shared/lib/i18n';
import { AnalyticsRankedTable, type AnalyticsRankedRow } from './AnalyticsRankedTable';

interface ServicesSectionProps {
  filters: AnalyticsFilters;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ filters }) => {
  const { t } = useI18n();
  const { data, isLoading, isError } = useServiceAnalytics(filters);
  const rows = React.useMemo<AnalyticsRankedRow[]>(() => {
    const items = [...(data?.items ?? [])];
    items.sort((a, b) => b.revenue - a.revenue);
    return items.map((item) => ({
      id: item.service_id,
      name: item.service_name,
      revenue: item.revenue,
      metrics: [item.amount],
    }));
  }, [data]);

  return (
    <AnalyticsRankedTable
      title={t('analytics.services')}
      loading={isLoading}
      error={isError}
      columns={[
        { key: 'name', label: t('form.service') },
        { key: 'amount', label: t('analytics.colAmount'), align: 'right' },
        { key: 'revenue', label: t('analytics.colRevenue'), align: 'right' },
      ]}
      rows={rows}
      emptyMessage={t('analytics.servicesEmpty')}
    />
  );
};
