import React from 'react';
import { Select, Stack, TextInput } from '@mantine/core';
import { DateInput, TimePicker } from '@mantine/dates';
import { BellRingingIcon } from '@phosphor-icons/react';
import { useCreateNotification } from '@/shared/api/hooks/useNotifications';
import type { SalonNotificationType } from '@/shared/api/types';
import { toDateInput } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
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
  const { t } = useI18n();
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
      title={t('form.newNotification')}
      icon={<BellRingingIcon />}
      size={567}
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel={t('form.createNotification')}
          onSubmit={handleSubmit}
          submitDisabled={!title.trim() || !scheduledAt}
          loading={createNotification.isPending}
        />
      }
    >
      <Stack gap="sm">
        <Select
          label={t('form.type')}
          required
          data={[
            { value: 'reminder', label: t('labels.notificationType.reminder') },
            { value: 'other', label: t('labels.notificationType.other') },
          ]}
          value={type}
          onChange={(v) => setType((v as SalonNotificationType) ?? 'reminder')}
        />
        <TextInput
          label={t('form.title')}
          required
          placeholder={t('form.enterTitle')}
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <TextInput
          label={t('form.description')}
          placeholder={t('form.enterDescription')}
          value={body}
          onChange={(e) => setBody(e.currentTarget.value)}
        />
        <FormFieldGrid>
          <DateInput
            label={t('form.date')}
            required
            placeholder={t('board.datePlaceholder')}
            value={date || null}
            minDate={minDate}
            onChange={(value) => setDate(value ?? '')}
          />
          <TimePicker
            label={t('form.time')}
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
