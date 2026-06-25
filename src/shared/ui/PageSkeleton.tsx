import React from 'react';
import { Skeleton, Stack } from '@mantine/core';

interface PageSkeletonProps {
  variant?: 'table' | 'cards' | 'board';
}

export const PageSkeleton: React.FC<PageSkeletonProps> = ({ variant = 'table' }) => {
  if (variant === 'board') {
    return (
      <Stack gap={0} h="100%">
        <Skeleton height={56} radius={0} />
        <Skeleton height="100%" radius={0} />
      </Stack>
    );
  }

  if (variant === 'cards') {
    return (
      <div style={{ padding: '24px' }}>
        <Skeleton height={48} mb="lg" />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} height={180} radius="lg" />
          ))}
        </div>
      </div>
    );
  }

  // table variant
  return (
    <div style={{ padding: '24px' }}>
      <Skeleton height={48} mb="lg" />
      <Skeleton height={56} mb="sm" />
      <Stack gap="sm">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} height={48} radius="md" />
        ))}
      </Stack>
    </div>
  );
};
