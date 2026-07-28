import React from 'react';
import { Badge, Box, Button, Group, Modal, Stack, Text, Textarea } from '@mantine/core';
import { BellIcon } from '@phosphor-icons/react';
import type { SalonNotificationWsPayload } from '@/shared/api/types';
import { formatDateTime, NOTIFICATION_TYPE_LABELS } from '@/shared/lib/format';
import styles from './salon-notification-alert-modal.module.css';

interface SalonNotificationAlertModalProps {
  notification: SalonNotificationWsPayload | null;
  queueLength: number;
  loading?: boolean;
  onDismiss: () => void;
  onRead: (id: number, comment: string) => void;
}

export const SalonNotificationAlertModal: React.FC<SalonNotificationAlertModalProps> = ({
  notification,
  queueLength,
  loading = false,
  onDismiss,
  onRead,
}) => {
  const [comment, setComment] = React.useState('');

  React.useEffect(() => {
    if (notification) setComment('');
  }, [notification?.id]);

  const handleRead = React.useCallback(() => {
    if (!notification) return;
    onRead(notification.id, comment.trim());
  }, [notification, comment, onRead]);

  return (
    <Modal
      opened={notification != null}
      onClose={onDismiss}
      centered
      radius="lg"
      size="md"
      withCloseButton
      closeOnClickOutside={false}
      closeOnEscape
      overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      title={null}
      padding="xl"
      zIndex={1100}
    >
      {notification && (
        <Stack gap="md" className={styles.modalContent}>
          <Box className={styles.iconWrap}>
            <BellIcon size={36} weight="fill" />
          </Box>

          <Badge size="sm" variant="light" mx="auto">
            {NOTIFICATION_TYPE_LABELS[notification.type] ?? notification.type}
          </Badge>

          <Text size="xl" fw={700}>
            {notification.title ?? 'Напоминание'}
          </Text>

          <Text size="md" c="dimmed" className={styles.body}>
            {notification.body}
          </Text>

          <Text size="xs" c="dimmed" className={styles.meta}>
            Запланировано: {formatDateTime(notification.scheduled_at)}
          </Text>

          {queueLength > 1 && (
            <Text size="xs" c="dimmed">
              Ещё {queueLength - 1} уведомлений в очереди
            </Text>
          )}

          <Textarea
            placeholder="Комментарий"
            label="Комментарий"
            required
            minRows={2}
            value={comment}
            onChange={(event) => setComment(event.currentTarget.value)}
            styles={{ input: { textAlign: 'left' } }}
          />

          <Group justify="center" mt="sm">
            <Button variant="subtle" color="gray" onClick={onDismiss}>
              Пропустить
            </Button>
            <Button size="md" onClick={handleRead} loading={loading} disabled={!comment.trim()}>
              Прочитано
            </Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
};
