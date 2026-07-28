import React from 'react';
import { Box, Skeleton, Stack } from '@mantine/core';
import styles from './page-skeleton.module.css';

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
      <Box p="xl">
        <Skeleton height={48} mb="lg" />
        <Box className={styles.cardsGrid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} height={180} radius="lg" />
          ))}
        </Box>
      </Box>
    );
  }

  // table variant
  return (
    <Box p="xl">
      <Skeleton height={48} mb="lg" />
      <Skeleton height={56} mb="sm" />
      <Stack gap="sm">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} height={48} radius="md" />
        ))}
      </Stack>
    </Box>
  );
};
