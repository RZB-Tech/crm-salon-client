import React from 'react';
import { useArchiveMaterial, useMaterials, useRestoreMaterial } from '@/shared/api/hooks/useMaterials';
import type { Material } from '@/shared/api/types';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { useResolvedById } from '@/shared/lib/hooks/useResolvedById';

export function useMaterialsPage() {
  const [search, setSearch] = React.useState('');
  const [showArchived, setShowArchived] = React.useState(false);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [quantityTargetId, setQuantityTargetId] = React.useState<number | null>(null);
  const [archiveTargetId, setArchiveTargetId] = React.useState<number | null>(null);

  const { data: materials, isLoading, isError } = useMaterials(showArchived);
  const archiveMaterial = useArchiveMaterial();
  const restoreMaterial = useRestoreMaterial();

  const editing = useResolvedById(materials, editingId);
  const quantityTarget = useResolvedById(materials, quantityTargetId);
  const archiveTarget = useResolvedById(materials, archiveTargetId);

  const filtered = React.useMemo(
    () =>
      (materials ?? [])
        .filter((item) => {
          const q = search.toLowerCase();
          return !q || item.name.toLowerCase().includes(q) || item.article.toLowerCase().includes(q);
        })
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [materials, search],
  );

  const pagination = usePagination(filtered, { defaultPageSize: 20 });

  React.useEffect(() => {
    pagination.resetPage();
  }, [search, pagination.resetPage]);

  const openCreate = React.useCallback(() => {
    setEditingId(null);
    setFormOpen(true);
  }, []);

  const openEdit = React.useCallback((m: Material) => {
    setEditingId(m.id);
    setFormOpen(true);
  }, []);

  const handleChangeQuantity = React.useCallback((m: Material) => {
    setFormOpen(false);
    setQuantityTargetId(m.id);
  }, []);

  const confirmArchive = React.useCallback(() => {
    if (!archiveTarget) return;
    archiveMaterial.mutate(archiveTarget.id, {
      onSuccess: () => setArchiveTargetId(null),
    });
  }, [archiveTarget, archiveMaterial]);

  return {
    search,
    setSearch,
    showArchived,
    setShowArchived,
    formOpen,
    setFormOpen,
    editing,
    quantityTarget,
    setQuantityTargetId,
    archiveTarget,
    setArchiveTargetId,
    isLoading,
    isError,
    pagination,
    openCreate,
    openEdit,
    handleChangeQuantity,
    restoreMaterial,
    archiveMaterial,
    confirmArchive,
  };
}
