import React from 'react';
import { Alert, Skeleton } from '@mantine/core';
import { useI18n } from '@/shared/lib/i18n';
import styles from './analytics.module.css';

interface AnalyticsSectionProps {
  title: string;
  loading: boolean;
  error: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  title,
  loading,
  error,
  action,
  children,
}) => {
  const { t } = useI18n();

  return (
    <section className={styles.card}>
      <div className={styles.cardHead}>
        <h2 className={styles.cardTitle}>{title}</h2>
        {action}
      </div>
      {loading ? <Skeleton height={180} radius="md" /> : null}
      {error ? (
        <Alert color="red" title={t('analytics.loadError')}>
          {t('common.checkApi')}
        </Alert>
      ) : null}
      {!loading && !error ? children : null}
    </section>
  );
};
