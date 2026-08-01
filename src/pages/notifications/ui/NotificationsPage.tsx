import React from 'react';
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Group,
  Modal,
  Skeleton,
  Stack,
  Table,
  Text,
  Textarea,
  Tooltip,
} from '@mantine/core';
import { CheckIcon, PlusIcon, XIcon } from '@phosphor-icons/react';
import { useCancelNotification, useNotifications, useReadNotification } from '@/shared/api/hooks/useNotifications';
import { ListPageShell, ListPaginationFooter, ListTabs, listPageStyles } from '@/shared/ui';
import { useNotificationsWs } from '@/shared/lib/notifications/NotificationsWsContext';
import { getEffectiveStatus } from '@/shared/lib/notifications/notificationDelivery';
import { formatDateTime, NOTIFICATION_TYPE_LABELS } from '@/shared/lib/format';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { NotificationFormModal } from './NotificationFormModal';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import styles from './notifications-page.module.css';

export const NotificationsPage: React.FC = () => {
  const { hasPermission } = useAccess();
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

  const { page, pageSize, paginatedItems, total, setPage, setPageSize, resetPage } =
    usePagination(items, { defaultPageSize: 20 });

  React.useEffect(() => {
    resetPage();
  }, [statusFilter, resetPage]);

  if (isLoading) {
    return (
      <ListPageShell
        toolbar={
          <>
            <Skeleton height={32} width={320} radius="md" />
            <Skeleton height={32} width={120} radius="md" />
          </>
        }
      >
        <Stack gap="xs" p="md">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} height={48} radius="sm" />
          ))}
        </Stack>
      </ListPageShell>
    );
  }

  if (isError) {
    return (
      <ListPageShell>
        <Box p="xl">
          <Alert color="red" title="Не удалось загрузить уведомления">
            Проверьте доступность API
          </Alert>
        </Box>
      </ListPageShell>
    );
  }

  return (
    <ListPageShell
      toolbar={
        <>
          <Group gap={8}>
            <ListTabs
              value={statusFilter}
              onChange={setStatusFilter}
              data={[
                { value: 'all', label: `Все (${(notifications ?? []).length})` },
                { value: 'pending', label: `Новые (${pendingCount})` },
                { value: 'read', label: 'Прочитанные' },
                { value: 'cancelled', label: 'Отменённые' },
              ]}
            />
            <Badge
              variant="light"
              color={connected ? 'green' : 'gray'}
              leftSection={
                <Box
                  component="span"
                  className={`${styles.statusDot} ${connected ? styles.statusDot_online : styles.statusDot_offline}`}
                />
              }
            >
              {connected ? 'online' : 'offline'}
            </Badge>
          </Group>
          {hasPermission(PermissionCode.NOTIFICATION_CREATE) && (
            <Button
              color="sage.7"
              rightSection={<PlusIcon size={16} />}
              onClick={() => setFormOpen(true)}
              size="sm"
            >
              Создать
            </Button>
          )}
        </>
      }
      footer={
        <ListPaginationFooter
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      }
    >
      <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th className={listPageStyles.headCell}>Тип</Table.Th>
            <Table.Th className={listPageStyles.headCell}>Заголовок</Table.Th>
            <Table.Th className={listPageStyles.headCell}>Текст</Table.Th>
            <Table.Th className={listPageStyles.headCell} w={140}>Статус</Table.Th>
            <Table.Th className={listPageStyles.headCell} w={180}>Запланировано</Table.Th>
            <Table.Th className={listPageStyles.headCell} w={100} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {paginatedItems.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <Text size="sm" c="dimmed" ta="center" py="xl">
                  Уведомлений нет
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            paginatedItems.map((item) => {
              const status = getEffectiveStatus(item);
              return (
                <Table.Tr key={item.id} className={listPageStyles.row}>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Badge size="sm" variant="light">
                      {NOTIFICATION_TYPE_LABELS[item.type] ?? item.type}
                    </Badge>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Text size="sm" fw={500} c="#484848">
                      {item.title ?? '—'}
                    </Text>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Text size="sm" c="rgba(72,72,72,0.4)" lineClamp={2}>
                      {item.body}
                    </Text>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Badge
                      size="sm"
                      variant="light"
                      color={status === 'read' ? 'green' : status === 'cancelled' ? 'red' : 'orange'}
                    >
                      {status === 'read' ? 'Прочитано' : status === 'cancelled' ? 'Отменено' : 'Новое'}
                    </Badge>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Text size="xs" c="rgba(72,72,72,0.4)">
                      {formatDateTime(item.scheduled_at)}
                    </Text>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
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
                              <CheckIcon size={14} />
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
                              <XIcon size={14} />
                            </ActionIcon>
                          </Tooltip>
                        </>
                      )}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })
          )}
        </Table.Tbody>
      </Table>

      <NotificationFormModal opened={formOpen} onClose={() => setFormOpen(false)} />

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
                {
                  onSuccess: () => {
                    setReadTarget(null);
                    setReadComment('');
                  },
                },
              )
            }
            loading={readNotification.isPending}
            disabled={!readComment.trim()}
          >
            Прочитано
          </Button>
        </Group>
      </Modal>
    </ListPageShell>
  );
};
