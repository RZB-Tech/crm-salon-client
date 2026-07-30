import React from 'react';
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  FileButton,
  Group,
  Menu,
  Pagination as MantinePagination,
  SegmentedControl,
  Select,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import {
  ArchiveIcon,
  ArrowCounterClockwiseIcon,
  DotsThreeVerticalIcon,
  DownloadSimpleIcon,
  MagnifyingGlassIcon,
  PencilSimpleIcon,
  PlusIcon,
} from '@phosphor-icons/react';
import {
  useArchiveService,
  useImportServices,
  useRestoreService,
  useServiceCategories,
  useServices,
} from '@/shared/api/hooks/useServices';
import type { Service, ServiceCategory } from '@/shared/api/types';
import { ConfirmModal } from '@/shared/ui';
import { formatPrice } from '@/shared/lib/format';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { ServiceFormModal } from './ServiceFormModal';
import { CategoryFormModal } from './CategoryFormModal';
import styles from './services-page.module.css';

const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '50', label: '50' },
  { value: '100', label: '100' },
];

const formatDuration = (minutes: number): string => {
  if (minutes <= 0) return '—';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} мин`;
  if (mins === 0) {
    return hours === 1 ? '1 час' : `${hours} часа`;
  }
  const hourLabel = hours === 1 ? '1 час' : `${hours} часа`;
  return `${hourLabel} ${mins} минут`;
};

export const ServicesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [showArchived, setShowArchived] = React.useState(false);

  const [serviceFormOpen, setServiceFormOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState<Service | null>(null);
  const [archiveServiceTarget, setArchiveServiceTarget] = React.useState<Service | null>(null);

  // Keep category modal for potential usage from other places
  const [categoryFormOpen, setCategoryFormOpen] = React.useState(false);
  const [editingCategory] = React.useState<ServiceCategory | null>(null);

  const { data: services, isLoading: servicesLoading, isError: servicesError } = useServices(showArchived);
  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useServiceCategories();

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

  const segmentData = React.useMemo(() => {
    const items = [{ value: 'all', label: 'Все' }];
    for (const c of categories ?? []) {
      items.push({ value: String(c.id), label: c.name });
    }
    return items;
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

  const { page, pageSize, paginatedItems, total, setPage, setPageSize, resetPage } =
    usePagination(filtered, { defaultPageSize: 20 });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  React.useEffect(() => {
    resetPage();
  }, [search, activeCategory, resetPage]);

  const openServiceCreate = React.useCallback(() => {
    setEditingService(null);
    setServiceFormOpen(true);
  }, []);

  const openServiceEdit = React.useCallback((s: Service) => {
    setEditingService(s);
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

  if (isLoading) {
    return (
      <Box className={styles.page}>
        <Box className={styles.toolbar}>
          <Skeleton height={32} width={400} radius="sm" />
          <Skeleton height={32} width={240} radius="md" />
        </Box>
        <Stack gap="xs" p="md">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} height={48} radius="sm" />
          ))}
        </Stack>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className={styles.page}>
        <Box p="xl">
          <Alert color="red" title="Не удалось загрузить данные">
            Проверьте доступность API
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box className={styles.page}>
      <Box className={styles.toolbar}>
        <Group gap={8}>
          <SegmentedControl
            value={activeCategory}
            onChange={setActiveCategory}
            data={segmentData}
            size="xs"
            radius="sm"
            color="sage.6"
            styles={{
              root: { background: '#f9f6f3' },
            }}
          />
          <Tooltip label="Добавить категорию" position="right">
            <ActionIcon
              variant="subtle"
              color="sage"
              size="sm"
              onClick={() => setCategoryFormOpen(true)}
              aria-label="Добавить категорию"
            >
              <PlusIcon size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={showArchived ? 'Показать активные' : 'Показать архив'} position="right">
            <ActionIcon
              variant={showArchived ? 'filled' : 'subtle'}
              color={showArchived ? 'orange' : 'gray'}
              size="sm"
              onClick={() => setShowArchived((v) => !v)}
              aria-label="Переключить архив"
            >
              <ArchiveIcon size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Group gap={8}>
          <TextInput
            placeholder="Поиск услуги"
            leftSection={<MagnifyingGlassIcon size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            size="sm"
            className={styles.searchInput}
          />
          {!showArchived && (
            <>
              <FileButton
                onChange={handleImportFile}
                accept=".xlsx,.xls"
                resetRef={resetImportRef}
              >
                {(props) => (
                  <Button
                    {...props}
                    variant="light"
                    color="sage"
                    rightSection={<DownloadSimpleIcon size={16} />}
                    size="sm"
                    loading={importServices.isPending}
                  >
                    Импорт Excel
                  </Button>
                )}
              </FileButton>
              <Button
                color="sage.6"
                rightSection={<PlusIcon size={16} />}
                onClick={openServiceCreate}
                size="sm"
              >
                Добавить услугу
              </Button>
            </>
          )}
        </Group>
      </Box>

      <Box className={styles.tableWrapper}>
        <Table verticalSpacing="sm" horizontalSpacing="md" className={styles.table}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className={styles.headCell}>Услуга</Table.Th>
              <Table.Th className={styles.headCell} w={275}>
                Длительность
              </Table.Th>
              <Table.Th className={styles.headCell} w={380}>
                Категория
              </Table.Th>
              <Table.Th className={styles.headCell} w={310}>
                Цена
              </Table.Th>
              <Table.Th className={styles.headCell} w={48} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedItems.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text size="sm" c="dimmed" ta="center" py="xl">
                    Услуги не найдены
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              paginatedItems.map((service) => {
                const catLabel =
                  service.category_id != null
                    ? (categoryMap.get(service.category_id)?.name ?? null)
                    : null;
                return (
                  <Table.Tr key={service.id} className={styles.row}>
                    <Table.Td className={styles.bodyCell}>
                      <Text size="sm" fw={400} c="#484848">
                        {service.name}
                      </Text>
                    </Table.Td>
                    <Table.Td className={styles.bodyCell}>
                      <Text size="sm" fw={500} c="rgba(72,72,72,0.4)">
                        {formatDuration(service.estimated_time)}
                      </Text>
                    </Table.Td>
                    <Table.Td className={styles.bodyCell}>
                      {catLabel ? (
                        <Badge
                          size="sm"
                          radius="xl"
                          className={styles.categoryBadge}
                        >
                          {catLabel}
                        </Badge>
                      ) : (
                        <Text size="sm" c="dimmed">
                          —
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td className={styles.bodyCell}>
                      <Text size="sm" fw={600} c="#484848">
                        {service.price > 0 ? formatPrice(service.price) : '—'}
                      </Text>
                    </Table.Td>
                    <Table.Td className={styles.bodyCell}>
                      <Menu shadow="sm" width={160} radius="md">
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray" size="sm">
                            <DotsThreeVerticalIcon size={20} weight="bold" />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          {showArchived ? (
                            <Menu.Item
                              leftSection={<ArrowCounterClockwiseIcon size={14} />}
                              onClick={() => restoreService.mutate(service.id)}
                            >
                              Восстановить
                            </Menu.Item>
                          ) : (
                            <>
                              <Menu.Item
                                leftSection={<PencilSimpleIcon size={14} />}
                                onClick={() => openServiceEdit(service)}
                              >
                                Редактировать
                              </Menu.Item>
                              <Menu.Item
                                leftSection={<ArchiveIcon size={14} />}
                                color="orange"
                                onClick={() => setArchiveServiceTarget(service)}
                              >
                                Архивировать
                              </Menu.Item>
                            </>
                          )}
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                );
              })
            )}
          </Table.Tbody>
        </Table>
      </Box>

      <Box className={styles.pagination}>
        <Box className={styles.paginationMeta}>
          <Group gap={8}>
            <Text size="sm" fw={500} c="#484848">
              Показать:
            </Text>
            <Select
              size="xs"
              w={64}
              data={PAGE_SIZE_OPTIONS}
              value={String(pageSize)}
              onChange={(value) => {
                if (value) setPageSize(Number(value));
              }}
              allowDeselect={false}
            />
          </Group>
          <Text size="sm" c="#484848">
            {from}–{to} из {total}
          </Text>
        </Box>

        <MantinePagination
          value={page}
          onChange={setPage}
          total={totalPages}
          size="lg"
          radius="sm"
        />
      </Box>

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
        onConfirm={() =>
          archiveServiceTarget &&
          archiveService.mutate(archiveServiceTarget.id, {
            onSuccess: () => setArchiveServiceTarget(null),
          })
        }
        onClose={() => setArchiveServiceTarget(null)}
      />
    </Box>
  );
};
