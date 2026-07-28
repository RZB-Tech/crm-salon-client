import React from 'react';
import { Box, Group, Stack, Text, Title } from '@mantine/core';
import styles from './list-page.module.css';

interface ListPageProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  filters?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const ListPage: React.FC<ListPageProps> = ({
  title,
  subtitle,
  actions,
  filters,
  children,
  className,
}) => (
  <Stack
    gap='lg'
    p='xl'
    h='100%'
    className={[styles.root, className].filter(Boolean).join(' ')}
  >
    <Group justify='space-between' align='flex-start' wrap='wrap' gap='md'>
      <Box>
        <Title order={3}>{title}</Title>
        {subtitle && (
          <Text size='sm' c='dimmed' mt={2}>
            {subtitle}
          </Text>
        )}
      </Box>
      {actions}
    </Group>
    {filters}
    {children}
  </Stack>
);
