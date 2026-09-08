import React from 'react';
import { Alert } from '@mantine/core';
import {
  useAppointmentAnalytics,
  useReceiptAnalytics,
  useTransactionAnalytics,
} from '@/shared/api/hooks/useAnalytics';
import type { AnalyticsFilters } from '@/shared/api/types';
import { formatPrice } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { deltaPercent } from '../lib/analyticsHelpers';
import { AnalyticsKpiCard } from './AnalyticsKpiCard';
import styles from './analytics.module.css';

interface AnalyticsHeroProps {
  filters: AnalyticsFilters;
  previousFilters: AnalyticsFilters;
  canReceipts: boolean;
  canAppointments: boolean;
  canTransactions: boolean;
}

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

  const failed =
    (canTransactions && transactions.isError) ||
    (canAppointments && appointments.isError) ||
    (canReceipts && receipts.isError);

  const cards: React.ReactNode[] = [];
  if (canTransactions && (transactions.isLoading || transactions.data)) {
    cards.push(
      <AnalyticsKpiCard
        key="revenue"
        hero
        loading={transactions.isLoading}
        label={t('analytics.totalProfit')}
        value={formatPrice(transactions.data?.total_profit ?? 0)}
        hint={
          transactions.data
            ? t('analytics.unpaidReceiptsHint', {
                amount: formatPrice(transactions.data.not_fully_paid_receipts_sum),
              })
            : undefined
        }
        delta={deltaPercent(
          transactions.data?.total_profit ?? 0,
          prevTransactions.data?.total_profit ?? 0,
        )}
      />,
    );
  }
  if (canAppointments && (appointments.isLoading || appointments.data)) {
    cards.push(
      <AnalyticsKpiCard
        key="visits"
        loading={appointments.isLoading}
        label={t('analytics.appointmentsTotal')}
        value={String(appointments.data?.amount ?? 0)}
        hint={
          appointments.data
            ? t('analytics.finishedHint', { count: appointments.data.finished })
            : undefined
        }
        delta={deltaPercent(appointments.data?.amount ?? 0, prevAppointments.data?.amount ?? 0)}
      />,
    );
  }
  if (canReceipts && (receipts.isLoading || receipts.data)) {
    cards.push(
      <AnalyticsKpiCard
        key="avg"
        loading={receipts.isLoading}
        label={t('analytics.receiptsAverage')}
        value={formatPrice(receipts.data?.average_receipt_sum ?? 0)}
        hint={receipts.data ? t('analytics.receiptsPaidHint', { count: receipts.data.paid }) : undefined}
        delta={deltaPercent(
          receipts.data?.average_receipt_sum ?? 0,
          prevReceipts.data?.average_receipt_sum ?? 0,
        )}
      />,
      <AnalyticsKpiCard
        key="paid"
        loading={receipts.isLoading}
        label={t('analytics.receiptsPaidSum')}
        value={formatPrice(receipts.data?.total_paid_sum ?? 0)}
        hint={
          receipts.data ? t('analytics.receiptsUnpaidHint', { count: receipts.data.unpaid }) : undefined
        }
        delta={deltaPercent(
          receipts.data?.total_paid_sum ?? 0,
          prevReceipts.data?.total_paid_sum ?? 0,
        )}
      />,
    );
  }

  if (!failed && cards.length === 0) return null;

  return (
    <div className={styles.heroStack}>
      {failed ? (
        <Alert color="red" title={t('analytics.loadError')}>
          {t('common.checkApi')}
        </Alert>
      ) : null}
      {cards.length > 0 ? <div className={styles.heroGrid}>{cards}</div> : null}
    </div>
  );
};
