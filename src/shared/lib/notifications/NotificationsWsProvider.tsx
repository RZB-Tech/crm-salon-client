import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authStorage } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { SalonNotification, SalonNotificationWsPayload } from '@/shared/api/types';
import { getWebSocketUrl, NOTIFICATIONS_WS_URL } from '@/shared/config/env';
import { addNotification } from '@/shared/lib/notifications';

interface NotificationsWsContextValue {
  connected: boolean;
  liveNotifications: SalonNotificationWsPayload[];
}

const NotificationsWsContext = React.createContext<NotificationsWsContextValue>({
  connected: false,
  liveNotifications: [],
});

export const useNotificationsWs = (): NotificationsWsContextValue =>
  React.useContext(NotificationsWsContext);

const RECONNECT_DELAY_MS = 5000;

export const NotificationsWsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [connected, setConnected] = React.useState(false);
  const [liveNotifications, setLiveNotifications] = React.useState<SalonNotificationWsPayload[]>([]);
  const wsRef = React.useRef<WebSocket | null>(null);
  const reconnectTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!authStorage.isAuthenticated()) return;

    const connect = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) return;

      const ws = new WebSocket(getWebSocketUrl(NOTIFICATIONS_WS_URL));
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data as string) as SalonNotificationWsPayload;
          setLiveNotifications((prev) => [payload, ...prev].slice(0, 50));

          queryClient.setQueryData<SalonNotification[]>(queryKeys.notifications.all, (old) => {
            const item: SalonNotification = {
              id: payload.id,
              client_id: payload.client_id,
              title: payload.title,
              body: payload.body,
              type: payload.type,
              scheduled_at: payload.scheduled_at,
              delivered_at: payload.delivered_at,
              created_at: payload.scheduled_at,
              updated_at: payload.scheduled_at,
            };
            if (!old) return [item];
            if (old.some((n) => n.id === item.id)) return old;
            return [item, ...old];
          });

          addNotification.info({
            title: payload.title ?? 'Уведомление',
            message: payload.body,
          });
        } catch {
          // ignore malformed payloads
        }
      };

      ws.onclose = () => {
        setConnected(false);
        wsRef.current = null;
        if (authStorage.isAuthenticated()) {
          reconnectTimerRef.current = window.setTimeout(connect, RECONNECT_DELAY_MS);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connect();

    return () => {
      if (reconnectTimerRef.current != null) {
        window.clearTimeout(reconnectTimerRef.current);
      }
      wsRef.current?.close();
      wsRef.current = null;
      setConnected(false);
    };
  }, [queryClient]);

  const value = React.useMemo(
    () => ({ connected, liveNotifications }),
    [connected, liveNotifications],
  );

  return (
    <NotificationsWsContext.Provider value={value}>{children}</NotificationsWsContext.Provider>
  );
};
