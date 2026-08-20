import React from 'react';
import { ActionIcon, Button, Modal } from '@mantine/core';
import { XIcon } from '@phosphor-icons/react';
import type { SalonNotificationWsPayload } from '@/shared/api/types';
import illustrationSrc from '@/shared/assets/notification-alert-illustration.png';
import { formatNotificationAlertStamp, NOTIFICATION_TYPE_LABELS } from '@/shared/lib/format';
import { DEFAULT_NOTIFICATION_READ_NOTES } from '@/shared/lib/notifications/notificationDelivery';
import styles from './salon-notification-alert-modal.module.css';

interface SalonNotificationAlertModalProps {
  notification: SalonNotificationWsPayload | null;
  loading?: boolean;
  onDismiss: () => void;
  onRead: (id: number, notes: string) => void;
}

export const SalonNotificationAlertModal: React.FC<SalonNotificationAlertModalProps> = ({
  notification,
  loading = false,
  onDismiss,
  onRead,
}) => {
  const handleRead = React.useCallback(() => {
    if (!notification) return;
    onRead(notification.id, DEFAULT_NOTIFICATION_READ_NOTES);
  }, [notification, onRead]);

  return (
    <Modal
      opened={notification != null}
      onClose={onDismiss}
      centered
      radius={16}
      size={423}
      withCloseButton={false}
      closeOnClickOutside={false}
      overlayProps={{ backgroundOpacity: 0.08, blur: 3 }}
      title={null}
      padding={16}
      zIndex={1100}
      classNames={{ content: styles.shell }}
    >
      {notification && (
        <div className={styles.card}>
          <div className={styles.closeRow}>
            <ActionIcon
              className={styles.closeBtn}
              variant="default"
              size={32}
              radius={8}
              aria-label="Закрыть"
              onClick={onDismiss}
            >
              <XIcon size={20} />
            </ActionIcon>
          </div>

          <div className={styles.body}>
            <div className={styles.hero}>
              <img
                src={illustrationSrc}
                alt=""
                width={217}
                height={166}
                className={styles.illustration}
              />
              <span className={styles.badge}>
                {NOTIFICATION_TYPE_LABELS[notification.type] ?? notification.type}
              </span>
            </div>

            <div className={styles.copy}>
              <div className={styles.titles}>
                <h2 className={styles.title}>{notification.title ?? 'Напоминание'}</h2>
                {notification.body ? <p className={styles.description}>{notification.body}</p> : null}
              </div>
              <p className={styles.stamp}>{formatNotificationAlertStamp(notification.scheduled_at)}</p>
            </div>
          </div>

          <Button
            className={styles.readBtn}
            fullWidth
            radius={8}
            variant="subtle"
            color="gray"
            loading={loading}
            onClick={handleRead}
          >
            Отметить прочитанным
          </Button>
        </div>
      )}
    </Modal>
  );
};
