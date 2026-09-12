import React from 'react';
import { API_BASE_URL, authStorage } from '@/shared/api/client';
import type { SalonNotificationWsPayload } from '@/shared/api/types';
import { RECONNECT_DELAY_MS } from './notificationWsConstants';

export const useNotificationsSse = (
  isAuthenticated: boolean,
  onNotification: (payload: SalonNotificationWsPayload) => void,
) => {
  const [connected, setConnected] = React.useState(false);
  const [liveNotifications, setLiveNotifications] = React.useState<SalonNotificationWsPayload[]>([]);
  const onNotificationRef = React.useRef(onNotification);
  onNotificationRef.current = onNotification;

  React.useEffect(() => {
    if (!isAuthenticated) {
      setConnected(false);
      return;
    }

    let cancelled = false;
    let eventSource: EventSource | null = null;
    let reconnectTimer: number | null = null;

    const clearReconnect = () => {
      if (reconnectTimer != null) {
        window.clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };

    const scheduleReconnect = () => {
      clearReconnect();
      reconnectTimer = window.setTimeout(connect, RECONNECT_DELAY_MS);
    };

    const closeConnection = () => {
      setConnected(false);
      eventSource?.close();
      eventSource = null;
    };

    const handleStreamError = () => {
      if (cancelled) return;
      closeConnection();
    };

    const connect = async () => {
      if (cancelled) return;
      if (
        eventSource?.readyState === EventSource.OPEN ||
        eventSource?.readyState === EventSource.CONNECTING
      ) {
        return;
      }

      if (!authStorage.isAuthenticated()) return;

      try {
        const probe = await fetch(`${API_BASE_URL}/api/v1/notifications/stream`, {
          method: 'GET',
          credentials: 'include',
          headers: { Accept: 'text/event-stream' },
        });

        if (cancelled) return;

        if (probe.status === 403) {
          closeConnection();
          return;
        }

        if (!probe.ok) {
          scheduleReconnect();
          return;
        }

        eventSource?.close();
        eventSource = new EventSource(`${API_BASE_URL}/api/v1/notifications/stream`, {
          withCredentials: true,
        });

        eventSource.onopen = () => {
          if (!cancelled) setConnected(true);
        };

        eventSource.addEventListener('connected', () => {
          if (!cancelled) setConnected(true);
        });

        eventSource.addEventListener('notification', (event) => {
          try {
            const payload = JSON.parse(event.data) as SalonNotificationWsPayload;
            setLiveNotifications((prev) => [payload, ...prev].slice(0, 50));
            onNotificationRef.current(payload);
          } catch (err) {
            console.error('Ошибка обработки SSE уведомления:', err);
          }
        });

        eventSource.onerror = handleStreamError;
      } catch {
        if (!cancelled) scheduleReconnect();
      }
    };

    connect();

    return () => {
      cancelled = true;
      clearReconnect();
      eventSource?.close();
      eventSource = null;
    };
  }, [isAuthenticated]);

  const contextValue = React.useMemo(
    () => ({ connected, liveNotifications }),
    [connected, liveNotifications],
  );

  return { contextValue, connected };
};
