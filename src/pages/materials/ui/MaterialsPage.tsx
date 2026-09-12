import React from 'react';
import { Alert, Box, Button, Group, Skeleton, Stack, TextInput } from '@mantine/core';
import { MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react';
import {
  ArchiveToggle,
  ConfirmModal,
  ListCreateFab,
  ListPageShell,
  ListPageTitle,
  ListPaginationFooter,
  listPageStyles,
} from '@/shared/ui';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { useI18n } from '@/shared/lib/i18n';
import { useMaterialsPage } from '../lib/useMaterialsPage';
import { MaterialFormModal } from './MaterialFormModal';
import { QuantityModal } from './QuantityModal';
import { MaterialsListBody } from './MaterialsListBody';

export const MaterialsPage: React.FC = () => {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const { hasPermission } = useAccess();
  const {
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
    sort,
    toggleSort,
    openCreate,
    openEdit,
    handleChangeQuantity,
    restoreMaterial,
    archiveMaterial,
    confirmArchive,
  } = useMaterialsPage();

  if (isLoading) {
    return (
      <ListPageShell
        toolbar={
          <>
            <Skeleton height={32} width={240} radius="md" />
            <Skeleton height={32} width={160} radius="md" />
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
          <Alert color="red" title={t('materials.loadError')}>
            {t('common.checkApi')}
          </Alert>
        </Box>
      </ListPageShell>
    );
  }

  const { page, pageSize, paginatedItems, total, setPage, setPageSize } = pagination;
  const canCreate = hasPermission(PermissionCode.MATERIAL_CREATE);

  return (
    <ListPageShell
      toolbar={
        <>
          {isMobile && (
            <ListPageTitle onBack={showArchived ? () => setShowArchived(false) : undefined}>
              {showArchived ? t('appointments.archiveTab') : t('materials.title')}
            </ListPageTitle>
          )}
          <div className={listPageStyles.toolbarRow}>
            <TextInput
              placeholder={t('materials.searchPlaceholder')}
              leftSection={<MagnifyingGlassIcon size={16} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              size="sm"
              className={listPageStyles.searchInput}
            />
            <Group gap={8} wrap="nowrap">
              {!isMobile && !showArchived && canCreate && (
                <Button
                  color="sage.7"
                  rightSection={<PlusIcon size={16} />}
                  onClick={openCreate}
                  size="sm"
                >
                  {t('materials.add')}
                </Button>
              )}
              <ArchiveToggle
                className={isMobile ? listPageStyles.archiveBtn : undefined}
                active={showArchived}
                onChange={setShowArchived}
              />
            </Group>
          </div>
        </>
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
        isMobile && !showArchived && canCreate ? (
          <ListCreateFab label={t('materials.add')} onClick={openCreate} />
        ) : undefined
      }
    >
      <MaterialsListBody
        items={paginatedItems}
        showArchived={showArchived}
        restorePending={restoreMaterial.isPending}
        sort={sort}
        onSort={toggleSort}
        onEdit={openEdit}
        onArchive={(e, id) => {
          e.stopPropagation();
          setArchiveTargetId(id);
        }}
        onRestore={(e, id) => {
          e.stopPropagation();
          restoreMaterial.mutate(id);
        }}
      />

      <MaterialFormModal
        opened={formOpen}
        material={editing}
        onClose={() => setFormOpen(false)}
        onChangeQuantity={handleChangeQuantity}
      />
      <QuantityModal material={quantityTarget} onClose={() => setQuantityTargetId(null)} />
      <ConfirmModal
        opened={Boolean(archiveTarget)}
        title={t('materials.archiveTitle')}
        message={t('materials.archiveMessage', { name: archiveTarget?.name ?? '' })}
        loading={archiveMaterial.isPending}
        onConfirm={confirmArchive}
        onClose={() => setArchiveTargetId(null)}
      />
    </ListPageShell>
  );
};
