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
  const eventSourceRef = React.useRef<EventSource | null>(null);
  const reconnectTimerRef = React.useRef<number | null>(null);

  const handleIncoming = React.useCallback(
    (payload: SalonNotificationWsPayload) => {
      setLiveNotifications((prev) => [payload, ...prev].slice(0, 50));
      onNotification(payload);
    },
    [onNotification],
  );

  React.useEffect(() => {
    if (!isAuthenticated) return;

    const connect = () => {
      if (eventSourceRef.current?.readyState === EventSource.OPEN) return;

      const eventSource = new EventSource(`${API_BASE_URL}/api/v1/notifications/stream`, {
        withCredentials: true,
      });
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setConnected(true);
      };

      eventSource.addEventListener('connected', () => {
        setConnected(true);
      });

      eventSource.addEventListener('notification', (event) => {
        try {
          const payload = JSON.parse(event.data) as SalonNotificationWsPayload;
          handleIncoming(payload);
        } catch (err) {
          console.error('Ошибка обработки SSE уведомления:', err);
        }
      });

      eventSource.onerror = () => {
        setConnected(false);
        eventSource.close();
        eventSourceRef.current = null;

        if (authStorage.isAuthenticated()) {
          reconnectTimerRef.current = window.setTimeout(connect, RECONNECT_DELAY_MS);
        }
      };
    };

    connect();

    return () => {
      if (reconnectTimerRef.current != null) {
        window.clearTimeout(reconnectTimerRef.current);
      }
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      setConnected(false);
    };
  }, [handleIncoming, isAuthenticated]);

  const contextValue = React.useMemo(
    () => ({ connected, liveNotifications }),
    [connected, liveNotifications],
  );

  return { contextValue, connected };
};
