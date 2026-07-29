import React from 'react';
import type { SalonNotificationWsPayload } from '@/shared/api/types';

export interface NotificationsWsContextValue {
  connected: boolean;
  liveNotifications: SalonNotificationWsPayload[];
}

export const NotificationsWsContext = React.createContext<NotificationsWsContextValue>({
  connected: false,
  liveNotifications: [],
});

export const useNotificationsWs = (): NotificationsWsContextValue =>
  React.useContext(NotificationsWsContext);
