import type { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { theme } from '@/shared/config';
import { addNotification } from '@/shared/lib/notifications';
import { NotificationsWsProvider } from '@/shared/lib/notifications/NotificationsWsProvider';
import { ApiError } from '@/shared/api/client';

import '@mantine/notifications/styles.css';

/** Человекочитаемое сообщение из ошибки API */
const getErrorMessage = (error: Error): string => {
  if (error instanceof ApiError) {
    if (error.status === 403) return 'Нет доступа';
    if (error.status === 404) return 'Ресурс не найден';
    if (error.status >= 500) return 'Ошибка сервера. Попробуйте позже';
    return error.message;
  }
  if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
    return 'Нет связи с сервером';
  }
  return error.message || 'Неизвестная ошибка';
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      // 401 обрабатывается в apiRequest (редирект на /login)
      if (error instanceof ApiError && error.status === 401) return;

      addNotification.error({ message: getErrorMessage(error as Error) });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      // Если у мутации есть собственный onError — не дублируем тост
      if (mutation.options.onError) return;

      addNotification.error({ message: getErrorMessage(error as Error) });
    },
  }),
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
