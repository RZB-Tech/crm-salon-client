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

    const connect = () => {
      if (cancelled) return;
      if (
        eventSource?.readyState === EventSource.OPEN ||
        eventSource?.readyState === EventSource.CONNECTING
      ) {
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

      eventSource.onerror = () => {
        if (cancelled) return;
        setConnected(false);
        eventSource?.close();
        eventSource = null;
        if (!authStorage.isAuthenticated()) return;
        clearReconnect();
        reconnectTimer = window.setTimeout(connect, RECONNECT_DELAY_MS);
      };
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
