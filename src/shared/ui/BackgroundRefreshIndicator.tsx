import React from 'react';
import { Loader } from '@mantine/core';

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
    <div
      style={{
        position: 'fixed',
        top: 72,
        right: 16,
        zIndex: 100,
        background: 'var(--mantine-color-white)',
        padding: '8px 12px',
        borderRadius: '8px',
        boxShadow: 'var(--mantine-shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '12px',
        color: 'var(--mantine-color-dimmed)',
      }}
    >
      <Loader size="xs" />
      Обновление...
    </div>
  );
};
