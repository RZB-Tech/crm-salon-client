import React from 'react';
import { Box, Loader } from '@mantine/core';
import styles from './background-refresh-indicator.module.css';

interface BackgroundRefreshIndicatorProps {
  isRefreshing: boolean;
}

/**
 * Ненавязчивый индикатор фоновой загрузки данных.
 * Показывается в правом верхнем углу без блокировки UI.
 */
export const BackgroundRefreshIndicator: React.FC<BackgroundRefreshIndicatorProps> = ({
  isRefreshing,
}) => {
  if (!isRefreshing) return null;

  return (
    <Box className={styles.indicator}>
      <Loader size="xs" />
      Обновление...
    </Box>
  );
};
