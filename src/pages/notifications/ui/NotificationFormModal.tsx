import React from 'react';
import { Select, Stack, TextInput } from '@mantine/core';
import { DateInput, TimePicker } from '@mantine/dates';
import { BellRingingIcon } from '@phosphor-icons/react';
import { useCreateNotification } from '@/shared/api/hooks/useNotifications';
import type { SalonNotificationType } from '@/shared/api/types';
import { toDateInput } from '@/shared/lib/format';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { FormFieldGrid, FormModal, FormModalFooter } from '@/shared/ui';
import {
  defaultNotificationSchedule,
  toNotificationScheduledAt,
} from '../lib/notificationSchedule';

interface NotificationFormModalProps {
  opened: boolean;
  onClose: () => void;
}

export const NotificationFormModal: React.FC<NotificationFormModalProps> = ({ opened, onClose }) => {
  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const [type, setType] = React.useState<SalonNotificationType>('reminder');
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  const createNotification = useCreateNotification();
  const minDate = React.useMemo(() => toDateInput(new Date()), [opened]);

  useResetOnOpen(opened, () => {
    const next = defaultNotificationSchedule();
    setTitle('');
    setBody('');
    setType('reminder');
    setDate(next.date);
    setTime(next.time);
  });

  const scheduledAt = toNotificationScheduledAt(date, time);

  const handleSubmit = React.useCallback(() => {
    if (!scheduledAt) return;
    createNotification.mutate(
      {
        title: title || null,
        body: body || title,
        type,
        scheduled_at: scheduledAt,
      },
      { onSuccess: onClose },
    );
  }, [title, body, type, scheduledAt, createNotification, onClose]);

  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title="Новое уведомление"
      icon={<BellRingingIcon />}
      size={567}
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel="Создать уведомление"
          onSubmit={handleSubmit}
          submitDisabled={!title.trim() || !scheduledAt}
          loading={createNotification.isPending}
        />
      }
    >
      <Stack gap="sm">
        <Select
          label="Тип"
          required
          data={[
            { value: 'reminder', label: 'Напоминание' },
            { value: 'other', label: 'Другое' },
          ]}
          value={type}
          onChange={(v) => setType((v as SalonNotificationType) ?? 'reminder')}
        />
        <TextInput
          label="Заголовок"
          required
          placeholder="Введите заголовок"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <TextInput
          label="Описание"
          placeholder="Введите описание"
          value={body}
          onChange={(e) => setBody(e.currentTarget.value)}
        />
        <FormFieldGrid>
          <DateInput
            label="Дата"
            required
            placeholder="ДД.ММ.ГГГГ"
            value={date || null}
            minDate={minDate}
            onChange={(value) => setDate(value ?? '')}
          />
          <TimePicker
            label="Время"
            required
            minutesStep={5}
            value={time}
            onChange={setTime}
          />
        </FormFieldGrid>
      </Stack>
    </FormModal>
  );
};
