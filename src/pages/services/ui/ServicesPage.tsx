import React from 'react';
import {
  Group,
  Text,
  Badge,
  Card,
  SimpleGrid,
  Tabs,
  TextInput,
  Skeleton,
  Alert,
  Button,
  ActionIcon,
  Menu,
  Modal,
  Select,
} from '@mantine/core';
import { Clock, MagnifyingGlass, Scissors, Sparkle, Plus, DotsThree, PencilSimple, Trash } from '@phosphor-icons/react';
import {
  useCreateService,
  useCreateServiceCategory,
  useDeleteService,
  useDeleteServiceCategory,
  useServiceCategories,
  useServices,
  useUpdateService,
  useUpdateServiceCategory,
} from '@/shared/api/hooks/useServices';
import type {
  Service,
  ServiceCategory,
  ServiceCategoryCreatePayload,
  ServiceCategoryUpdatePayload,
  ServiceCreatePayload,
  ServiceUpdatePayload,
} from '@/shared/api/types';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { getEmployeeColor } from '@/shared/lib/format';
import styles from './services-page.module.css';

interface ServiceCardProps {
  service: Service;
  categoryName: string | null;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, categoryName, onEdit, onDelete }) => {
  const color = getEmployeeColor(service.category_id ?? service.id);
  return (
    <Card padding="lg" radius="lg" shadow="xs" className={styles.serviceCard}>
      <Group justify="space-between" align="flex-start" mb="md">
        <div className={styles.serviceIconWrap} style={{ backgroundColor: `color-mix(in srgb, ${color} 12%, white)` }}>
          <Scissors size={18} color={color} weight="duotone" />
        </div>
        <Menu shadow="sm" width={160} radius="md">
          <Menu.Target><ActionIcon variant="subtle" color="gray" size="sm"><DotsThree size={16} weight="bold" /></ActionIcon></Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<PencilSimple size={14} />} onClick={() => onEdit(service)}>Редактировать</Menu.Item>
            <Menu.Item leftSection={<Trash size={14} />} color="red" onClick={() => onDelete(service)}>Удалить</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <Text fw={600} size="sm" mb={4}>{service.name}</Text>
      {categoryName && <Badge size="xs" variant="light" color="gray" radius="sm" mb="md" style={{ color }}>{categoryName}</Badge>}
      <Group justify="space-between" mt="auto">
        <Group gap={5}><Clock size={13} color="var(--mantine-color-gray-5)" /><Text size="xs" c="dimmed">ID {service.id}</Text></Group>
      </Group>
    </Card>
  );
};

export const ServicesPage: React.FC = () => {
  const [mainTab, setMainTab] = React.useState<string>('services');
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [search, setSearch] = React.useState('');

  const [serviceFormOpen, setServiceFormOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState<Service | null>(null);
  const [serviceName, setServiceName] = React.useState('');
  const [serviceCategory, setServiceCategory] = React.useState<string | null>(null);
  const [deleteServiceTarget, setDeleteServiceTarget] = React.useState<Service | null>(null);

  const [categoryFormOpen, setCategoryFormOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<ServiceCategory | null>(null);
  const [categoryName, setCategoryName] = React.useState('');
  const [deleteCategoryTarget, setDeleteCategoryTarget] = React.useState<ServiceCategory | null>(null);

  const { data: services, isLoading: servicesLoading, isError: servicesError } = useServices();
  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useServiceCategories();

  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const createCategory = useCreateServiceCategory();
  const updateCategory = useUpdateServiceCategory();
  const deleteCategory = useDeleteServiceCategory();

  const isLoading = servicesLoading || categoriesLoading;
  const isError = servicesError || categoriesError;

  const categoryMap = React.useMemo(() => {
    const map = new Map<number, ServiceCategory>();
    for (const c of categories ?? []) map.set(c.id, c);
    return map;
  }, [categories]);

  const filtered = React.useMemo(() => (services ?? []).filter((s) => {
    const matchCategory = activeCategory === 'all' || String(s.category_id) === activeCategory;
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  }), [services, activeCategory, search]);

  const openServiceCreate = React.useCallback(() => {
    setEditingService(null);
    setServiceName('');
    setServiceCategory(null);
    setServiceFormOpen(true);
  }, []);

  const openServiceEdit = React.useCallback((service: Service) => {
    setEditingService(service);
    setServiceName(service.name);
    setServiceCategory(service.category_id != null ? String(service.category_id) : null);
    setServiceFormOpen(true);
  }, []);

  const submitService = React.useCallback(() => {
    if (editingService) {
      const payload: ServiceUpdatePayload = {
        id: editingService.id,
        name: serviceName,
        category_id: serviceCategory ? Number(serviceCategory) : null,
      };
      updateService.mutate(payload, { onSuccess: () => setServiceFormOpen(false) });
    } else {
      const payload: ServiceCreatePayload = {
        name: serviceName,
        category_id: serviceCategory ? Number(serviceCategory) : null,
      };
      createService.mutate(payload, { onSuccess: () => setServiceFormOpen(false) });
    }
  }, [serviceName, serviceCategory, editingService, createService, updateService]);

  const openCategoryCreate = React.useCallback(() => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryFormOpen(true);
  }, []);

  const openCategoryEdit = React.useCallback((category: ServiceCategory) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryFormOpen(true);
  }, []);

  const submitCategory = React.useCallback(() => {
    if (editingCategory) {
      const payload: ServiceCategoryUpdatePayload = { id: editingCategory.id, name: categoryName };
      updateCategory.mutate(payload, { onSuccess: () => setCategoryFormOpen(false) });
    } else {
      const payload: ServiceCategoryCreatePayload = { name: categoryName };
      createCategory.mutate(payload, { onSuccess: () => setCategoryFormOpen(false) });
    }
  }, [categoryName, editingCategory, createCategory, updateCategory]);

  if (isLoading) {
    return <div className={styles.page}><Skeleton height={48} mb="md" /><SimpleGrid cols={4} spacing="md">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} height={160} radius="lg" />)}</SimpleGrid></div>;
  }

  if (isError) {
    return <div className={styles.page}><Alert color="red" title="Не удалось загрузить данные">Проверьте доступность API</Alert></div>;
  }

  const categoryOptions = (categories ?? []).map((c) => ({ value: String(c.id), label: c.name }));

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <Text size="xl" fw={700}>Услуги</Text>
          <Text size="sm" c="dimmed" mt={2}>{services?.length ?? 0} услуг · {categories?.length ?? 0} категорий</Text>
        </div>
        <Button leftSection={<Plus size={16} />} onClick={mainTab === 'services' ? openServiceCreate : openCategoryCreate}>
          {mainTab === 'services' ? 'Добавить услугу' : 'Добавить категорию'}
        </Button>
      </div>

      <Tabs value={mainTab} onChange={(v) => setMainTab(v ?? 'services')} variant="pills" radius="md" mb="md">
        <Tabs.List>
          <Tabs.Tab value="services">Услуги</Tabs.Tab>
          <Tabs.Tab value="categories">Категории</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {mainTab === 'services' ? (
        <>
          <Group gap="md" className={styles.filtersRow}>
            <Tabs value={activeCategory} onChange={(v) => setActiveCategory(v ?? 'all')} variant="pills" radius="md">
              <Tabs.List>
                <Tabs.Tab value="all" fw={500} leftSection={<Sparkle size={14} />}>Все</Tabs.Tab>
                {(categories ?? []).map((c) => <Tabs.Tab key={c.id} value={String(c.id)} fw={500}>{c.name}</Tabs.Tab>)}
              </Tabs.List>
            </Tabs>
            <TextInput placeholder="Поиск услуги..." leftSection={<MagnifyingGlass size={15} />} value={search} onChange={(e) => setSearch(e.currentTarget.value)} size="sm" style={{ width: 240 }} />
          </Group>
          {filtered.length === 0 ? (
            <Text c="dimmed">Услуги не найдены</Text>
          ) : (
            <SimpleGrid cols={4} spacing="md" className={styles.grid}>
              {filtered.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  categoryName={service.category_id != null ? (categoryMap.get(service.category_id)?.name ?? null) : null}
                  onEdit={openServiceEdit}
                  onDelete={setDeleteServiceTarget}
                />
              ))}
            </SimpleGrid>
          )}
        </>
      ) : (
        <SimpleGrid cols={3} spacing="md">
          {(categories ?? []).length === 0 ? (
            <Text c="dimmed">Категории не найдены</Text>
          ) : (
            (categories ?? []).map((category) => (
              <Card key={category.id} padding="lg" radius="lg" shadow="xs">
                <Group justify="space-between">
                  <Text fw={600}>{category.name}</Text>
                  <Menu shadow="sm" width={160} radius="md">
                    <Menu.Target><ActionIcon variant="subtle" color="gray" size="sm"><DotsThree size={16} weight="bold" /></ActionIcon></Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item leftSection={<PencilSimple size={14} />} onClick={() => openCategoryEdit(category)}>Редактировать</Menu.Item>
                      <Menu.Item leftSection={<Trash size={14} />} color="red" onClick={() => setDeleteCategoryTarget(category)}>Удалить</Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
                <Text size="xs" c="dimmed" mt="sm">ID {category.id}</Text>
              </Card>
            ))
          )}
        </SimpleGrid>
      )}

      <Modal opened={serviceFormOpen} onClose={() => setServiceFormOpen(false)} title={editingService ? 'Редактировать услугу' : 'Новая услуга'} radius="md">
        <TextInput label="Название" required mb="md" value={serviceName} onChange={(e) => setServiceName(e.currentTarget.value)} />
        <Select label="Категория" data={categoryOptions} clearable mb="lg" value={serviceCategory} onChange={setServiceCategory} />
        <Group justify="flex-end">
          <Button variant="subtle" color="gray" onClick={() => setServiceFormOpen(false)}>Отмена</Button>
          <Button onClick={submitService} loading={createService.isPending || updateService.isPending} disabled={!serviceName}>
            {editingService ? 'Сохранить' : 'Создать'}
          </Button>
        </Group>
      </Modal>

      <Modal opened={categoryFormOpen} onClose={() => setCategoryFormOpen(false)} title={editingCategory ? 'Редактировать категорию' : 'Новая категория'} radius="md">
        <TextInput label="Название" required mb="lg" value={categoryName} onChange={(e) => setCategoryName(e.currentTarget.value)} />
        <Group justify="flex-end">
          <Button variant="subtle" color="gray" onClick={() => setCategoryFormOpen(false)}>Отмена</Button>
          <Button onClick={submitCategory} loading={createCategory.isPending || updateCategory.isPending} disabled={!categoryName}>
            {editingCategory ? 'Сохранить' : 'Создать'}
          </Button>
        </Group>
      </Modal>

      <ConfirmModal opened={Boolean(deleteServiceTarget)} title="Удалить услугу" message={`Удалить «${deleteServiceTarget?.name ?? ''}»?`} loading={deleteService.isPending} onConfirm={() => deleteServiceTarget && deleteService.mutate(deleteServiceTarget.id, { onSuccess: () => setDeleteServiceTarget(null) })} onClose={() => setDeleteServiceTarget(null)} />
      <ConfirmModal opened={Boolean(deleteCategoryTarget)} title="Удалить категорию" message={`Удалить «${deleteCategoryTarget?.name ?? ''}»?`} loading={deleteCategory.isPending} onConfirm={() => deleteCategoryTarget && deleteCategory.mutate(deleteCategoryTarget.id, { onSuccess: () => setDeleteCategoryTarget(null) })} onClose={() => setDeleteCategoryTarget(null)} />
    </div>
  );
};
