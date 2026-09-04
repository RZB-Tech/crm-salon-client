import React from 'react';
import { Box, Text } from '@mantine/core';
import type { AnalyticsPeriod, TransactionPeriodItem } from '@/shared/api/types';
import { formatPrice } from '@/shared/lib/format';
import { formatPeriodLabel, shareOf } from '../lib/analyticsHelpers';
import styles from './analytics.module.css';

interface RevenueChartProps {
  items: TransactionPeriodItem[];
  period: AnalyticsPeriod;
}

const compactMoney = (value: number): string => {
  if (value >= 1_000_000) return `${Math.round(value / 100_000) / 10}m`;
  if (value >= 1000) return `${Math.round(value / 100) / 10}k`;
  return String(value);
};

export const RevenueChart: React.FC<RevenueChartProps> = ({ items, period }) => {
  const maxRevenue = React.useMemo(
    () => items.reduce((max, item) => Math.max(max, item.revenue), 0),
    [items],
  );
  const showValues = items.length <= 16;

  return (
    <Box className={styles.chart}>
      {items.map((item) => {
        const height = Math.max(shareOf(item.revenue, maxRevenue), item.revenue > 0 ? 6 : 0);
        return (
          <Box key={item.date} className={styles.chartCol} title={formatPrice(item.revenue)}>
            {showValues ? <Text className={styles.chartValue}>{compactMoney(item.revenue)}</Text> : null}
            <Box className={styles.chartTrack}>
              <Box className={styles.chartBar} style={{ height: `${height}%` }} />
            </Box>
            <Text size="xs" c="dimmed" ta="center">
              {formatPeriodLabel(item.date, period)}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
};
