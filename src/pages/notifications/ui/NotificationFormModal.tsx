import React from 'react';
import { Button, Group, Modal, Select, Textarea, TextInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useCreateNotification } from '@/shared/api/hooks/useNotifications';
import type { SalonNotificationType } from '@/shared/api/types';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';

interface NotificationFormModalProps {
  opened: boolean;
  onClose: () => void;
}

/** Mantine DateTimePicker value → ISO for API */
const toScheduledIso = (value: string | null): string => {
  if (!value) return new Date().toISOString();
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
};

export const NotificationFormModal: React.FC<NotificationFormModalProps> = ({ opened, onClose }) => {
  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const [type, setType] = React.useState<SalonNotificationType>('reminder');
  const [scheduledAt, setScheduledAt] = React.useState<string | null>(null);
  const createNotification = useCreateNotification();

  useResetOnOpen(opened, () => {
    setTitle('');
    setBody('');
    setScheduledAt(null);
    setType('reminder');
  });

  const handleSubmit = React.useCallback(() => {
    createNotification.mutate(
      {
        title: title || null,
        body,
        type,
        scheduled_at: toScheduledIso(scheduledAt),
      },
      { onSuccess: onClose },
    );
  }, [title, body, type, scheduledAt, createNotification, onClose]);

  return (
    <Modal opened={opened} onClose={onClose} title="Новое уведомление" radius="md">
      <Select
        label="Тип"
        mb="md"
        data={[
          { value: 'reminder', label: 'Напоминание' },
          { value: 'other', label: 'Другое' },
        ]}
        value={type}
        onChange={(v) => setType((v as SalonNotificationType) ?? 'reminder')}
      />
      <TextInput
        label="Заголовок"
        mb="md"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
      />
      <Textarea
        label="Текст"
        required
        mb="md"
        minRows={3}
        value={body}
        onChange={(e) => setBody(e.currentTarget.value)}
      />
      <DateTimePicker
        label="Запланировать на"
        clearable
        mb="lg"
        value={scheduledAt}
        onChange={setScheduledAt}
        placeholder="Сейчас"
      />
      <Group justify="flex-end">
        <Button variant="subtle" color="gray" onClick={onClose}>
          Отмена
        </Button>
        <Button onClick={handleSubmit} loading={createNotification.isPending} disabled={!body}>
          Создать
        </Button>
      </Group>
    </Modal>
  );
};
