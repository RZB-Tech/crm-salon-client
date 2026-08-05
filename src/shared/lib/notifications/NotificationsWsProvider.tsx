import React from 'react';
import { NotificationsWsContext } from '@/shared/lib/notifications/NotificationsWsContext';
import { SalonNotificationAlertModal } from '@/shared/lib/notifications/SalonNotificationAlertModal';
import { useNotificationsWs } from '@/shared/lib/notifications/useNotificationsWs';

export const NotificationsWsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    contextValue,
    currentAlert,
    alertQueueLength,
    readPending,
    dismissAlert,
    handleReadAlert,
  } = useNotificationsWs();

  return (
    <NotificationsWsContext.Provider value={contextValue}>
      {children}
      <SalonNotificationAlertModal
        notification={currentAlert}
        queueLength={alertQueueLength}
        loading={readPending}
        onDismiss={dismissAlert}
        onRead={handleReadAlert}
      />
    </NotificationsWsContext.Provider>
  );
};
