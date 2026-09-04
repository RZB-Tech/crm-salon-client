import React from 'react';
import { Skeleton, Text } from '@mantine/core';
import {
  useAppointmentAnalytics,
  useReceiptAnalytics,
  useTransactionAnalytics,
} from '@/shared/api/hooks/useAnalytics';
import type { AnalyticsFilters } from '@/shared/api/types';
import { formatPrice } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { deltaPercent, formatDelta } from '../lib/analyticsHelpers';
import styles from './analytics.module.css';

interface AnalyticsHeroProps {
  filters: AnalyticsFilters;
  previousFilters: AnalyticsFilters;
  canReceipts: boolean;
  canAppointments: boolean;
  canTransactions: boolean;
}

interface HeroCard {
  key: string;
  label: string;
  value: string;
  hint?: string;
  delta: number | null;
  hero?: boolean;
}

const Delta: React.FC<{ value: number | null }> = ({ value }) => {
  const { t } = useI18n();
  if (value == null) return null;
  const cls = value > 0 ? styles.deltaUp : value < 0 ? styles.deltaDown : styles.deltaFlat;
  return (
    <Text className={cls} span>
      {formatDelta(value)} {t('analytics.vsPrevious')}
    </Text>
  );
};

export const AnalyticsHero: React.FC<AnalyticsHeroProps> = ({
  filters,
  previousFilters,
  canReceipts,
  canAppointments,
  canTransactions,
}) => {
  const { t } = useI18n();
  const receipts = useReceiptAnalytics(filters, canReceipts);
  const prevReceipts = useReceiptAnalytics(previousFilters, canReceipts);
  const appointments = useAppointmentAnalytics(filters, canAppointments);
  const prevAppointments = useAppointmentAnalytics(previousFilters, canAppointments);
  const transactions = useTransactionAnalytics(filters, canTransactions);
  const prevTransactions = useTransactionAnalytics(previousFilters, canTransactions);

  const loading =
    (canReceipts && receipts.isLoading) ||
    (canAppointments && appointments.isLoading) ||
    (canTransactions && transactions.isLoading);

  const cards = React.useMemo<HeroCard[]>(() => {
    const next: HeroCard[] = [];
    if (canTransactions && transactions.data) {
      next.push({
        key: 'revenue',
        label: t('analytics.totalProfit'),
        value: formatPrice(transactions.data.total_profit),
        hint: t('analytics.unpaidReceiptsHint', {
          amount: formatPrice(transactions.data.not_fully_paid_receipts_sum),
        }),
        delta: deltaPercent(
          transactions.data.total_profit,
          prevTransactions.data?.total_profit ?? 0,
        ),
        hero: true,
      });
    }
    if (canAppointments && appointments.data) {
      next.push({
        key: 'visits',
        label: t('analytics.appointmentsTotal'),
        value: String(appointments.data.amount),
        hint: t('analytics.finishedHint', { count: appointments.data.finished }),
        delta: deltaPercent(appointments.data.amount, prevAppointments.data?.amount ?? 0),
      });
    }
    if (canReceipts && receipts.data) {
      next.push({
        key: 'avg',
        label: t('analytics.receiptsAverage'),
        value: formatPrice(receipts.data.average_receipt_sum),
        hint: t('analytics.receiptsPaidHint', { count: receipts.data.paid }),
        delta: deltaPercent(
          receipts.data.average_receipt_sum,
          prevReceipts.data?.average_receipt_sum ?? 0,
        ),
      });
      next.push({
        key: 'paid',
        label: t('analytics.receiptsPaidSum'),
        value: formatPrice(receipts.data.total_paid_sum),
        hint: t('analytics.receiptsUnpaidHint', { count: receipts.data.unpaid }),
        delta: deltaPercent(receipts.data.total_paid_sum, prevReceipts.data?.total_paid_sum ?? 0),
      });
    }
    return next;
  }, [
    appointments.data,
    canAppointments,
    canReceipts,
    canTransactions,
    prevAppointments.data,
    prevReceipts.data,
    prevTransactions.data,
    receipts.data,
    t,
    transactions.data,
  ]);

  if (loading) {
    return (
      <div className={styles.heroGrid}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} height={108} radius={16} />
        ))}
      </div>
    );
  }

  if (cards.length === 0) return null;

  return (
    <div className={styles.heroGrid}>
      {cards.map((card) => (
        <div key={card.key} className={`${styles.kpi}${card.hero ? ` ${styles.kpiHero}` : ''}`}>
          <span className={styles.kpiLabel}>{card.label}</span>
          <span className={styles.kpiValue}>{card.value}</span>
          <div className={styles.kpiMeta}>
            <Delta value={card.delta} />
            {card.hint ? (
              <Text size="xs" c="dimmed">
                {card.hint}
              </Text>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};
