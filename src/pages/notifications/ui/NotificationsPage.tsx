import React from 'react';
import { Alert, Box, Button, Skeleton, Stack } from '@mantine/core';
import { PlusIcon } from '@phosphor-icons/react';
import {
  ListCreateFab,
  ListPageShell,
  ListPageTitle,
  ListPaginationFooter,
  ListTabs,
} from '@/shared/ui';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { useI18n } from '@/shared/lib/i18n';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { useNotificationsPage } from '../lib/useNotificationsPage';
import { NotificationFormModal } from './NotificationFormModal';
import { NotificationsListBody } from './NotificationsListBody';
import { ReadNotificationModal } from './ReadNotificationModal';

export const NotificationsPage: React.FC = () => {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const { hasPermission } = useAccess();
  const page = useNotificationsPage();
  const canCreate = hasPermission(PermissionCode.NOTIFICATION_CREATE);

  const tabData = React.useMemo(
    () => [
      {
        value: 'all',
        label: isMobile ? t('common.all') : t('notifications.allItems', { count: (page.notifications ?? []).length }),
      },
      {
        value: 'pending',
        label: isMobile ? t('notifications.newTab') : t('notifications.newItems', { count: page.pendingCount }),
      },
      { value: 'read', label: t('notifications.read') },
      { value: 'cancelled', label: t('notifications.cancelled') },
    ],
    [isMobile, page.notifications, page.pendingCount, t],
  );

  if (page.isLoading) {
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

  if (page.isError) {
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

  const { page: pageNum, pageSize, paginatedItems, total, setPage, setPageSize } = page.pagination;

  return (
    <ListPageShell
      toolbar={
        <>
          {isMobile && <ListPageTitle>{t('notifications.title')}</ListPageTitle>}
          <ListTabs value={page.statusFilter} onChange={page.setStatusFilter} data={tabData} />
          {!isMobile && canCreate && (
            <Button
              color="sage.7"
              rightSection={<PlusIcon size={16} />}
              onClick={() => page.setFormOpen(true)}
              size="sm"
            >
              {t('notifications.create')}
            </Button>
          )}
        </>
      }
      footer={
        <ListPaginationFooter
          page={pageNum}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      }
      fab={
        isMobile && canCreate ? (
          <ListCreateFab label={t('notifications.create')} onClick={() => page.setFormOpen(true)} />
        ) : undefined
      }
    >
      <NotificationsListBody
        items={paginatedItems}
        sort={page.sort}
        onSort={page.toggleSort}
        cancelPending={page.cancelNotification.isPending}
        onMarkRead={page.openReadModal}
        onCancel={page.openReadModal}
      />

      <NotificationFormModal opened={page.formOpen} onClose={() => page.setFormOpen(false)} />

      <ReadNotificationModal
        opened={page.readTarget != null}
        comment={page.readComment}
        loading={page.readNotification.isPending || page.cancelNotification.isPending}
        onCommentChange={page.setReadComment}
        onClose={page.closeReadModal}
        onConfirm={page.confirmRead}
        onCancelNotification={page.confirmCancel}
      />
    </ListPageShell>
  );
};
