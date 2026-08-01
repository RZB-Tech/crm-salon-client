import React from 'react';
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Group,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import {
  ArchiveIcon,
  ArrowCounterClockwiseIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@phosphor-icons/react';
import { useArchiveMaterial, useMaterials, useRestoreMaterial } from '@/shared/api/hooks/useMaterials';
import type { Material } from '@/shared/api/types';
import {
  ArchiveToggle,
  ConfirmModal,
  ListPageShell,
  ListPaginationFooter,
  listPageStyles,
} from '@/shared/ui';
import { formatPrice, MEASUREMENT_UNIT_LABELS } from '@/shared/lib/format';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { MaterialFormModal } from './MaterialFormModal';
import { QuantityModal } from './QuantityModal';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';

export const MaterialsPage: React.FC = () => {
  const { hasPermission } = useAccess();
  const [search, setSearch] = React.useState('');
  const [showArchived, setShowArchived] = React.useState(false);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Material | null>(null);
  const [quantityTarget, setQuantityTarget] = React.useState<Material | null>(null);
  const [archiveTarget, setArchiveTarget] = React.useState<Material | null>(null);

  const { data: materials, isLoading, isError } = useMaterials(showArchived);
  const archiveMaterial = useArchiveMaterial();
  const restoreMaterial = useRestoreMaterial();

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

  const { page, pageSize, paginatedItems, total, setPage, setPageSize, resetPage } =
    usePagination(filtered, { defaultPageSize: 20 });

  React.useEffect(() => {
    resetPage();
  }, [search, resetPage]);

  const openCreate = React.useCallback(() => {
    setEditing(null);
    setFormOpen(true);
  }, []);
  const openEdit = React.useCallback((m: Material) => {
    setEditing(m);
    setFormOpen(true);
  }, []);

  const handleChangeQuantity = React.useCallback((m: Material) => {
    setFormOpen(false);
    setQuantityTarget(m);
  }, []);

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
      <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th className={listPageStyles.headCell}>Артикул</Table.Th>
            <Table.Th className={listPageStyles.headCell}>Название</Table.Th>
            <Table.Th className={listPageStyles.headCell} w={200}>Кол-во</Table.Th>
            <Table.Th className={listPageStyles.headCell} w={200}>Цена продажи</Table.Th>
            <Table.Th className={listPageStyles.headCell} w={48} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {paginatedItems.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={5}>
                <Text size="sm" c="dimmed" ta="center" py="xl">
                  Материалы не найдены
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            paginatedItems.map((material) => (
              <Table.Tr
                key={material.id}
                className={`${listPageStyles.row} ${!showArchived && hasPermission(PermissionCode.MATERIAL_UPDATE) ? listPageStyles.rowClickable : ''}`}
                onClick={
                  !showArchived && hasPermission(PermissionCode.MATERIAL_UPDATE)
                    ? () => openEdit(material)
                    : undefined
                }
              >
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" ff="monospace" c="rgba(72,72,72,0.4)">
                    {material.article}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" fw={400} c="#484848">
                    {material.name}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" fw={500} c="rgba(72,72,72,0.4)">
                    {material.quantity} {MEASUREMENT_UNIT_LABELS[material.measurement_unit]}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" fw={600} c="#484848">
                    {formatPrice(material.sell_price)}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  {hasPermission(PermissionCode.MATERIAL_MANAGE) && (
                    showArchived ? (
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        size="sm"
                        aria-label="Восстановить"
                        onClick={(e) => {
                          e.stopPropagation();
                          restoreMaterial.mutate(material.id);
                        }}
                      >
                        <ArrowCounterClockwiseIcon size={18} />
                      </ActionIcon>
                    ) : (
                      <ActionIcon
                        variant="subtle"
                        color="orange"
                        size="sm"
                        aria-label="Архивировать"
                        onClick={(e) => {
                          e.stopPropagation();
                          setArchiveTarget(material);
                        }}
                      >
                        <ArchiveIcon size={18} />
                      </ActionIcon>
                    )
                  )}
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>

      <MaterialFormModal
        opened={formOpen}
        material={editing}
        onClose={() => setFormOpen(false)}
        onChangeQuantity={handleChangeQuantity}
      />
      <QuantityModal material={quantityTarget} onClose={() => setQuantityTarget(null)} />
      <ConfirmModal
        opened={Boolean(archiveTarget)}
        title="Архивировать материал"
        message={`Архивировать «${archiveTarget?.name ?? ''}»? Материал будет скрыт из списка.`}
        loading={archiveMaterial.isPending}
        onConfirm={() =>
          archiveTarget &&
          archiveMaterial.mutate(archiveTarget.id, {
            onSuccess: () => setArchiveTarget(null),
          })
        }
        onClose={() => setArchiveTarget(null)}
      />
    </ListPageShell>
  );
};
