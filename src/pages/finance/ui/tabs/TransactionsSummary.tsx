import React from 'react';
import { Box, Text } from '@mantine/core';
import { formatPrice } from '@/shared/lib/format';
import { listPageStyles } from '@/shared/ui';

interface TransactionsSummaryProps {
  income: number;
  expense: number;
  balance: number;
}

export const TransactionsSummary: React.FC<TransactionsSummaryProps> = ({
  income,
  expense,
  balance,
}) => (
  <Box className={listPageStyles.summaryRow}>
    <Box className={listPageStyles.summaryItem}>
      <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
        Доход
      </Text>
      <Text size="lg" fw={700} c="green">
        {formatPrice(income)}
      </Text>
    </Box>
    <Box className={listPageStyles.summaryItem}>
      <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
        Расход
      </Text>
      <Text size="lg" fw={700} c="red">
        {formatPrice(expense)}
      </Text>
    </Box>
    <Box className={listPageStyles.summaryItem}>
      <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
        Баланс
      </Text>
      <Text size="lg" fw={700} c={balance >= 0 ? 'green' : 'red'}>
        {formatPrice(balance)}
      </Text>
    </Box>
  </Box>
);
