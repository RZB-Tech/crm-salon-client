import React from 'react';
import { Text } from '@mantine/core';
import { useTransactionAnalytics } from '@/shared/api/hooks/useAnalytics';
import type { AnalyticsFilters, PaymentMethodStat } from '@/shared/api/types';
import { formatPrice } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { formatPercent } from '../lib/analyticsHelpers';
import { AnalyticsMixBars, type AnalyticsMixRow } from './AnalyticsMixBars';
import { AnalyticsSection } from './AnalyticsSection';
import styles from './analytics.module.css';

interface MethodsSectionProps {
  filters: AnalyticsFilters;
}

interface MixSource {
  key: string;
  label: string;
  stat: PaymentMethodStat | undefined;
  caption: (stat: PaymentMethodStat) => string;
}

const toRows = (sources: MixSource[]): AnalyticsMixRow[] =>
  sources.reduce<AnalyticsMixRow[]>((rows, source) => {
    const stat = source.stat;
    if (!stat || (stat.profit <= 0 && stat.amount <= 0)) return rows;
    rows.push({
      key: source.key,
      label: source.label,
      value: stat.profit,
      caption: source.caption(stat),
    });
    return rows;
  }, []);

export const MethodsSection: React.FC<MethodsSectionProps> = ({ filters }) => {
  const { t } = useI18n();
  const { data, isLoading, isError } = useTransactionAnalytics(filters);

  const methodCaption = React.useCallback(
    (stat: PaymentMethodStat) => `${formatPrice(stat.profit)} · ${formatPercent(stat.percentage)}`,
    [],
  );
  const mixCaption = React.useCallback(
    (stat: PaymentMethodStat) =>
      `${formatPrice(stat.profit)} · ${t('analytics.operations', { count: stat.amount })}`,
    [t],
  );

  const methodRows = React.useMemo(() => {
    const methods = data?.payment_methods;
    if (!methods) return [];
    return toRows([
      { key: 'cash', label: t('analytics.methodCash'), stat: methods.cash, caption: methodCaption },
      { key: 'card', label: t('analytics.methodCard'), stat: methods.card, caption: methodCaption },
      { key: 'deposit', label: t('analytics.methodDeposit'), stat: methods.deposit, caption: methodCaption },
      { key: 'gift', label: t('analytics.methodGiftCard'), stat: methods.gift_card, caption: methodCaption },
      { key: 'bank', label: t('analytics.methodBank'), stat: methods.bank_transfer, caption: methodCaption },
    ]);
  }, [data?.payment_methods, methodCaption, t]);

  const mixRows = React.useMemo(() => {
    if (!data) return [];
    return toRows([
      { key: 'by-service', label: t('analytics.byService'), stat: data.by_service, caption: mixCaption },
      { key: 'by-material', label: t('analytics.byMaterial'), stat: data.by_material, caption: mixCaption },
      { key: 'by-gift', label: t('analytics.byGiftCard'), stat: data.by_giftCard, caption: mixCaption },
    ]);
  }, [data, mixCaption, t]);

  return (
    <AnalyticsSection title={t('analytics.methodsTitle')} loading={isLoading} error={isError}>
      <div className={styles.mixGroup}>
        <AnalyticsMixBars rows={methodRows} empty={t('analytics.chartEmpty')} />
      </div>
      {mixRows.length > 0 ? (
        <div className={styles.mixGroup}>
          <Text className={styles.mixGroupTitle}>{t('analytics.mixTitle')}</Text>
          <AnalyticsMixBars rows={mixRows} empty={t('analytics.chartEmpty')} />
        </div>
      ) : null}
    </AnalyticsSection>
  );
};
