import React from 'react';
import { Box, Text } from '@mantine/core';
import { shareOf } from '../lib/analyticsHelpers';
import styles from './analytics.module.css';

export interface AnalyticsMixRow {
  key: string;
  label: string;
  value: number;
  caption: string;
}

interface AnalyticsMixBarsProps {
  rows: AnalyticsMixRow[];
  empty: string;
}

export const AnalyticsMixBars: React.FC<AnalyticsMixBarsProps> = ({ rows, empty }) => {
  const maxValue = rows.reduce((max, row) => Math.max(max, row.value), 0);

  if (rows.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        {empty}
      </Text>
    );
  }

  return (
    <Box className={styles.mixList}>
      {rows.map((row) => (
        <Box key={row.key} className={styles.mixRow}>
          <Box className={styles.mixHead}>
            <Text size="sm" fw={600}>
              {row.label}
            </Text>
            <Text size="sm" c="dimmed">
              {row.caption}
            </Text>
          </Box>
          <Box className={styles.mixTrack}>
            <Box className={styles.mixBar} style={{ width: `${shareOf(row.value, maxValue)}%` }} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};
