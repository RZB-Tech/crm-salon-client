import React from 'react';
import { Skeleton, Text } from '@mantine/core';
import { useI18n } from '@/shared/lib/i18n';
import { formatDelta } from '../lib/analyticsHelpers';
import styles from './analytics.module.css';

interface AnalyticsKpiCardProps {
  label: string;
  value: string;
  hint?: string;
  delta: number | null;
  hero?: boolean;
  loading?: boolean;
}

export const AnalyticsKpiCard: React.FC<AnalyticsKpiCardProps> = ({
  label,
  value,
  hint,
  delta,
  hero = false,
  loading = false,
}) => {
  const { t } = useI18n();

  if (loading) {
    return <Skeleton height={108} radius={16} />;
  }

  const deltaClass = delta == null ? '' : delta > 0 ? styles.deltaUp : delta < 0 ? styles.deltaDown : styles.deltaFlat;

  return (
    <div className={`${styles.kpi}${hero ? ` ${styles.kpiHero}` : ''}`}>
      <span className={styles.kpiLabel}>{label}</span>
      <span className={styles.kpiValue}>{value}</span>
      <div className={styles.kpiMeta}>
        {delta != null ? (
          <Text className={deltaClass} span>
            {formatDelta(delta)} {t('analytics.vsPrevious')}
          </Text>
        ) : null}
        {hint ? (
          <Text size="xs" c="dimmed">
            {hint}
          </Text>
        ) : null}
      </div>
    </div>
  );
};
