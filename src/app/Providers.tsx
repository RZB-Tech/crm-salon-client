import type { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { theme } from '@/shared/config';
import { NotificationsWsProvider } from '@/shared/lib/notifications/NotificationsWsProvider';

import '@mantine/notifications/styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // Данные свежие 2 минуты (агрессивный кэш)
      gcTime: 10 * 60 * 1000, // Кэш хранится 10 минут в памяти
      retry: 1,
      refetchOnWindowFocus: false, // Не перезагружать при возврате на вкладку
      refetchOnMount: false, // ⚠️ НЕ перезагружать при монтировании — используем кэш
      refetchOnReconnect: true, // Только при восстановлении сети
      // Запросы будут выполняться только при первом вызове или по истечению staleTime
    },
    mutations: {
      retry: 1,
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => (
  <QueryClientProvider client={queryClient}>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="top-right" zIndex={1000} />
      <BrowserRouter>
        <NotificationsWsProvider>{children}</NotificationsWsProvider>
      </BrowserRouter>
    </MantineProvider>
  </QueryClientProvider>
);
