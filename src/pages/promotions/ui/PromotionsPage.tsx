import React from 'react';
import { Alert, Box, Skeleton, Stack } from '@mantine/core';
import { ConfirmModal, ListCreateFab, ListPageShell, ListPaginationFooter } from '@/shared/ui';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { useI18n } from '@/shared/lib/i18n';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { usePromotionsPage } from '../lib/usePromotionsPage';
import { PromotionFormModal } from './PromotionFormModal';
import { PromotionsListBody } from './PromotionsListBody';
import { PromotionsToolbar } from './PromotionsToolbar';

export const PromotionsPage: React.FC = () => {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const { hasPermission } = useAccess();
  const {
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
          <Alert color="red" title={t('promotions.loadError')}>
            {t('common.checkApi')}
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
          kindFilter={kindFilter}
          showArchived={showArchived}
          canCreate={hasPermission(PermissionCode.PROMOTION_CREATE)}
          onSearchChange={setSearch}
          onFilterChange={setFilter}
          onKindFilterChange={setKindFilter}
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
      fab={
        isMobile && !showArchived && hasPermission(PermissionCode.PROMOTION_CREATE) ? (
          <ListCreateFab label={t('form.addPromo')} onClick={openCreate} />
        ) : undefined
      }
    >
      <PromotionsListBody
        items={paginatedItems}
        showArchived={showArchived}
        restorePending={restorePromotion.isPending}
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
        title={t('promotions.archiveTitle')}
        message={t('promotions.archiveMessage', { name: archiveTarget?.name ?? '' })}
        loading={archivePromotion.isPending}
        onConfirm={confirmArchive}
        onClose={() => setArchiveTargetId(null)}
      />
    </ListPageShell>
  );
};
