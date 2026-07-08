import React from 'react';
import {
  Alert,
  Badge,
  Button,
  Group,
  Modal,
  Select,
  Skeleton,
  Table,
  Text,
  Textarea,
  TextInput
} from '@mantine/core';
import { Archive, Plus } from '@phosphor-icons/react';
import {
  useArchiveNotification,
  useCreateNotification,
  useNotifications
} from '@/shared/api/hooks/useNotifications';
import type { SalonNotificationType } from '@/shared/api/types';
import { ConfirmModal, DataTable, DataTableRow, ListPage } from '@/shared/ui';
import { useNotificationsWs } from '@/shared/lib/notifications/NotificationsWsProvider';
import { formatDateTime, NOTIFICATION_TYPE_LABELS } from '@/shared/lib/format';
import styles from './notifications-page.module.css';

export const NotificationsPage: React.FC = () => {
  const [formOpen, setFormOpen] = React.useState(false);
  const [archiveTarget, setArchiveTarget] = React.useState<number | null>(null);
  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const [type, setType] = React.useState<SalonNotificationType>('reminder');
  const [scheduledAt, setScheduledAt] = React.useState('');

  const { connected } = useNotificationsWs();
  const { data: notifications, isLoading, isError } = useNotifications();
  const createNotification = useCreateNotification();
  const archiveNotification = useArchiveNotification();

  const submitForm = React.useCallback(() => {
    createNotification.mutate(
      {
        title: title || null,
        body,
        type,
        scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : new Date().toISOString()
      },
      {
        onSuccess: () => {
          setFormOpen(false);
          setTitle('');
          setBody('');
          setScheduledAt('');
        }
      }
    );
  }, [title, body, type, scheduledAt, createNotification]);

  if (isLoading) {
    return (
      <ListPage title='Уведомления'>
        <Skeleton height={48} mb='md' />
        <Skeleton height={400} radius='md' />
      </ListPage>
    );
  }

  if (isError) {
    return (
      <ListPage title='Уведомления'>
        <Alert color='red' title='Не удалось загрузить уведомления'>
          Проверьте доступность API
        </Alert>
      </ListPage>
    );
  }

  const items = notifications ?? [];

  return (
    <ListPage
      title='Уведомления'
      subtitle={`${items.length} уведомлений`}
      actions={
        <Group gap='sm'>
          <Badge
            variant='light'
            color={connected ? 'green' : 'gray'}
            leftSection={
              <span
                className={`${styles.statusDot} ${connected ? styles.statusDot_online : styles.statusDot_offline}`}
              />
            }
          >
            {connected ? 'Поток подключён' : 'Поток отключён'}
          </Badge>
          <Button leftSection={<Plus size={16} />} onClick={() => setFormOpen(true)}>
            Создать
          </Button>
        </Group>
      }
    >
      <DataTable
        columns={[
          { key: 'type', label: 'Тип' },
          { key: 'title', label: 'Заголовок' },
          { key: 'body', label: 'Текст' },
          { key: 'scheduled', label: 'Запланировано' },
          { key: 'delivered', label: 'Доставлено' },
          { key: 'actions', label: '', width: 48 }
        ]}
        isEmpty={items.length === 0}
        emptyMessage='Уведомлений нет'
      >
        {items.map((item) => (
          <DataTableRow key={item.id}>
            <Table.Td>
              <Badge size='sm' variant='light'>
                {NOTIFICATION_TYPE_LABELS[item.type] ?? item.type}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Text size='sm' fw={500}>
                {item.title ?? '—'}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text size='sm' lineClamp={2}>
                {item.body}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text size='xs'>{formatDateTime(item.scheduled_at)}</Text>
            </Table.Td>
            <Table.Td>
              {item.delivered_at ? (
                <Badge size='xs' variant='light' color='green'>
                  {formatDateTime(item.delivered_at)}
                </Badge>
              ) : (
                <Badge size='xs' variant='light' color='orange'>
                  Ожидает
                </Badge>
              )}
            </Table.Td>
            <Table.Td>
              <Button
                variant='subtle'
                color='orange'
                size='xs'
                onClick={() => setArchiveTarget(item.id)}
              >
                <Archive size={14} />
              </Button>
            </Table.Td>
          </DataTableRow>
        ))}
      </DataTable>

      <Modal
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        title='Новое уведомление'
        radius='md'
      >
        <Select
          label='Тип'
          mb='md'
          data={[
            { value: 'reminder', label: 'Напоминание' },
            { value: 'other', label: 'Другое' }
          ]}
          value={type}
          onChange={(value) => setType((value as SalonNotificationType) ?? 'reminder')}
        />
        <TextInput
          label='Заголовок'
          mb='md'
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <Textarea
          label='Текст'
          required
          mb='md'
          minRows={3}
          value={body}
          onChange={(e) => setBody(e.currentTarget.value)}
        />
        <TextInput
          label='Запланировать на'
          type='datetime-local'
          mb='lg'
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.currentTarget.value)}
        />
        <Group justify='flex-end'>
          <Button variant='subtle' color='gray' onClick={() => setFormOpen(false)}>
            Отмена
          </Button>
          <Button onClick={submitForm} loading={createNotification.isPending} disabled={!body}>
            Создать
          </Button>
        </Group>
      </Modal>

      <ConfirmModal
        opened={archiveTarget != null}
        title='Архивировать уведомление'
        message='Архивировать это уведомление? Оно исчезнет из активного списка.'
        confirmLabel='Архивировать'
        confirmColor='orange'
        loading={archiveNotification.isPending}
        onConfirm={() =>
          archiveTarget != null &&
          archiveNotification.mutate(archiveTarget, { onSuccess: () => setArchiveTarget(null) })
        }
        onClose={() => setArchiveTarget(null)}
      />
    </ListPage>
  );
};
