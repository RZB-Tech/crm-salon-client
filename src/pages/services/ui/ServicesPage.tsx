import React from 'react';
import { Alert, Box, Skeleton, Stack } from '@mantine/core';
import { ConfirmModal, ListPageShell, ListPaginationFooter } from '@/shared/ui';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { useServicesPage } from '../lib/useServicesPage';
import { ServiceFormModal } from './ServiceFormModal';
import { CategoryFormModal } from './CategoryFormModal';
import { ServicesTable } from './ServicesTable';
import { ServicesToolbar } from './ServicesToolbar';

export const ServicesPage: React.FC = () => {
  const { hasPermission } = useAccess();
  const {
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
  } = useServicesPage();

  if (isLoading) {
    return (
      <ListPageShell
        toolbar={
          <>
            <Skeleton height={32} width={400} radius="sm" />
            <Skeleton height={32} width={240} radius="md" />
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
          <Alert color="red" title="Не удалось загрузить данные">
            Проверьте доступность API
          </Alert>
        </Box>
      </ListPageShell>
    );
  }

  const { page, pageSize, paginatedItems, total, setPage, setPageSize } = pagination;

  return (
    <ListPageShell
      toolbar={
        <ServicesToolbar
          activeCategory={activeCategory}
          categories={categories ?? []}
          search={search}
          showArchived={showArchived}
          canImport={hasPermission(PermissionCode.SERVICE_IMPORT)}
          canCreate={hasPermission(PermissionCode.SERVICE_CREATE)}
          importPending={importServices.isPending}
          resetImportRef={resetImportRef}
          onCategoryChange={setActiveCategory}
          onAddCategory={() => setCategoryFormOpen(true)}
          onSearchChange={setSearch}
          onImportFile={handleImportFile}
          onCreate={openServiceCreate}
          onShowArchivedChange={setShowArchived}
        />
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
      <ServicesTable
        items={paginatedItems}
        categoryMap={categoryMap}
        showArchived={showArchived}
        onEdit={openServiceEdit}
        onArchive={(e, id) => {
          e.stopPropagation();
          setArchiveServiceTargetId(id);
        }}
        onRestore={(e, id) => {
          e.stopPropagation();
          restoreService.mutate(id);
        }}
      />

      <ServiceFormModal
        opened={serviceFormOpen}
        service={editingService}
        categories={categories ?? []}
        onClose={() => setServiceFormOpen(false)}
      />
      <CategoryFormModal
        opened={categoryFormOpen}
        category={editingCategory}
        onClose={() => setCategoryFormOpen(false)}
      />

      <ConfirmModal
        opened={Boolean(archiveServiceTarget)}
        title="Архивировать услугу"
        message={`Архивировать «${archiveServiceTarget?.name ?? ''}»? Услуга будет скрыта из списка.`}
        loading={archiveService.isPending}
        onConfirm={confirmArchive}
        onClose={() => setArchiveServiceTargetId(null)}
      />
    </ListPageShell>
  );
};
