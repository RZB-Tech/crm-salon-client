import React from 'react';
import { Alert, Badge, Box, Button, Group, Skeleton, Stack } from '@mantine/core';
import { PlusIcon } from '@phosphor-icons/react';
import { ListPageShell, ListPaginationFooter, ListTabs } from '@/shared/ui';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { useNotificationsPage } from '../lib/useNotificationsPage';
import { NotificationFormModal } from './NotificationFormModal';
import { NotificationsTable } from './NotificationsTable';
import { ReadNotificationModal } from './ReadNotificationModal';
import styles from './notifications-page.module.css';

export const NotificationsPage: React.FC = () => {
  const { hasPermission } = useAccess();
  const {
    formOpen,
    setFormOpen,
    statusFilter,
    setStatusFilter,
    readTarget,
    readComment,
    setReadComment,
    connected,
    notifications,
    pendingCount,
    isLoading,
    isError,
    pagination,
    cancelNotification,
    readNotification,
    openReadModal,
    closeReadModal,
    confirmRead,
  } = useNotificationsPage();

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

  const { page, pageSize, paginatedItems, total, setPage, setPageSize } = pagination;

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
      <NotificationsTable
        items={paginatedItems}
        cancelPending={cancelNotification.isPending}
        onMarkRead={openReadModal}
        onCancel={(id) => cancelNotification.mutate(id)}
      />

      <NotificationFormModal opened={formOpen} onClose={() => setFormOpen(false)} />

      <ReadNotificationModal
        opened={readTarget != null}
        comment={readComment}
        loading={readNotification.isPending}
        onCommentChange={setReadComment}
        onClose={closeReadModal}
        onConfirm={confirmRead}
      />
    </ListPageShell>
  );
};
