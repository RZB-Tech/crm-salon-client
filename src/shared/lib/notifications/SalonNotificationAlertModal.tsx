import React from 'react';
import { ActionIcon, Button, Modal, Textarea } from '@mantine/core';
import { XIcon } from '@phosphor-icons/react';
import type { SalonNotificationWsPayload } from '@/shared/api/types';
import illustrationSrc from '@/shared/assets/notification-alert-illustration.png';
import { formatNotificationAlertStamp, NOTIFICATION_TYPE_LABELS } from '@/shared/lib/format';
import { getSalonNotificationCopy } from '@/shared/lib/notifications/notificationDelivery';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { useI18n } from '@/shared/lib/i18n';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import styles from './salon-notification-alert-modal.module.css';

interface SalonNotificationAlertModalProps {
  notification: SalonNotificationWsPayload | null;
  readLoading?: boolean;
  cancelLoading?: boolean;
  onDismiss: () => void;
  onRead: (id: number, notes: string) => void;
  onCancel: (id: number, notes: string) => void;
}

export const SalonNotificationAlertModal: React.FC<SalonNotificationAlertModalProps> = ({
  notification,
  readLoading = false,
  cancelLoading = false,
  onDismiss,
  onRead,
  onCancel,
}) => {
  const { t } = useI18n();
  const [notes, setNotes] = React.useState('');
  const { hasPermission } = useAccess();
  const canCancel = hasPermission(PermissionCode.NOTIFICATION_CANCEL);
  const busy = readLoading || cancelLoading;
  const canSubmit = notes.trim().length > 0 && !busy;

  useResetOnOpen(notification?.id ?? null, () => setNotes(''));

  const copy = notification ? getSalonNotificationCopy(notification) : null;

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
              aria-label={t('header.close')}
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
                <h2 className={styles.title}>{copy?.title}</h2>
                {copy?.body ? <p className={styles.description}>{copy.body}</p> : null}
              </div>
              <p className={styles.stamp}>{formatNotificationAlertStamp(notification.scheduled_at)}</p>
            </div>
          </div>

          <Textarea
            placeholder={t('notifications.comment')}
            minRows={3}
            autosize
            maxRows={6}
            value={notes}
            onChange={(event) => setNotes(event.currentTarget.value)}
            disabled={busy}
          />

          <div className={styles.actions}>
            {canCancel && (
              <Button
                className={styles.cancelBtn}
                radius={8}
                variant="subtle"
                color="gray"
                loading={cancelLoading}
                disabled={!canSubmit}
                onClick={() => onCancel(notification.id, notes.trim())}
              >
                {t('notifications.cancelItem')}
              </Button>
            )}
            <Button
              className={styles.readBtn}
              radius={8}
              variant="subtle"
              color="gray"
              loading={readLoading}
              disabled={!canSubmit}
              onClick={() => onRead(notification.id, notes.trim())}
            >
              {t('notifications.markRead')}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
