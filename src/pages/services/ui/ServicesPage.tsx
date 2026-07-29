import React from 'react';
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  FileButton,
  Group,
  Menu,
  Skeleton,
  Table,
  Tabs,
  Text,
  TextInput,
} from '@mantine/core';
import { Archive, DotsThree, MagnifyingGlass, PencilSimple, Plus, Sparkle, Trash, UploadSimple } from '@phosphor-icons/react';
import {
  useArchiveServiceCategory,
  useDeleteService,
  useDeleteServiceCategory,
  useImportServices,
  useServiceCategories,
  useServices,
} from '@/shared/api/hooks/useServices';
import type { Service, ServiceCategory } from '@/shared/api/types';
import { ConfirmModal, DataTable, DataTableRow, ListPage, Pagination } from '@/shared/ui';
import { formatPrice } from '@/shared/lib/format';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { ServiceFormModal } from './ServiceFormModal';
import { CategoryFormModal } from './CategoryFormModal';
import styles from './services-page.module.css';

export const ServicesPage: React.FC = () => {
  const [mainTab, setMainTab] = React.useState<string>('services');
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [search, setSearch] = React.useState('');

  const [serviceFormOpen, setServiceFormOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState<Service | null>(null);
  const [deleteServiceTarget, setDeleteServiceTarget] = React.useState<Service | null>(null);

  const [categoryFormOpen, setCategoryFormOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<ServiceCategory | null>(null);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = React.useState<ServiceCategory | null>(null);

  const { data: services, isLoading: servicesLoading, isError: servicesError } = useServices();
  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useServiceCategories();

  const deleteService = useDeleteService();
  const deleteCategory = useDeleteServiceCategory();
  const archiveCategory = useArchiveServiceCategory();
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
        const matchCategory = activeCategory === 'all' || String(service.category_id) === activeCategory;
        const matchSearch = !search || service.name.toLowerCase().includes(search.toLowerCase());
        return matchCategory && matchSearch;
      }),
    [services, activeCategory, search],
  );

  const { page, pageSize, paginatedItems, total, setPage, setPageSize, resetPage } = usePagination(filtered);

  React.useEffect(() => { resetPage(); }, [search, activeCategory, resetPage]);

  const categoryServiceCount = React.useMemo(() => {
    const map = new Map<number, number>();
    for (const s of services ?? []) {
      if (s.category_id != null) map.set(s.category_id, (map.get(s.category_id) ?? 0) + 1);
    }
    return map;
  }, [services]);

  const openServiceCreate = React.useCallback(() => { setEditingService(null); setServiceFormOpen(true); }, []);
  const openServiceEdit = React.useCallback((s: Service) => { setEditingService(s); setServiceFormOpen(true); }, []);
  const openCategoryCreate = React.useCallback(() => { setEditingCategory(null); setCategoryFormOpen(true); }, []);
  const openCategoryEdit = React.useCallback((c: ServiceCategory) => { setEditingCategory(c); setCategoryFormOpen(true); }, []);

  const handleImportFile = React.useCallback(
    (file: File | null) => {
      if (!file) return;
      importServices.mutate(file);
      resetImportRef.current?.();
    },
    [importServices],
  );

  if (isLoading) {
    return (
      <ListPage title="Услуги">
        <Skeleton height={48} mb="md" />
        <Skeleton height={400} radius="md" />
      </ListPage>
    );
  }

  if (isError) {
    return (
      <ListPage title="Услуги">
        <Alert color="red" title="Не удалось загрузить данные">Проверьте доступность API</Alert>
      </ListPage>
    );
  }

  return (
    <ListPage
      title="Услуги"
      subtitle={`${services?.length ?? 0} услуг · ${categories?.length ?? 0} категорий`}
      actions={
        <Group>
          {mainTab === 'services' && (
            <FileButton onChange={handleImportFile} accept=".xlsx,.xls" resetRef={resetImportRef}>
              {(props) => (
                <Button {...props} variant="light" leftSection={<UploadSimple size={16} />} loading={importServices.isPending}>
                  Импорт Excel
                </Button>
              )}
            </FileButton>
          )}
          <Button leftSection={<Plus size={16} />} onClick={mainTab === 'services' ? openServiceCreate : openCategoryCreate}>
            {mainTab === 'services' ? 'Добавить услугу' : 'Добавить категорию'}
          </Button>
        </Group>
      }
    >
      <Tabs value={mainTab} onChange={(v) => setMainTab(v ?? 'services')} variant="pills" radius="md" mb="md">
        <Tabs.List>
          <Tabs.Tab value="services">Услуги ({services?.length ?? 0})</Tabs.Tab>
          <Tabs.Tab value="categories">Категории ({categories?.length ?? 0})</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {mainTab === 'services' ? (
        <>
          <Group gap="md" className={styles.filtersRow} mb="md">
            <Tabs value={activeCategory} onChange={(v) => setActiveCategory(v ?? 'all')} variant="pills" radius="md">
              <Tabs.List>
                <Tabs.Tab value="all" fw={500} leftSection={<Sparkle size={14} />}>Все</Tabs.Tab>
                {(categories ?? []).map((c) => (
                  <Tabs.Tab key={c.id} value={String(c.id)} fw={500}>{c.name}</Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs>
            <TextInput placeholder="Поиск услуги..." leftSection={<MagnifyingGlass size={15} />} value={search} onChange={(e) => setSearch(e.currentTarget.value)} size="sm" className={styles.searchInput} />
          </Group>

          <DataTable
            columns={[
              { key: 'name', label: 'Услуга' },
              { key: 'category', label: 'Категория' },
              { key: 'duration', label: 'Длительность' },
              { key: 'price', label: 'Цена', align: 'right' },
              { key: 'actions', label: '', width: 48 },
            ]}
            isEmpty={filtered.length === 0}
            emptyMessage="Услуги не найдены"
          >
            {paginatedItems.map((service) => {
              const catLabel = service.category_id != null ? (categoryMap.get(service.category_id)?.name ?? '—') : '—';
              return (
                <DataTableRow key={service.id}>
                  <Table.Td><Text size="sm" fw={600}>{service.name}</Text></Table.Td>
                  <Table.Td>
                    {catLabel !== '—' ? <Badge size="sm" variant="light" color="gray">{catLabel}</Badge> : <Text size="sm" c="dimmed">—</Text>}
                  </Table.Td>
                  <Table.Td><Text size="sm" c="dimmed">{service.estimated_time > 0 ? `${service.estimated_time} мин` : '—'}</Text></Table.Td>
                  <Table.Td ta="right"><Text size="sm" fw={700}>{service.price > 0 ? formatPrice(service.price) : '—'}</Text></Table.Td>
                  <Table.Td>
                    <Menu shadow="sm" width={160} radius="md">
                      <Menu.Target><ActionIcon variant="subtle" color="gray" size="sm"><DotsThree size={16} weight="bold" /></ActionIcon></Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<PencilSimple size={14} />} onClick={() => openServiceEdit(service)}>Редактировать</Menu.Item>
                        <Menu.Item leftSection={<Trash size={14} />} color="red" onClick={() => setDeleteServiceTarget(service)}>Удалить</Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </DataTableRow>
              );
            })}
          </DataTable>
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </>
      ) : (
        <DataTable
          columns={[{ key: 'name', label: 'Категория' }, { key: 'count', label: 'Услуг' }, { key: 'actions', label: '', width: 48 }]}
          isEmpty={(categories ?? []).length === 0}
          emptyMessage="Категории не найдены"
        >
          {(categories ?? []).map((category) => (
            <DataTableRow key={category.id}>
              <Table.Td><Text size="sm" fw={600}>{category.name}</Text></Table.Td>
              <Table.Td><Text size="sm" c="dimmed">{categoryServiceCount.get(category.id) ?? 0}</Text></Table.Td>
              <Table.Td>
                <Menu shadow="sm" width={160} radius="md">
                  <Menu.Target><ActionIcon variant="subtle" color="gray" size="sm"><DotsThree size={16} weight="bold" /></ActionIcon></Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item leftSection={<PencilSimple size={14} />} onClick={() => openCategoryEdit(category)}>Редактировать</Menu.Item>
                    <Menu.Item leftSection={<Archive size={14} />} onClick={() => archiveCategory.mutate(category.id)}>Архивировать</Menu.Item>
                    <Menu.Item leftSection={<Trash size={14} />} color="red" onClick={() => setDeleteCategoryTarget(category)}>Удалить</Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Table.Td>
            </DataTableRow>
          ))}
        </DataTable>
      )}

      <ServiceFormModal opened={serviceFormOpen} service={editingService} categories={categories ?? []} onClose={() => setServiceFormOpen(false)} />
      <CategoryFormModal opened={categoryFormOpen} category={editingCategory} onClose={() => setCategoryFormOpen(false)} />

      <ConfirmModal opened={Boolean(deleteServiceTarget)} title="Удалить услугу" message={`Удалить «${deleteServiceTarget?.name ?? ''}»?`} loading={deleteService.isPending} onConfirm={() => deleteServiceTarget && deleteService.mutate(deleteServiceTarget.id, { onSuccess: () => setDeleteServiceTarget(null) })} onClose={() => setDeleteServiceTarget(null)} />
      <ConfirmModal opened={Boolean(deleteCategoryTarget)} title="Удалить категорию" message={`Удалить «${deleteCategoryTarget?.name ?? ''}»?`} loading={deleteCategory.isPending} onConfirm={() => deleteCategoryTarget && deleteCategory.mutate(deleteCategoryTarget.id, { onSuccess: () => setDeleteCategoryTarget(null) })} onClose={() => setDeleteCategoryTarget(null)} />
    </ListPage>
  );
};
