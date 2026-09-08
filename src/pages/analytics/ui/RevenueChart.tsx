import React from 'react';
import { Box, Text } from '@mantine/core';
import type { AnalyticsPeriod, TransactionPeriodItem } from '@/shared/api/types';
import { formatPrice } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { formatPeriodLabel, shareOf } from '../lib/analyticsHelpers';
import styles from './analytics.module.css';

interface RevenueChartProps {
  items: TransactionPeriodItem[];
  period: AnalyticsPeriod;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ items, period }) => {
  const { t } = useI18n();
  const maxRevenue = React.useMemo(
    () => items.reduce((max, item) => Math.max(max, item.revenue), 0),
    [items],
  );
  const showValues = items.length <= 16;

  return (
    <Box className={styles.chart}>
      {items.map((item) => {
        const height = Math.max(shareOf(item.revenue, maxRevenue), item.revenue > 0 ? 6 : 0);
        const periodLabel = formatPeriodLabel(item.date, period);
        const axisLabel =
          period === 'by week' ? t('analytics.weekLabel', { week: periodLabel }) : periodLabel;
        return (
          <Box key={item.date} className={styles.chartCol} title={formatPrice(item.revenue)}>
            {showValues ? (
              <Text className={styles.chartValue}>{formatPrice(item.revenue)}</Text>
            ) : null}
            <Box className={styles.chartTrack}>
              <Box className={styles.chartBar} style={{ height: `${height}%` }} />
            </Box>
            <Text size="xs" c="dimmed" ta="center">
              {axisLabel}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
};
