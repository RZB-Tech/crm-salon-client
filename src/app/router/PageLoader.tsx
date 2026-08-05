import React from 'react';
import { Box, Center, Loader, Stack, Text } from '@mantine/core';

export const PageLoader: React.FC = () => (
  <Center h="100%" style={{ animation: 'fade-in 280ms ease both' }}>
    <Stack align="center" gap="sm">
      <Box style={{ animation: 'soft-pulse 1.2s ease-in-out infinite' }}>
        <Loader size="lg" color="sage" type="dots" />
      </Box>
      <Text size="sm" c="dimmed">
        Загрузка…
      </Text>
    </Stack>
  </Center>
);
