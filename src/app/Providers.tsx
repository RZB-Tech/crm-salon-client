import type { ReactNode } from 'react';
import { MantineProvider, Modal } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { Notifications } from '@mantine/notifications';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import 'dayjs/locale/ru';
import 'dayjs/locale/uz-latn';
import { theme } from '@/shared/config';
import { addNotification } from '@/shared/lib/notifications';
import { NotificationsWsProvider } from '@/shared/lib/notifications/NotificationsWsProvider';
import { LoadingProvider } from '@/shared/lib/contexts/LoadingContext';
import { ApiError, getApiErrorMessage } from '@/shared/api/client';
import { I18nProvider, t, useI18n } from '@/shared/lib/i18n';

import '@mantine/notifications/styles.css';

const getErrorMessage = (error: Error): string => {
  if (error instanceof ApiError) {
    const mapped = getApiErrorMessage(error.errorCode);
    if (mapped) return mapped;
    if (error.status === 403) return t('common.noAccess');
    if (error.status === 404) return t('common.resourceMissing');
    if (error.status === 422) return t('common.validationError');
    if (error.status >= 500) return t('common.serverError');
    return t('common.unknownError');
  }
  if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
    return t('common.networkError');
  }
  return error.message || t('common.unknownError');
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof ApiError && error.status === 401) return;
      addNotification.error({ message: getErrorMessage(error as Error) });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.options.onError) return;
      addNotification.error({ message: getErrorMessage(error as Error) });
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

const LocaleDatesProvider = ({ children }: { children: ReactNode }) => {
  const { locale } = useI18n();
  return (
    <DatesProvider
      settings={{
        locale: locale === 'uz' ? 'uz-latn' : 'ru',
        firstDayOfWeek: 1,
        weekendDays: [0, 6],
      }}
    >
      {children}
    </DatesProvider>
  );
};

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => (
  <I18nProvider>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <Modal.Stack>
          <LocaleDatesProvider>
            <Notifications position="top-right" zIndex={1000} transitionDuration={220} />
            <BrowserRouter>
              <LoadingProvider>
                <NotificationsWsProvider>{children}</NotificationsWsProvider>
              </LoadingProvider>
            </BrowserRouter>
          </LocaleDatesProvider>
        </Modal.Stack>
      </MantineProvider>
    </QueryClientProvider>
  </I18nProvider>
);
