import React from 'react';
import {
  useArchiveGiftCard,
  useGiftCards,
  useRestoreGiftCard,
} from '@/shared/api/hooks/useGiftCards';
import { useClients } from '@/shared/api/hooks/useClients';
import type { GiftCard } from '@/shared/api/types';
import { getClientFullName } from '@/shared/lib/format';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { useResolvedById } from '@/shared/lib/hooks/useResolvedById';
import { sortTime, useTableSort } from '@/shared/lib/hooks/useTableSort';
import { getGiftCardViewStatus } from './giftCardHelpers';

export type GiftCardsFilter = 'all' | 'active' | 'used' | 'expired' | 'cancelled';

const GIFT_CARD_SORT_GETTERS = {
  code: (item: GiftCard) => item.code,
  amount: (item: GiftCard) => item.remain_amount,
  issued: (item: GiftCard) => sortTime(item.issue_date),
  status: (item: GiftCard) => getGiftCardViewStatus(item),
};

export function useGiftCardsPage() {
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState<GiftCardsFilter>('all');
  const [showArchived, setShowArchived] = React.useState(false);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [archiveTargetId, setArchiveTargetId] = React.useState<number | null>(null);
  const [cancelTargetId, setCancelTargetId] = React.useState<number | null>(null);

  const { data: giftCards, isLoading, isError } = useGiftCards(showArchived);
  const { data: clients } = useClients(false);

  const archiveGiftCard = useArchiveGiftCard();
  const restoreGiftCard = useRestoreGiftCard();

  const editing = useResolvedById(giftCards, editingId);
  const archiveTarget = useResolvedById(giftCards, archiveTargetId);
  const cancelTarget = useResolvedById(giftCards, cancelTargetId);

  const clientNameMap = React.useMemo(() => {
    const map = new Map<number, string>();
    for (const client of clients ?? []) map.set(client.id, getClientFullName(client));
    return map;
  }, [clients]);

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    return (giftCards ?? []).filter((item) => {
      const status = getGiftCardViewStatus(item);
      if (!showArchived && filter !== 'all' && status !== filter) return false;
      if (!query) return true;
      const clientName = item.client_id != null ? (clientNameMap.get(item.client_id) ?? '') : '';
      return item.code.toLowerCase().includes(query) || clientName.toLowerCase().includes(query);
    });
  }, [giftCards, filter, showArchived, search, clientNameMap]);

  const { sort, sortedItems, toggleSort } = useTableSort(filtered, GIFT_CARD_SORT_GETTERS, {
    key: 'issued',
    dir: 'desc',
  });
  const pagination = usePagination(sortedItems, { defaultPageSize: 20 });

  React.useEffect(() => {
    pagination.resetPage();
  }, [search, filter, showArchived, sort.key, sort.dir, pagination.resetPage]);

  const openCreate = React.useCallback(() => {
    setEditingId(null);
    setFormOpen(true);
  }, []);

  const openEdit = React.useCallback((card: GiftCard) => {
    setEditingId(card.id);
    setFormOpen(true);
  }, []);

  const confirmArchive = React.useCallback(() => {
    if (!archiveTarget) return;
    archiveGiftCard.mutate(archiveTarget.id, {
      onSuccess: () => setArchiveTargetId(null),
    });
  }, [archiveTarget, archiveGiftCard]);

  return {
    search,
    setSearch,
    filter,
    setFilter,
    showArchived,
    setShowArchived,
    formOpen,
    setFormOpen,
    editing,
    archiveTarget,
    setArchiveTargetId,
    cancelTarget,
    setCancelTargetId,
    isLoading,
    isError,
    pagination,
    sort,
    toggleSort,
    clientNameMap,
    openCreate,
    openEdit,
    restoreGiftCard,
    archiveGiftCard,
    confirmArchive,
  };
}
