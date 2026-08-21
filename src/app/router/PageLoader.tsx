import React from 'react';
import { Box, Center, Loader, Stack, Text } from '@mantine/core';
import { useI18n } from '@/shared/lib/i18n';

export const PageLoader: React.FC = () => {
  const { t } = useI18n();
  return (
    <Center h="100%" style={{ animation: 'fade-in 280ms ease both' }}>
      <Stack align="center" gap="sm">
        <Box style={{ animation: 'soft-pulse 1.2s ease-in-out infinite' }}>
          <Loader size="lg" color="sage" type="dots" />
        </Box>
        <Text size="sm" c="dimmed">
          {t('common.loading')}
        </Text>
      </Stack>
    </Center>
  );
};
