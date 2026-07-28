import React from 'react';
import { Group, Stack, Text, Title } from '@mantine/core';

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
    className={className}
    style={{ overflowY: 'auto', background: 'var(--mantine-color-gray-0)' }}
  >
    <Group justify='space-between' align='flex-start' wrap='wrap' gap='md'>
      <div>
        <Title order={3}>{title}</Title>
        {subtitle && (
          <Text size='sm' c='dimmed' mt={2}>
            {subtitle}
          </Text>
        )}
      </div>
      {actions}
    </Group>
    {filters}
    {children}
  </Stack>
);
