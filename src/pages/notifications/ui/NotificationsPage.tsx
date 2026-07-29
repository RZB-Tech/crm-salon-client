import React from 'react';
import { ActionIcon, Alert, Badge, Box, Button, Group, Modal, Skeleton, Table, Tabs, Text, Textarea, Tooltip } from '@mantine/core';
import { CheckIcon, PlusIcon, XIcon } from '@phosphor-icons/react';
import { useCancelNotification, useNotifications, useReadNotification } from '@/shared/api/hooks/useNotifications';
import { DataTable, DataTableRow, ListPage } from '@/shared/ui';
import { useNotificationsWs } from '@/shared/lib/notifications/NotificationsWsContext';
import { getEffectiveStatus } from '@/shared/lib/notifications/notificationDelivery';
import { formatDateTime, NOTIFICATION_TYPE_LABELS } from '@/shared/lib/format';
import { NotificationFormModal } from './NotificationFormModal';
import styles from './notifications-page.module.css';

export const NotificationsPage: React.FC = () => {
  const [formOpen, setFormOpen] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [readTarget, setReadTarget] = React.useState<number | null>(null);
  const [readComment, setReadComment] = React.useState('');

  const { connected } = useNotificationsWs();
  const { data: notifications, isLoading, isError } = useNotifications();
  const readNotification = useReadNotification();
  const cancelNotification = useCancelNotification();

  const items = React.useMemo(() => {
    const all = notifications ?? [];
    if (statusFilter === 'all') return all;
    return all.filter((item) => getEffectiveStatus(item) === statusFilter);
  }, [notifications, statusFilter]);

  const pendingCount = React.useMemo(
    () => (notifications ?? []).filter((n) => getEffectiveStatus(n) === 'pending').length,
    [notifications],
  );

  if (isLoading) {
    return <ListPage title="Уведомления"><Skeleton height={48} mb="md" /><Skeleton height={400} radius="md" /></ListPage>;
  }

  if (isError) {
    return <ListPage title="Уведомления"><Alert color="red" title="Не удалось загрузить уведомления">Проверьте доступность API</Alert></ListPage>;
  }

  return (
    <ListPage
      title="Уведомления"
      subtitle={`${items.length} уведомлений${pendingCount > 0 ? ` · ${pendingCount} новых` : ''}`}
      actions={
        <Group gap="sm">
          <Badge variant="light" color={connected ? 'green' : 'gray'} leftSection={<Box component="span" className={`${styles.statusDot} ${connected ? styles.statusDot_online : styles.statusDot_offline}`} />}>
            {connected ? 'Поток подключён' : 'Поток отключён'}
          </Badge>
          <Button leftSection={<PlusIcon size={16} />} onClick={() => setFormOpen(true)}>Создать</Button>
        </Group>
      }
    >
      <Tabs value={statusFilter} onChange={(v) => setStatusFilter(v ?? 'all')} variant="pills" radius="md" mb="md">
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
              <Table.Td><Badge size="sm" variant="light">{NOTIFICATION_TYPE_LABELS[item.type] ?? item.type}</Badge></Table.Td>
              <Table.Td><Text size="sm" fw={500}>{item.title ?? '—'}</Text></Table.Td>
              <Table.Td><Text size="sm" lineClamp={2}>{item.body}</Text></Table.Td>
              <Table.Td>
                <Badge size="sm" variant="light" color={status === 'read' ? 'green' : status === 'cancelled' ? 'red' : 'orange'}>
                  {status === 'read' ? 'Прочитано' : status === 'cancelled' ? 'Отменено' : 'Новое'}
                </Badge>
              </Table.Td>
              <Table.Td><Text size="xs">{formatDateTime(item.scheduled_at)}</Text></Table.Td>
              <Table.Td>
                <Group gap={4} wrap="nowrap">
                  {status === 'pending' && (
                    <>
                      <Tooltip label="Прочитано">
                        <ActionIcon variant="subtle" color="green" size="sm" onClick={() => { setReadTarget(item.id); setReadComment(''); }}>
                          <CheckIcon size={14} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Отменить">
                        <ActionIcon variant="subtle" color="orange" size="sm" onClick={() => cancelNotification.mutate(item.id)} loading={cancelNotification.isPending}>
                          <XIcon size={14} />
                        </ActionIcon>
                      </Tooltip>
                    </>
                  )}
                </Group>
              </Table.Td>
            </DataTableRow>
          );
        })}
      </DataTable>

      <NotificationFormModal opened={formOpen} onClose={() => setFormOpen(false)} />

      <Modal opened={readTarget != null} onClose={() => setReadTarget(null)} title="Отметить прочитанным" radius="md" size="sm">
        <Textarea label="Комментарий" required placeholder="Введите комментарий" minRows={2} mb="md" value={readComment} onChange={(e) => setReadComment(e.currentTarget.value)} />
        <Group justify="flex-end">
          <Button variant="subtle" color="gray" onClick={() => setReadTarget(null)}>Отмена</Button>
          <Button
            onClick={() => readTarget != null && readNotification.mutate({ id: readTarget, comment: readComment.trim() }, { onSuccess: () => { setReadTarget(null); setReadComment(''); } })}
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
