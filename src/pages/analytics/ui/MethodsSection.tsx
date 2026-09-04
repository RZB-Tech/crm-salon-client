import React from 'react';
import { Box, Text } from '@mantine/core';
import { useTransactionAnalytics } from '@/shared/api/hooks/useAnalytics';
import type { AnalyticsFilters, PaymentMethodStat } from '@/shared/api/types';
import { formatPrice } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { formatPercent, shareOf } from '../lib/analyticsHelpers';
import { AnalyticsSection } from './AnalyticsSection';
import styles from './analytics.module.css';

interface MethodsSectionProps {
  filters: AnalyticsFilters;
}

interface MethodRow {
  key: string;
  label: string;
  stat: PaymentMethodStat;
}

export const MethodsSection: React.FC<MethodsSectionProps> = ({ filters }) => {
  const { t } = useI18n();
  const { data, isLoading, isError } = useTransactionAnalytics(filters);
  const methods = data?.payment_methods;

  const rows = React.useMemo<MethodRow[]>(() => {
    if (!methods) return [];
    const next: MethodRow[] = [
      { key: 'cash', label: t('analytics.methodCash'), stat: methods.cash },
      { key: 'card', label: t('analytics.methodCard'), stat: methods.card },
      { key: 'deposit', label: t('analytics.methodDeposit'), stat: methods.deposit },
      { key: 'gift', label: t('analytics.methodGiftCard'), stat: methods.gift_card },
    ];
    if (methods.bank_transfer) {
      next.push({ key: 'bank', label: t('analytics.methodBank'), stat: methods.bank_transfer });
    }
    return next.filter((row) => row.stat.profit > 0 || row.stat.amount > 0);
  }, [methods, t]);

  const maxProfit = rows.reduce((max, row) => Math.max(max, row.stat.profit), 0);

  return (
    <AnalyticsSection title={t('analytics.methodsTitle')} loading={isLoading} error={isError}>
      {rows.length === 0 ? (
        <Text size="sm" c="dimmed">
          {t('analytics.chartEmpty')}
        </Text>
      ) : (
        <Box className={styles.mixList}>
          {rows.map((row) => (
            <Box key={row.key} className={styles.mixRow}>
              <Box className={styles.mixHead}>
                <Text size="sm" fw={600}>
                  {row.label}
                </Text>
                <Text size="sm" c="dimmed">
                  {formatPrice(row.stat.profit)} · {formatPercent(row.stat.percentage)}
                </Text>
              </Box>
              <Box className={styles.mixTrack}>
                <Box className={styles.mixBar} style={{ width: `${shareOf(row.stat.profit, maxProfit)}%` }} />
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </AnalyticsSection>
  );
};
