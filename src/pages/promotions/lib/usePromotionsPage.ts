import React from 'react';
import {
  useArchivePromotion,
  usePromotions,
  useRestorePromotion,
} from '@/shared/api/hooks/usePromotions';
import { useMaterials } from '@/shared/api/hooks/useMaterials';
import { useServices } from '@/shared/api/hooks/useServices';
import type { Promotion } from '@/shared/api/types';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { useResolvedById } from '@/shared/lib/hooks/useResolvedById';
import { sortTime, useTableSort } from '@/shared/lib/hooks/useTableSort';
import { getPromotionStatus } from './promotionHelpers';

export type PromotionsFilter = 'all' | 'active';
export type PromotionsKindFilter = 'all' | 'service' | 'material';

const PROMOTION_SORT_GETTERS = {
  name: (item: Promotion) => item.name,
  discount: (item: Promotion) => item.discount_value ?? 0,
  period: (item: Promotion) => sortTime(item.start_time),
  status: (item: Promotion) => getPromotionStatus(item),
  created: (item: Promotion) => sortTime(item.created_at),
};

export function usePromotionsPage() {
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState<PromotionsFilter>('all');
  const [kindFilter, setKindFilter] = React.useState<PromotionsKindFilter>('all');
  const [showArchived, setShowArchived] = React.useState(false);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [archiveTargetId, setArchiveTargetId] = React.useState<number | null>(null);

  const { data: promotions, isLoading, isError } = usePromotions(showArchived);
  const { data: services } = useServices(false);
  const { data: materials } = useMaterials(false);

  const archivePromotion = useArchivePromotion();
  const restorePromotion = useRestorePromotion();

  const editing = useResolvedById(promotions, editingId);
  const archiveTarget = useResolvedById(promotions, archiveTargetId);

  const serviceNameMap = React.useMemo(() => {
    const map = new Map<number, string>();
    for (const service of services ?? []) map.set(service.id, service.name);
    return map;
  }, [services]);

  const materialNameMap = React.useMemo(() => {
    const map = new Map<number, string>();
    for (const material of materials ?? []) map.set(material.id, material.name);
    return map;
  }, [materials]);

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    return (promotions ?? []).filter((item) => {
      if (!showArchived && filter === 'active' && getPromotionStatus(item) !== 'active') return false;
      if (kindFilter === 'service' && item.service_id == null) return false;
      if (kindFilter === 'material' && item.material_id == null) return false;
      if (!query) return true;
      const targetName =
        item.service_id != null
          ? (serviceNameMap.get(item.service_id) ?? '')
          : item.material_id != null
            ? (materialNameMap.get(item.material_id) ?? '')
            : '';
      return item.name.toLowerCase().includes(query) || targetName.toLowerCase().includes(query);
    });
  }, [promotions, filter, kindFilter, showArchived, search, serviceNameMap, materialNameMap]);

  const { sort, sortedItems, toggleSort } = useTableSort(filtered, PROMOTION_SORT_GETTERS, {
    key: 'created',
    dir: 'desc',
  });
  const pagination = usePagination(sortedItems, { defaultPageSize: 20 });

  React.useEffect(() => {
    pagination.resetPage();
  }, [search, filter, kindFilter, showArchived, sort.key, sort.dir, pagination.resetPage]);

  const openCreate = React.useCallback(() => {
    setEditingId(null);
    setFormOpen(true);
  }, []);

  const openEdit = React.useCallback((promo: Promotion) => {
    setEditingId(promo.id);
    setFormOpen(true);
  }, []);

  const confirmArchive = React.useCallback(() => {
    if (!archiveTarget) return;
    archivePromotion.mutate(archiveTarget.id, {
      onSuccess: () => setArchiveTargetId(null),
    });
  }, [archiveTarget, archivePromotion]);

  return {
    search,
    setSearch,
    filter,
    setFilter,
    kindFilter,
    setKindFilter,
    showArchived,
    setShowArchived,
    formOpen,
    setFormOpen,
    editing,
    archiveTarget,
    setArchiveTargetId,
    isLoading,
    isError,
    pagination,
    sort,
    toggleSort,
    serviceNameMap,
    materialNameMap,
    openCreate,
    openEdit,
    restorePromotion,
    archivePromotion,
    confirmArchive,
  };
}
