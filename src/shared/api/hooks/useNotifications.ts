import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  apiFetchAllPost,
  apiPost,
  apiRequest,
} from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  SalonNotification,
  SalonNotificationCreatePayload,
  SalonNotificationReadPayload,
} from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const useNotifications = () =>
  useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: () => apiFetchAllPost<SalonNotification>('/api/v1/notifications'),
  });

export const useNotification = (id: number) =>
  useQuery({
    queryKey: queryKeys.notifications.detail(id),
    queryFn: () => apiRequest<SalonNotification>(`/api/v1/notifications/${id}`),
    enabled: id > 0,
  });

export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SalonNotificationCreatePayload) =>
      apiPost<SalonNotification, SalonNotificationCreatePayload>(
        '/api/v1/notifications',
        payload,
      ),
    onSuccess: (created) => {
      queryClient.setQueryData<SalonNotification[]>(queryKeys.notifications.all, (old) => {
        if (!old) return [created];
        if (old.some((item) => item.id === created.id)) return old;
        return [created, ...old];
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      addNotification.success({ message: 'Уведомление создано' });
    },
  });
};

export const useReadNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SalonNotificationReadPayload) =>
      apiPost<SalonNotification, SalonNotificationReadPayload>(
        '/api/v1/notifications/read',
        payload,
      ),
    onSuccess: (updated) => {
      queryClient.setQueryData<SalonNotification[]>(queryKeys.notifications.all, (old) =>
        old ? old.map((item) => (item.id === updated.id ? updated : item)) : [updated],
      );
      queryClient.setQueryData(queryKeys.notifications.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.detail(updated.id) });
    },
  });
};

export const useCancelNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiPost<SalonNotification, Record<string, never>>(
        `/api/v1/notifications/${id}/cancel`,
        {},
      ),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.detail(id) });
      addNotification.success({ message: 'Уведомление отменено' });
    },
  });
};
