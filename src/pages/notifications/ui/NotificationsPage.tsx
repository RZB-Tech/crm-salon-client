import React from 'react';
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Group,
  Modal,
  Select,
  Skeleton,
  Table,
  Tabs,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { Plus, Trash, Check, X } from '@phosphor-icons/react';
import {
  useCancelNotification,
  useCreateNotification,
  useDeleteNotification,
  useNotifications,
  useReadNotification,
} from '@/shared/api/hooks/useNotifications';
import type { SalonNotificationType } from '@/shared/api/types';
import { ConfirmModal, DataTable, DataTableRow, ListPage } from '@/shared/ui';
import { useNotificationsWs } from '@/shared/lib/notifications/NotificationsWsProvider';
import { getEffectiveStatus } from '@/shared/lib/notifications/notificationDelivery';
import { formatDateTime, NOTIFICATION_TYPE_LABELS } from '@/shared/lib/format';
import styles from './notifications-page.module.css';

export const NotificationsPage: React.FC = () => {
  const [formOpen, setFormOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<number | null>(null);
  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const [type, setType] = React.useState<SalonNotificationType>('reminder');
  const [scheduledAt, setScheduledAt] = React.useState('');

  const { connected } = useNotificationsWs();
  const { data: notifications, isLoading, isError } = useNotifications();
  const createNotification = useCreateNotification();
  const deleteNotification = useDeleteNotification();
  const readNotification = useReadNotification();
  const cancelNotification = useCancelNotification();

  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [readTarget, setReadTarget] = React.useState<number | null>(null);
  const [readComment, setReadComment] = React.useState('');

  const submitForm = React.useCallback(() => {
    createNotification.mutate(
      {
        title: title || null,
        body,
        type,
        scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : new Date().toISOString(),
      },
      {
        onSuccess: () => {
          setFormOpen(false);
          setTitle('');
          setBody('');
          setScheduledAt('');
        },
      },
    );
  }, [title, body, type, scheduledAt, createNotification]);

  if (isLoading) {
    return (
      <ListPage title="Уведомления">
        <Skeleton height={48} mb="md" />
        <Skeleton height={400} radius="md" />
      </ListPage>
    );
  }

  if (isError) {
    return (
      <ListPage title="Уведомления">
        <Alert color="red" title="Не удалось загрузить уведомления">
          Проверьте доступность API
        </Alert>
      </ListPage>
    );
  }

  const items = React.useMemo(() => {
    const all = notifications ?? [];
    if (statusFilter === 'all') return all;
    return all.filter((item) => getEffectiveStatus(item) === statusFilter);
  }, [notifications, statusFilter]);

  const pendingCount = React.useMemo(
    () => (notifications ?? []).filter((n) => getEffectiveStatus(n) === 'pending').length,
    [notifications],
  );

  return (
    <ListPage
      title="Уведомления"
      subtitle={`${items.length} уведомлений${pendingCount > 0 ? ` · ${pendingCount} новых` : ''}`}
      actions={
        <Group gap="sm">
          <Badge
            variant="light"
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
      <Tabs
        value={statusFilter}
        onChange={(value) => setStatusFilter(value ?? 'all')}
        variant="pills"
        radius="md"
        mb="md"
      >
        <Tabs.List>
          <Tabs.Tab value="all">Все ({(notifications ?? []).length})</Tabs.Tab>
          <Tabs.Tab value="pending">Новые ({pendingCount})</Tabs.Tab>
          <Tabs.Tab value="read">Прочитанные</Tabs.Tab>
          <Tabs.Tab value="cancelled">Отменённые</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <DataTable
        columns={[
          { key: 'type', label: 'Тип' },
          { key: 'title', label: 'Заголовок' },
          { key: 'body', label: 'Текст' },
          { key: 'status', label: 'Статус' },
          { key: 'scheduled', label: 'Запланировано' },
          { key: 'actions', label: '', width: 100 },
        ]}
        isEmpty={items.length === 0}
        emptyMessage="Уведомлений нет"
      >
        {items.map((item) => {
          const status = getEffectiveStatus(item);
          return (
          <DataTableRow key={item.id}>
            <Table.Td>
              <Badge size="sm" variant="light">
                {NOTIFICATION_TYPE_LABELS[item.type] ?? item.type}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Text size="sm" fw={500}>
                {item.title ?? '—'}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm" lineClamp={2}>
                {item.body}
              </Text>
            </Table.Td>
            <Table.Td>
              <Badge
                size="sm"
                variant="light"
                color={
                  status === 'read'
                    ? 'green'
                    : status === 'cancelled'
                      ? 'red'
                      : 'orange'
                }
              >
                {status === 'read'
                  ? 'Прочитано'
                  : status === 'cancelled'
                    ? 'Отменено'
                    : 'Новое'}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Text size="xs">{formatDateTime(item.scheduled_at)}</Text>
            </Table.Td>
            <Table.Td>
              <Group gap={4} wrap="nowrap">
                {status === 'pending' && (
                  <>
                    <Tooltip label="Прочитано">
                      <ActionIcon
                        variant="subtle"
                        color="green"
                        size="sm"
                        onClick={() => {
                          setReadTarget(item.id);
                          setReadComment('');
                        }}
                      >
                        <Check size={14} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Отменить">
                      <ActionIcon
                        variant="subtle"
                        color="orange"
                        size="sm"
                        onClick={() => cancelNotification.mutate(item.id)}
                        loading={cancelNotification.isPending}
                      >
                        <X size={14} />
                      </ActionIcon>
                    </Tooltip>
                  </>
                )}
                <Tooltip label="Удалить">
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    size="sm"
                    onClick={() => setDeleteTarget(item.id)}
                  >
                    <Trash size={14} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Table.Td>
          </DataTableRow>
          );
        })}
      </DataTable>

      <Modal opened={formOpen} onClose={() => setFormOpen(false)} title="Новое уведомление" radius="md">
        <Select
          label="Тип"
          mb="md"
          data={[
            { value: 'reminder', label: 'Напоминание' },
            { value: 'other', label: 'Другое' },
          ]}
          value={type}
          onChange={(value) => setType((value as SalonNotificationType) ?? 'reminder')}
        />
        <TextInput label="Заголовок" mb="md" value={title} onChange={(e) => setTitle(e.currentTarget.value)} />
        <Textarea
          label="Текст"
          required
          mb="md"
          minRows={3}
          value={body}
          onChange={(e) => setBody(e.currentTarget.value)}
        />
        <TextInput
          label="Запланировать на"
          type="datetime-local"
          mb="lg"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.currentTarget.value)}
        />
        <Group justify="flex-end">
          <Button variant="subtle" color="gray" onClick={() => setFormOpen(false)}>
            Отмена
          </Button>
          <Button onClick={submitForm} loading={createNotification.isPending} disabled={!body}>
            Создать
          </Button>
        </Group>
      </Modal>

      <ConfirmModal
        opened={deleteTarget != null}
        title="Удалить уведомление"
        message="Удалить это уведомление?"
        loading={deleteNotification.isPending}
        onConfirm={() =>
          deleteTarget != null &&
          deleteNotification.mutate(deleteTarget, { onSuccess: () => setDeleteTarget(null) })
        }
        onClose={() => setDeleteTarget(null)}
      />

      <Modal
        opened={readTarget != null}
        onClose={() => setReadTarget(null)}
        title="Отметить прочитанным"
        radius="md"
        size="sm"
      >
        <Textarea
          label="Комментарий"
          required
          placeholder="Введите комментарий"
          minRows={2}
          mb="md"
          value={readComment}
          onChange={(e) => setReadComment(e.currentTarget.value)}
        />
        <Group justify="flex-end">
          <Button variant="subtle" color="gray" onClick={() => setReadTarget(null)}>
            Отмена
          </Button>
          <Button
            onClick={() =>
              readTarget != null &&
              readNotification.mutate(
                { id: readTarget, comment: readComment.trim() },
                { onSuccess: () => { setReadTarget(null); setReadComment(''); } },
              )
            }
            loading={readNotification.isPending}
            disabled={!readComment.trim()}
          >
            Прочитано
          </Button>
        </Group>
      </Modal>
    </ListPage>
  );
};
