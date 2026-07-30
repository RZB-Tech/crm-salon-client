import React from 'react';
import { ActionIcon, Alert, Button, Group, Menu, Skeleton, Table, Text, TextInput, Tooltip } from '@mantine/core';
import { Archive, ArrowCounterClockwise, DotsThree, MagnifyingGlassIcon, PencilSimple, Plus } from '@phosphor-icons/react';
import { useArchiveMaterial, useMaterials, useRestoreMaterial } from '@/shared/api/hooks/useMaterials';
import type { Material } from '@/shared/api/types';
import { ConfirmModal, DataTable, DataTableRow, ListPage, Pagination } from '@/shared/ui';
import { formatPrice, MEASUREMENT_UNIT_LABELS } from '@/shared/lib/format';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { MaterialFormModal } from './MaterialFormModal';
import { QuantityModal } from './QuantityModal';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import styles from './materials-page.module.css';

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

  const { page, pageSize, paginatedItems, total, setPage, setPageSize, resetPage } = usePagination(filtered);

  React.useEffect(() => { resetPage(); }, [search, resetPage]);

  const openCreate = React.useCallback(() => { setEditing(null); setFormOpen(true); }, []);
  const openEdit = React.useCallback((m: Material) => { setEditing(m); setFormOpen(true); }, []);

  if (isLoading) {
    return <ListPage title="Склад"><Skeleton height={48} mb="md" /><Skeleton height={400} radius="md" /></ListPage>;
  }

  if (isError) {
    return <ListPage title="Склад"><Alert color="red" title="Не удалось загрузить материалы">Проверьте доступность API</Alert></ListPage>;
  }

  return (
    <ListPage
      title="Склад"
      subtitle={`${materials?.length ?? 0} ${showArchived ? 'в архиве' : 'материалов'}`}
      actions={
        <Group gap="sm">
          <Tooltip label={showArchived ? 'Показать активные' : 'Показать архив'}>
            <ActionIcon
              variant={showArchived ? 'filled' : 'subtle'}
              color={showArchived ? 'orange' : 'gray'}
              size="lg"
              onClick={() => setShowArchived((v) => !v)}
              aria-label="Переключить архив"
            >
              <Archive size={20} />
            </ActionIcon>
          </Tooltip>
          <TextInput placeholder="Поиск по названию или артикулу..." leftSection={<MagnifyingGlassIcon size={15} />} value={search} onChange={(e) => setSearch(e.currentTarget.value)} size="sm" className={styles.searchInput} />
          {!showArchived && hasPermission(PermissionCode.MATERIAL_CREATE) && (
            <Button leftSection={<Plus size={16} />} onClick={openCreate}>Добавить материал</Button>
          )}
        </Group>
      }
    >
      <DataTable
        columns={[
          { key: 'article', label: 'Артикул' },
          { key: 'name', label: 'Название' },
          { key: 'quantity', label: 'Кол-во' },
          { key: 'price', label: 'Цена продажи' },
          { key: 'actions', label: '', width: 48 },
        ]}
        isEmpty={filtered.length === 0}
        emptyMessage="Материалы не найдены"
      >
        {paginatedItems.map((material) => (
          <DataTableRow key={material.id}>
            <Table.Td><Text size="sm" ff="monospace" c="dimmed">{material.article}</Text></Table.Td>
            <Table.Td><Text size="sm" fw={500}>{material.name}</Text></Table.Td>
            <Table.Td><Text size="sm">{material.quantity} {MEASUREMENT_UNIT_LABELS[material.measurement_unit]}</Text></Table.Td>
            <Table.Td><Text size="sm" fw={600}>{formatPrice(material.sell_price)}</Text></Table.Td>
            <Table.Td>
              <Menu shadow="sm" width={180} radius="md">
                <Menu.Target><ActionIcon variant="subtle" color="gray" size="sm"><DotsThree size={16} weight="bold" /></ActionIcon></Menu.Target>
                <Menu.Dropdown>
                  {showArchived ? (
                    hasPermission(PermissionCode.MATERIAL_MANAGE) && <Menu.Item leftSection={<ArrowCounterClockwise size={14} />} onClick={() => restoreMaterial.mutate(material.id)}>Восстановить</Menu.Item>
                  ) : (
                    <>
                      {hasPermission(PermissionCode.MATERIAL_UPDATE) && <Menu.Item leftSection={<PencilSimple size={14} />} onClick={() => openEdit(material)}>Редактировать</Menu.Item>}
                      {hasPermission(PermissionCode.MATERIAL_UPDATE_QUANTITY) && <Menu.Item onClick={() => setQuantityTarget(material)}>Изменить количество</Menu.Item>}
                      {hasPermission(PermissionCode.MATERIAL_MANAGE) && <Menu.Item leftSection={<Archive size={14} />} color="orange" onClick={() => setArchiveTarget(material)}>Архивировать</Menu.Item>}
                    </>
                  )}
                </Menu.Dropdown>
              </Menu>
            </Table.Td>
          </DataTableRow>
        ))}
      </DataTable>

      <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} onPageSizeChange={setPageSize} />

      <MaterialFormModal opened={formOpen} material={editing} onClose={() => setFormOpen(false)} />
      <QuantityModal material={quantityTarget} onClose={() => setQuantityTarget(null)} />
      <ConfirmModal opened={Boolean(archiveTarget)} title="Архивировать материал" message={`Архивировать «${archiveTarget?.name ?? ''}»? Материал будет скрыт из списка.`} loading={archiveMaterial.isPending} onConfirm={() => archiveTarget && archiveMaterial.mutate(archiveTarget.id, { onSuccess: () => setArchiveTarget(null) })} onClose={() => setArchiveTarget(null)} />
    </ListPage>
  );
};
