import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetchAllPost, authStorage } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { SalonNotification, SalonNotificationWsPayload } from '@/shared/api/types';
import { useReadNotification } from '@/shared/api/hooks/useNotifications';
import {
  getNotificationDelayMs,
  shouldShowNotification,
  toNotificationWsPayload,
} from '@/shared/lib/notifications/notificationDelivery';
import { unlockNotificationAudio } from '@/shared/lib/notifications/playNotificationSound';
import { POLL_INTERVAL_MS, toSalonNotification } from './notificationWsConstants';
import { useNotificationAlertQueue } from './useNotificationAlertQueue';
import { useNotificationsSse } from './useNotificationsSse';

export function useNotificationsWs() {
  const queryClient = useQueryClient();
  const readNotification = useReadNotification();
  const alertQueue = useNotificationAlertQueue();
  const isAuthenticated = authStorage.isAuthenticated();

  const handleIncoming = React.useCallback(
    (payload: SalonNotificationWsPayload) => {
      queryClient.setQueryData<SalonNotification[]>(queryKeys.notifications.all, (old) => {
        const item = toSalonNotification(payload);
        if (!old) return [item];
        if (old.some((n) => n.id === item.id)) {
          return old.map((n) => (n.id === item.id ? { ...n, delivered_at: item.delivered_at } : n));
        }
        return [item, ...old];
      });

      alertQueue.showAlert(payload);
    },
    [queryClient, alertQueue],
  );

  const { contextValue, connected } = useNotificationsSse(isAuthenticated, handleIncoming);

  const { data: notifications } = useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: () => apiFetchAllPost<SalonNotification>('/api/v1/notifications'),
    enabled: isAuthenticated,
    refetchInterval: connected ? false : POLL_INTERVAL_MS,
  });

  React.useEffect(() => {
    if (!notifications) return;

    const activeIds = new Set(notifications.map((item) => item.id));
    for (const [id] of alertQueue.scheduleTimersRef.current) {
      if (!activeIds.has(id)) {
        alertQueue.clearScheduleTimer(id);
      }
    }

    const nowMs = Date.now();

    for (const notification of notifications) {
      if (!shouldShowNotification(notification, alertQueue.shownIdsRef.current, nowMs)) {
        const status = notification.status;
        if (
          status !== 'read' &&
          status !== 'cancelled' &&
          !notification.delivered_at &&
          getNotificationDelayMs(notification, nowMs) > 0
        ) {
          alertQueue.scheduleAlert(
            notification.id,
            getNotificationDelayMs(notification, nowMs),
            toNotificationWsPayload(notification),
          );
        }
        continue;
      }

      alertQueue.showAlert(toNotificationWsPayload(notification));
    }
  }, [notifications, alertQueue]);

  React.useEffect(() => {
    const unlock = () => unlockNotificationAudio();

    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });

    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  const handleReadAlert = React.useCallback(
    (id: number, comment: string) => {
      readNotification.mutate(
        { id, comment },
        {
          onSuccess: () => alertQueue.dismissAlert(),
          onError: () => alertQueue.dismissAlert(),
        },
      );
    },
    [readNotification, alertQueue],
  );

  return {
    contextValue,
    currentAlert: alertQueue.currentAlert,
    alertQueueLength: alertQueue.alertQueueLength,
    readPending: readNotification.isPending,
    dismissAlert: alertQueue.dismissAlert,
    handleReadAlert,
  };
}
