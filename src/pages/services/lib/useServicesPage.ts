import React from 'react';
import {
  useArchiveService,
  useImportServices,
  useRestoreService,
  useServiceCategories,
  useServices,
} from '@/shared/api/hooks/useServices';
import type { Service, ServiceCategory } from '@/shared/api/types';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { useResolvedById } from '@/shared/lib/hooks/useResolvedById';

export function useServicesPage() {
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [showArchived, setShowArchived] = React.useState(false);

  const [serviceFormOpen, setServiceFormOpen] = React.useState(false);
  const [editingServiceId, setEditingServiceId] = React.useState<number | null>(null);
  const [archiveServiceTargetId, setArchiveServiceTargetId] = React.useState<number | null>(null);

  const [categoryFormOpen, setCategoryFormOpen] = React.useState(false);
  const [editingCategory] = React.useState<ServiceCategory | null>(null);

  const { data: services, isLoading: servicesLoading, isError: servicesError } = useServices(showArchived);
  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useServiceCategories();

  const editingService = useResolvedById(services, editingServiceId);
  const archiveServiceTarget = useResolvedById(services, archiveServiceTargetId);

  const archiveService = useArchiveService();
  const restoreService = useRestoreService();
  const importServices = useImportServices();
  const resetImportRef = React.useRef<() => void>(null);

  const isLoading = servicesLoading || categoriesLoading;
  const isError = servicesError || categoriesError;

  const categoryMap = React.useMemo(() => {
    const map = new Map<number, ServiceCategory>();
    for (const c of categories ?? []) map.set(c.id, c);
    return map;
  }, [categories]);

  const filtered = React.useMemo(
    () =>
      (services ?? []).filter((service) => {
        const matchCategory =
          activeCategory === 'all' || String(service.category_id) === activeCategory;
        const matchSearch =
          !search || service.name.toLowerCase().includes(search.toLowerCase());
        return matchCategory && matchSearch;
      }),
    [services, activeCategory, search],
  );

  const pagination = usePagination(filtered, { defaultPageSize: 20 });

  React.useEffect(() => {
    pagination.resetPage();
  }, [search, activeCategory, pagination.resetPage]);

  const openServiceCreate = React.useCallback(() => {
    setEditingServiceId(null);
    setServiceFormOpen(true);
  }, []);

  const openServiceEdit = React.useCallback((s: Service) => {
    setEditingServiceId(s.id);
    setServiceFormOpen(true);
  }, []);

  const handleImportFile = React.useCallback(
    (file: File | null) => {
      if (!file) return;
      importServices.mutate(file);
      resetImportRef.current?.();
    },
    [importServices],
  );

  const confirmArchive = React.useCallback(() => {
    if (!archiveServiceTarget) return;
    archiveService.mutate(archiveServiceTarget.id, {
      onSuccess: () => setArchiveServiceTargetId(null),
    });
  }, [archiveServiceTarget, archiveService]);

  return {
    activeCategory,
    setActiveCategory,
    search,
    setSearch,
    showArchived,
    setShowArchived,
    serviceFormOpen,
    setServiceFormOpen,
    categoryFormOpen,
    setCategoryFormOpen,
    editingCategory,
    editingService,
    archiveServiceTarget,
    setArchiveServiceTargetId,
    categories,
    categoryMap,
    isLoading,
    isError,
    pagination,
    openServiceCreate,
    openServiceEdit,
    handleImportFile,
    importServices,
    resetImportRef,
    restoreService,
    archiveService,
    confirmArchive,
  };
}
