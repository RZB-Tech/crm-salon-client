import React from 'react';
import { Alert, Box, Button, Group, Skeleton, Stack, TextInput } from '@mantine/core';
import { MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react';
import {
  ArchiveToggle,
  ConfirmModal,
  ListPageShell,
  ListPaginationFooter,
  listPageStyles,
} from '@/shared/ui';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { useMaterialsPage } from '../lib/useMaterialsPage';
import { MaterialFormModal } from './MaterialFormModal';
import { QuantityModal } from './QuantityModal';
import { MaterialsTable } from './MaterialsTable';

export const MaterialsPage: React.FC = () => {
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
          <Alert color="red" title="Не удалось загрузить материалы">
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
        <>
          <TextInput
            placeholder="Поиск по названию или артикулу..."
            leftSection={<MagnifyingGlassIcon size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            size="sm"
            className={listPageStyles.searchInput}
          />
          <Group gap={8} wrap="nowrap">
            {!showArchived && hasPermission(PermissionCode.MATERIAL_CREATE) && (
              <Button
                color="sage.7"
                rightSection={<PlusIcon size={16} />}
                onClick={openCreate}
                size="sm"
              >
                Добавить материал
              </Button>
            )}
            <ArchiveToggle active={showArchived} onChange={setShowArchived} />
          </Group>
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
    >
      <MaterialsTable
        items={paginatedItems}
        showArchived={showArchived}
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
        title="Архивировать материал"
        message={`Архивировать «${archiveTarget?.name ?? ''}»? Материал будет скрыт из списка.`}
        loading={archiveMaterial.isPending}
        onConfirm={confirmArchive}
        onClose={() => setArchiveTargetId(null)}
      />
    </ListPageShell>
  );
};
