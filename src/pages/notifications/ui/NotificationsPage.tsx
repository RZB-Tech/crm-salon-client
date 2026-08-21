import React from 'react';
import { Alert, Box, Button, Skeleton, Stack } from '@mantine/core';
import { PlusIcon } from '@phosphor-icons/react';
import { ListPageShell, ListPaginationFooter, ListTabs } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { useNotificationsPage } from '../lib/useNotificationsPage';
import { NotificationFormModal } from './NotificationFormModal';
import { NotificationsTable } from './NotificationsTable';
import { ReadNotificationModal } from './ReadNotificationModal';

export const NotificationsPage: React.FC = () => {
  const { t } = useI18n();
  const { hasPermission } = useAccess();
  const {
    formOpen,
    setFormOpen,
    statusFilter,
    setStatusFilter,
    readTarget,
    readComment,
    setReadComment,
    notifications,
    pendingCount,
    isLoading,
    isError,
    pagination,
    sort,
    toggleSort,
    cancelNotification,
    readNotification,
    openReadModal,
    closeReadModal,
    confirmRead,
    confirmCancel,
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
          <Alert color="red" title={t('notifications.loadError')}>
            {t('common.checkApi')}
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
          <ListTabs
            value={statusFilter}
            onChange={setStatusFilter}
            data={[
              { value: 'all', label: t('notifications.allItems', { count: (notifications ?? []).length }) },
              { value: 'pending', label: t('notifications.newItems', { count: pendingCount }) },
              { value: 'read', label: t('notifications.read') },
              { value: 'cancelled', label: t('notifications.cancelled') },
            ]}
          />
          {hasPermission(PermissionCode.NOTIFICATION_CREATE) && (
            <Button
              color="sage.7"
              rightSection={<PlusIcon size={16} />}
              onClick={() => setFormOpen(true)}
              size="sm"
            >
              {t('notifications.create')}
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
        sort={sort}
        onSort={toggleSort}
        cancelPending={cancelNotification.isPending}
        onMarkRead={openReadModal}
        onCancel={openReadModal}
      />

      <NotificationFormModal opened={formOpen} onClose={() => setFormOpen(false)} />

      <ReadNotificationModal
        opened={readTarget != null}
        comment={readComment}
        loading={readNotification.isPending || cancelNotification.isPending}
        onCommentChange={setReadComment}
        onClose={closeReadModal}
        onConfirm={confirmRead}
        onCancelNotification={confirmCancel}
      />
    </ListPageShell>
  );
};
