import React from 'react';
import { Select, Stack, Textarea, TextInput } from '@mantine/core';
import { BellRingingIcon } from '@phosphor-icons/react';
import { DateTimePicker } from '@mantine/dates';
import { useCreateNotification } from '@/shared/api/hooks/useNotifications';
import type { SalonNotificationType } from '@/shared/api/types';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { FormFieldGrid, FormModal, FormModalFooter, FormSection } from '@/shared/ui';

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
    <FormModal
      opened={opened}
      onClose={onClose}
      title="Новое уведомление"
      subtitle="Текст и время отправки"
      icon={<BellRingingIcon size={22} />}
      size="lg"
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel="Создать"
          onSubmit={handleSubmit}
          submitDisabled={!body}
          loading={createNotification.isPending}
        />
      }
    >
      <FormSection title="Текст уведомления">
        <Stack gap="sm">
          <FormFieldGrid>
            <Select
              label="Тип"
              data={[
                { value: 'reminder', label: 'Напоминание' },
                { value: 'other', label: 'Другое' },
              ]}
              value={type}
              onChange={(v) => setType((v as SalonNotificationType) ?? 'reminder')}
            />
            <TextInput
              label="Заголовок"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
          </FormFieldGrid>
          <Textarea
            label="Текст"
            required
            minRows={3}
            value={body}
            onChange={(e) => setBody(e.currentTarget.value)}
          />
        </Stack>
      </FormSection>

      <FormSection title="Период">
        <DateTimePicker
          label="Запланировать на"
          clearable
          value={scheduledAt}
          onChange={setScheduledAt}
          placeholder="Сейчас"
        />
      </FormSection>
    </FormModal>
  );
};
