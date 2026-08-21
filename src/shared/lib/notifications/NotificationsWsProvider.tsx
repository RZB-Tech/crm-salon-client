import React from 'react';
import { NotificationsWsContext } from '@/shared/lib/notifications/NotificationsWsContext';
import { SalonNotificationAlertModal } from '@/shared/lib/notifications/SalonNotificationAlertModal';
import { useNotificationsWs } from '@/shared/lib/notifications/useNotificationsWs';

export const NotificationsWsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    contextValue,
    currentAlert,
    readPending,
    cancelPending,
    dismissAlert,
    handleReadAlert,
    handleCancelAlert,
  } = useNotificationsWs();

  return (
    <NotificationsWsContext.Provider value={contextValue}>
      {children}
      <SalonNotificationAlertModal
        notification={currentAlert}
        readLoading={readPending}
        cancelLoading={cancelPending}
        onDismiss={dismissAlert}
        onRead={handleReadAlert}
        onCancel={handleCancelAlert}
      />
    </NotificationsWsContext.Provider>
  );
};
