import React from 'react';
import { Box, Text } from '@mantine/core';
import { formatPrice } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
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
}) => {
  const { t } = useI18n();
  return (
    <Box className={listPageStyles.summaryRow}>
      <Box className={listPageStyles.summaryItem}>
        <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
          {t('finance.income')}
        </Text>
        <Text size="lg" fw={700} c="green">
          {formatPrice(income)}
        </Text>
      </Box>
      <Box className={listPageStyles.summaryItem}>
        <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
          {t('finance.expense')}
        </Text>
        <Text size="lg" fw={700} c="red">
          {formatPrice(expense)}
        </Text>
      </Box>
      <Box className={listPageStyles.summaryItem}>
        <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
          {t('finance.balance')}
        </Text>
        <Text size="lg" fw={700} c={balance >= 0 ? 'green' : 'red'}>
          {formatPrice(balance)}
        </Text>
      </Box>
    </Box>
  );
};
