import React from 'react';
import { Box, Skeleton, Stack } from '@mantine/core';
import styles from './board-page.module.css';

export const BoardSkeleton: React.FC = () => (
  <Stack gap={0} h="100%" className={styles.skeletonRoot}>
    <Skeleton height={56} radius={0} mb={0} />
    <Box className={styles.skeletonBody}>
      <Skeleton height="100%" width="100%" radius={0} />
      <Skeleton height="100%" width={320} radius={0} />
    </Box>
  </Stack>
);
