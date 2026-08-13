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
import { getPromotionStatus } from './promotionHelpers';

export type PromotionsFilter = 'all' | 'active' | 'archive';

export function usePromotionsPage() {
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState<PromotionsFilter>('all');
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [archiveTargetId, setArchiveTargetId] = React.useState<number | null>(null);

  const showArchived = filter === 'archive';
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
    return (promotions ?? [])
      .filter((item) => {
        if (filter === 'active' && getPromotionStatus(item) !== 'active') return false;
        if (!query) return true;
        const targetName =
          item.service_id != null
            ? (serviceNameMap.get(item.service_id) ?? '')
            : item.material_id != null
              ? (materialNameMap.get(item.material_id) ?? '')
              : '';
        return item.name.toLowerCase().includes(query) || targetName.toLowerCase().includes(query);
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [promotions, filter, search, serviceNameMap, materialNameMap]);

  const pagination = usePagination(filtered, { defaultPageSize: 20 });

  React.useEffect(() => {
    pagination.resetPage();
  }, [search, filter, pagination.resetPage]);

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
    showArchived,
    formOpen,
    setFormOpen,
    editing,
    archiveTarget,
    setArchiveTargetId,
    isLoading,
    isError,
    pagination,
    serviceNameMap,
    materialNameMap,
    openCreate,
    openEdit,
    restorePromotion,
    archivePromotion,
    confirmArchive,
  };
}
