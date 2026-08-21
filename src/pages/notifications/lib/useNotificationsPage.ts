import React from 'react';
import { useCancelNotification, useNotifications, useReadNotification } from '@/shared/api/hooks/useNotifications';
import type { SalonNotification } from '@/shared/api/types';
import { getEffectiveStatus } from '@/shared/lib/notifications/notificationDelivery';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { sortTime, useTableSort } from '@/shared/lib/hooks/useTableSort';

const NOTIFICATION_SORT_GETTERS = {
  type: (item: SalonNotification) => item.type,
  status: (item: SalonNotification) => getEffectiveStatus(item),
  scheduled: (item: SalonNotification) => sortTime(item.scheduled_at),
};

export function useNotificationsPage() {
  const [formOpen, setFormOpen] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [readTarget, setReadTarget] = React.useState<number | null>(null);
  const [readComment, setReadComment] = React.useState('');

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

  const { sort, sortedItems, toggleSort } = useTableSort(items, NOTIFICATION_SORT_GETTERS, {
    key: 'scheduled',
    dir: 'desc',
  });
  const pagination = usePagination(sortedItems, { defaultPageSize: 20 });

  React.useEffect(() => {
    pagination.resetPage();
  }, [statusFilter, sort.key, sort.dir, pagination.resetPage]);

  const openReadModal = React.useCallback((id: number) => {
    setReadTarget(id);
    setReadComment('');
  }, []);

  const closeReadModal = React.useCallback(() => setReadTarget(null), []);

  const confirmRead = React.useCallback(() => {
    if (readTarget == null || !readComment.trim()) return;
    readNotification.mutate(
      { id: readTarget, notes: readComment.trim() },
      {
        onSuccess: () => {
          setReadTarget(null);
          setReadComment('');
        },
      },
    );
  }, [readTarget, readComment, readNotification]);

  const confirmCancel = React.useCallback(() => {
    if (readTarget == null || !readComment.trim()) return;
    cancelNotification.mutate(
      { id: readTarget, notes: readComment.trim() },
      {
        onSuccess: () => {
          setReadTarget(null);
          setReadComment('');
        },
      },
    );
  }, [readTarget, readComment, cancelNotification]);

  return {
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
  };
}
