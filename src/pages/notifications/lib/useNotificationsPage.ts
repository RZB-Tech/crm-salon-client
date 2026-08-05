import React from 'react';
import { useCancelNotification, useNotifications, useReadNotification } from '@/shared/api/hooks/useNotifications';
import { useNotificationsWs } from '@/shared/lib/notifications/NotificationsWsContext';
import { getEffectiveStatus } from '@/shared/lib/notifications/notificationDelivery';
import { usePagination } from '@/shared/lib/hooks/usePagination';

export function useNotificationsPage() {
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

  const pagination = usePagination(items, { defaultPageSize: 20 });

  React.useEffect(() => {
    pagination.resetPage();
  }, [statusFilter, pagination.resetPage]);

  const openReadModal = React.useCallback((id: number) => {
    setReadTarget(id);
    setReadComment('');
  }, []);

  const closeReadModal = React.useCallback(() => setReadTarget(null), []);

  const confirmRead = React.useCallback(() => {
    if (readTarget == null) return;
    readNotification.mutate(
      { id: readTarget, comment: readComment.trim() },
      {
        onSuccess: () => {
          setReadTarget(null);
          setReadComment('');
        },
      },
    );
  }, [readTarget, readComment, readNotification]);

  return {
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
  };
}
