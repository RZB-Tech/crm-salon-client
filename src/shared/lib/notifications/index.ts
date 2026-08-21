import { notifications } from '@mantine/notifications';
import { t } from '@/shared/lib/i18n';

interface NotificationOptions {
  title?: string;
  message: string;
}

export const addNotification = {
  success: ({ title, message }: NotificationOptions) => {
    notifications.show({
      title: title ?? t('common.success'),
      message,
      color: 'green',
      autoClose: 3000,
    });
  },

  error: ({ title, message }: NotificationOptions) => {
    notifications.show({
      title: title ?? t('common.errorTitle'),
      message,
      color: 'red',
      autoClose: 5000,
    });
  },

  info: ({ title, message }: NotificationOptions) => {
    notifications.show({
      title,
      message,
      color: 'sage',
      autoClose: 3000,
    });
  },
};
