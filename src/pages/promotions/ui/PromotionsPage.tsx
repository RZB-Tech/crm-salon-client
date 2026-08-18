import React from 'react';
import { Alert, Box, Skeleton, Stack } from '@mantine/core';
import { ConfirmModal, ListPageShell, ListPaginationFooter } from '@/shared/ui';
import { usePromotionsPage } from '../lib/usePromotionsPage';
import { PromotionFormModal } from './PromotionFormModal';
import { PromotionsTable } from './PromotionsTable';
import { PromotionsToolbar } from './PromotionsToolbar';

export const PromotionsPage: React.FC = () => {
  const {
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
  } = usePromotionsPage();

  if (isLoading) {
    return (
      <ListPageShell
        toolbar={
          <>
            <Skeleton height={32} width={360} radius="md" />
            <Skeleton height={32} width={160} radius="md" />
          </>
        }
      >
        <Stack gap="xs" p="md">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} height={48} radius="sm" />
          ))}
        </Stack>
      </ListPageShell>
    );
  }

  if (isError) {
    return (
      <ListPageShell>
        <Box p="xl">
          <Alert color="red" title="Не удалось загрузить акции">
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
        <PromotionsToolbar
          search={search}
          filter={filter}
          showArchived={showArchived}
          onSearchChange={setSearch}
          onFilterChange={setFilter}
          onShowArchivedChange={setShowArchived}
          onCreate={openCreate}
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
      <PromotionsTable
        items={paginatedItems}
        showArchived={showArchived}
        sort={sort}
        onSort={toggleSort}
        serviceNameMap={serviceNameMap}
        materialNameMap={materialNameMap}
        onEdit={openEdit}
        onArchive={(event, id) => {
          event.stopPropagation();
          setArchiveTargetId(id);
        }}
        onRestore={(event, id) => {
          event.stopPropagation();
          restorePromotion.mutate(id);
        }}
      />

      <PromotionFormModal
        opened={formOpen}
        promotion={editing}
        onClose={() => setFormOpen(false)}
      />
      <ConfirmModal
        opened={Boolean(archiveTarget)}
        title="Архивировать акцию"
        message={`Архивировать «${archiveTarget?.name ?? ''}»? Акция будет скрыта из списка.`}
        loading={archivePromotion.isPending}
        onConfirm={confirmArchive}
        onClose={() => setArchiveTargetId(null)}
      />
    </ListPageShell>
  );
};
