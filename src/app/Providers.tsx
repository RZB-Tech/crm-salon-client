import type { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import { theme } from '@/shared/config';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => (
  <MantineProvider theme={theme}>{children}</MantineProvider>
);
