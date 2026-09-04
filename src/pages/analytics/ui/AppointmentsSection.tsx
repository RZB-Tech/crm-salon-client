import React from 'react';
import { Box, Text } from '@mantine/core';
import { useAppointmentAnalytics } from '@/shared/api/hooks/useAnalytics';
import type { AnalyticsFilters } from '@/shared/api/types';
import { useI18n } from '@/shared/lib/i18n';
import { shareOf } from '../lib/analyticsHelpers';
import { AnalyticsSection } from './AnalyticsSection';
import styles from './analytics.module.css';

interface AppointmentsSectionProps {
  filters: AnalyticsFilters;
}

export const AppointmentsSection: React.FC<AppointmentsSectionProps> = ({ filters }) => {
  const { t } = useI18n();
  const { data, isLoading, isError } = useAppointmentAnalytics(filters);
  const total = data?.amount ?? 0;
  const rows = data
    ? [
        { key: 'finished', label: t('analytics.appointmentsFinished'), value: data.finished },
        { key: 'cancelled', label: t('analytics.appointmentsCancelled'), value: data.cancelled },
        { key: 'absent', label: t('analytics.appointmentsAbsent'), value: data.absent },
      ]
    : [];

  return (
    <AnalyticsSection title={t('analytics.appointments')} loading={isLoading} error={isError}>
      <Box className={styles.funnel}>
        {rows.map((row) => (
          <Box key={row.key} className={styles.funnelItem}>
            <Text size="sm">{row.label}</Text>
            <Box className={styles.mixTrack}>
              <Box className={styles.mixBar} style={{ width: `${shareOf(row.value, total)}%` }} />
            </Box>
            <Text size="sm" fw={700} ta="right">
              {row.value}
            </Text>
          </Box>
        ))}
      </Box>
    </AnalyticsSection>
  );
};
