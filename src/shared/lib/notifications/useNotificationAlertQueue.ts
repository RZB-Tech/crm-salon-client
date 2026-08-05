import React from 'react';
import type { SalonNotificationWsPayload } from '@/shared/api/types';
import {
  playNotificationSound,
} from '@/shared/lib/notifications/playNotificationSound';

export const useNotificationAlertQueue = () => {
  const [alertQueue, setAlertQueue] = React.useState<SalonNotificationWsPayload[]>([]);
  const shownIdsRef = React.useRef<Set<number>>(new Set());
  const scheduleTimersRef = React.useRef<Map<number, number>>(new Map());

  const currentAlert = alertQueue[0] ?? null;

  const showAlert = React.useCallback((payload: SalonNotificationWsPayload) => {
    if (shownIdsRef.current.has(payload.id)) return;
    shownIdsRef.current.add(payload.id);

    const timerId = scheduleTimersRef.current.get(payload.id);
    if (timerId != null) {
      window.clearTimeout(timerId);
      scheduleTimersRef.current.delete(payload.id);
    }

    setAlertQueue((prev) => {
      if (prev.some((item) => item.id === payload.id)) return prev;
      const next = [...prev, payload];
      if (prev.length === 0) {
        playNotificationSound();
      }
      return next;
    });
  }, []);

  const dismissAlert = React.useCallback(() => {
    setAlertQueue((prev) => {
      const next = prev.slice(1);
      if (next.length > 0) {
        playNotificationSound();
      }
      return next;
    });
  }, []);

  const clearScheduleTimer = React.useCallback((id: number) => {
    const timerId = scheduleTimersRef.current.get(id);
    if (timerId != null) {
      window.clearTimeout(timerId);
      scheduleTimersRef.current.delete(id);
    }
  }, []);

  const scheduleAlert = React.useCallback(
    (id: number, delay: number, payload: SalonNotificationWsPayload) => {
      if (scheduleTimersRef.current.has(id)) return;
      const timerId = window.setTimeout(() => {
        scheduleTimersRef.current.delete(id);
        showAlert(payload);
      }, delay);
      scheduleTimersRef.current.set(id, timerId);
    },
    [showAlert],
  );

  React.useEffect(
    () => () => {
      for (const timerId of scheduleTimersRef.current.values()) {
        window.clearTimeout(timerId);
      }
      scheduleTimersRef.current.clear();
    },
    [],
  );

  return {
    alertQueue,
    alertQueueLength: alertQueue.length,
    currentAlert,
    shownIdsRef,
    scheduleTimersRef,
    showAlert,
    dismissAlert,
    clearScheduleTimer,
    scheduleAlert,
  };
};
