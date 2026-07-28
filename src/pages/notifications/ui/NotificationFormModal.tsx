import React from 'react';
import { Button, Group, Modal, Select, Textarea, TextInput } from '@mantine/core';
import { useCreateNotification } from '@/shared/api/hooks/useNotifications';
import type { SalonNotificationType } from '@/shared/api/types';

interface NotificationFormModalProps {
  opened: boolean;
  onClose: () => void;
}

export const NotificationFormModal: React.FC<NotificationFormModalProps> = ({ opened, onClose }) => {
  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const [type, setType] = React.useState<SalonNotificationType>('reminder');
  const [scheduledAt, setScheduledAt] = React.useState('');
  const createNotification = useCreateNotification();

  React.useEffect(() => {
    if (opened) { setTitle(''); setBody(''); setScheduledAt(''); setType('reminder'); }
  }, [opened]);

  const handleSubmit = React.useCallback(() => {
    createNotification.mutate(
      { title: title || null, body, type, scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : new Date().toISOString() },
      { onSuccess: onClose },
    );
  }, [title, body, type, scheduledAt, createNotification, onClose]);

  return (
    <Modal opened={opened} onClose={onClose} title="Новое уведомление" radius="md">
      <Select label="Тип" mb="md" data={[{ value: 'reminder', label: 'Напоминание' }, { value: 'other', label: 'Другое' }]} value={type} onChange={(v) => setType((v as SalonNotificationType) ?? 'reminder')} />
      <TextInput label="Заголовок" mb="md" value={title} onChange={(e) => setTitle(e.currentTarget.value)} />
      <Textarea label="Текст" required mb="md" minRows={3} value={body} onChange={(e) => setBody(e.currentTarget.value)} />
      <TextInput label="Запланировать на" type="datetime-local" mb="lg" value={scheduledAt} onChange={(e) => setScheduledAt(e.currentTarget.value)} />
      <Group justify="flex-end">
        <Button variant="subtle" color="gray" onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} loading={createNotification.isPending} disabled={!body}>Создать</Button>
      </Group>
    </Modal>
  );
};
