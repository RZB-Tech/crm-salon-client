import React from 'react';
import { Alert, Text } from '@mantine/core';
import { ListTabs } from '@/shared/ui';
import { useTransactionPeriodAnalytics } from '@/shared/api/hooks/useAnalytics';
import type { AnalyticsFilters, AnalyticsPeriod } from '@/shared/api/types';
import { useI18n } from '@/shared/lib/i18n';
import {
  ANALYTICS_PERIODS,
  PERIOD_LABEL_KEY,
  isPeriodValid,
} from '../lib/analyticsHelpers';
import { AnalyticsSection } from './AnalyticsSection';
import { RevenueChart } from './RevenueChart';

interface TransactionsSectionProps {
  filters: AnalyticsFilters;
  period: AnalyticsPeriod;
  periodValid: boolean;
  startDate: string;
  endDate: string;
  onPeriodChange: (period: AnalyticsPeriod) => void;
}

export const TransactionsSection: React.FC<TransactionsSectionProps> = ({
  filters,
  period,
  periodValid,
  startDate,
  endDate,
  onPeriodChange,
}) => {
  const { t } = useI18n();
  const periodQuery = useTransactionPeriodAnalytics({ ...filters, period }, periodValid);
  const periodItems = periodQuery.data?.items ?? [];
  const periodTabs = React.useMemo(
    () =>
      ANALYTICS_PERIODS.map((value) => ({
        value,
        label: t(PERIOD_LABEL_KEY[value]),
        disabled: !isPeriodValid(startDate, endDate, value),
      })),
    [endDate, startDate, t],
  );
  const handlePeriodChange = React.useCallback(
    (value: string) => {
      if (value) onPeriodChange(value as AnalyticsPeriod);
    },
    [onPeriodChange],
  );

  return (
    <AnalyticsSection
      title={t('analytics.chartTitle')}
      loading={periodQuery.isLoading}
      error={periodQuery.isError}
      action={
        <ListTabs size="xs" value={period} onChange={handlePeriodChange} data={periodTabs} />
      }
    >
      {!periodValid ? (
        <Alert color="yellow">{t('analytics.periodInvalid')}</Alert>
      ) : periodItems.length === 0 ? (
        <Text size="sm" c="dimmed">
          {t('analytics.chartEmpty')}
        </Text>
      ) : (
        <RevenueChart items={periodItems} period={period} />
      )}
    </AnalyticsSection>
  );
};
