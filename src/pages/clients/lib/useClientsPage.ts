import React from 'react';
import { useArchiveClient, useClients, useRestoreClient } from '@/shared/api/hooks/useClients';
import type { Client } from '@/shared/api/types';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { getClientFullName } from '@/shared/lib/format';
import { useResolvedById } from '@/shared/lib/hooks/useResolvedById';

export function useClientsPage() {
  const [search, setSearch] = React.useState('');
  const [showArchived, setShowArchived] = React.useState(false);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Client | null>(null);
  const [depositTarget, setDepositTarget] = React.useState<Client | null>(null);
  const [archiveTargetId, setArchiveTargetId] = React.useState<number | null>(null);
  const [detailTarget, setDetailTarget] = React.useState<Client | null>(null);

  const { data: clients, isLoading, isError } = useClients(showArchived);
  const archiveClient = useArchiveClient();
  const restoreClient = useRestoreClient();

  const resolveClient = React.useCallback(
    (target: Client | null) => {
      if (!target) return null;
      return (clients ?? []).find((client) => client.id === target.id) ?? target;
    },
    [clients],
  );

  const liveEditing = resolveClient(editing);
  const liveDepositTarget = resolveClient(depositTarget);
  const liveDetailTarget = resolveClient(detailTarget);
  const archiveTarget = useResolvedById(clients, archiveTargetId);

  const filtered = React.useMemo(
    () =>
      (clients ?? []).filter((client) => {
        const name = getClientFullName(client).toLowerCase();
        const q = search.toLowerCase();
        return !q || name.includes(q) || (client.phone ?? '').includes(q);
      }),
    [clients, search],
  );

  const pagination = usePagination(filtered, { defaultPageSize: 20 });

  React.useEffect(() => {
    pagination.resetPage();
  }, [search, pagination.resetPage]);

  const openCreate = React.useCallback(() => {
    setEditing(null);
    setFormOpen(true);
  }, []);

  const openEdit = React.useCallback((c: Client) => {
    setEditing(c);
    setFormOpen(true);
  }, []);

  const handleEditFromDetail = React.useCallback(
    (c: Client) => {
      setDetailTarget(null);
      openEdit(c);
    },
    [openEdit],
  );

  const handleDepositFromDetail = React.useCallback((c: Client) => {
    setDetailTarget(null);
    setDepositTarget(c);
  }, []);

  const confirmArchive = React.useCallback(() => {
    if (!archiveTarget) return;
    archiveClient.mutate(archiveTarget.id, {
      onSuccess: () => setArchiveTargetId(null),
    });
  }, [archiveTarget, archiveClient]);

  return {
    search,
    setSearch,
    showArchived,
    setShowArchived,
    formOpen,
    setFormOpen,
    liveEditing,
    liveDepositTarget,
    setDepositTarget,
    liveDetailTarget,
    archiveTarget,
    setArchiveTargetId,
    isLoading,
    isError,
    pagination,
    openCreate,
    handleEditFromDetail,
    handleDepositFromDetail,
    setDetailTarget,
    restoreClient,
    archiveClient,
    confirmArchive,
  };
}
