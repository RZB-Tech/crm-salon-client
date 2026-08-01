import React from 'react';
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  FileButton,
  Group,
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
  DownloadSimpleIcon,
  MagnifyingGlassIcon,
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
import {
  ArchiveToggle,
  ConfirmModal,
  ListPageShell,
  ListPaginationFooter,
  ListTabs,
  listPageStyles,
} from '@/shared/ui';
import { formatPrice } from '@/shared/lib/format';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { ServiceFormModal } from './ServiceFormModal';
import { CategoryFormModal } from './CategoryFormModal';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import styles from './services-page.module.css';

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
  const { hasPermission } = useAccess();
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [showArchived, setShowArchived] = React.useState(false);

  const [serviceFormOpen, setServiceFormOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState<Service | null>(null);
  const [archiveServiceTarget, setArchiveServiceTarget] = React.useState<Service | null>(null);

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

  return (
    <ListPageShell
      toolbar={
        <>
          <ListTabs
            value={activeCategory}
            onChange={setActiveCategory}
            data={segmentData}
            action={
              <Tooltip label="Добавить категорию" position="bottom">
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="sage"
                  onClick={() => setCategoryFormOpen(true)}
                  aria-label="Добавить категорию"
                >
                  <PlusIcon size={16} />
                </ActionIcon>
              </Tooltip>
            }
          />

          <Group gap={8} wrap="nowrap">
            <TextInput
              placeholder="Поиск услуги"
              leftSection={<MagnifyingGlassIcon size={16} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              size="sm"
              className={listPageStyles.searchInput}
            />
            {!showArchived && (
              <>
                {hasPermission(PermissionCode.SERVICE_IMPORT) && (
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
                )}
                {hasPermission(PermissionCode.SERVICE_CREATE) && (
                  <Button
                    color="sage.6"
                    rightSection={<PlusIcon size={16} />}
                    onClick={openServiceCreate}
                    size="sm"
                  >
                    Добавить услугу
                  </Button>
                )}
              </>
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
            <Table.Th className={listPageStyles.headCell}>Услуга</Table.Th>
            <Table.Th className={listPageStyles.headCell} w={275}>
              Длительность
            </Table.Th>
            <Table.Th className={listPageStyles.headCell} w={380}>
              Категория
            </Table.Th>
            <Table.Th className={listPageStyles.headCell} w={310}>
              Цена
            </Table.Th>
            <Table.Th className={listPageStyles.headCell} w={48} />
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
                <Table.Tr
                  key={service.id}
                  className={`${listPageStyles.row} ${!showArchived && hasPermission(PermissionCode.SERVICE_UPDATE) ? listPageStyles.rowClickable : ''}`}
                  onClick={
                    !showArchived && hasPermission(PermissionCode.SERVICE_UPDATE)
                      ? () => openServiceEdit(service)
                      : undefined
                  }
                >
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Text size="sm" fw={400} c="#484848">
                      {service.name}
                    </Text>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Text size="sm" fw={500} c="rgba(72,72,72,0.4)">
                      {formatDuration(service.estimated_time)}
                    </Text>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
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
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Text size="sm" fw={600} c="#484848">
                      {service.price > 0 ? formatPrice(service.price) : '—'}
                    </Text>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    {hasPermission(PermissionCode.SERVICE_MANAGE) && (
                      showArchived ? (
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          size="sm"
                          aria-label="Восстановить"
                          onClick={(e) => {
                            e.stopPropagation();
                            restoreService.mutate(service.id);
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
                            setArchiveServiceTarget(service);
                          }}
                        >
                          <ArchiveIcon size={18} />
                        </ActionIcon>
                      )
                    )}
                  </Table.Td>
                </Table.Tr>
              );
            })
          )}
        </Table.Tbody>
      </Table>

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
    </ListPageShell>
  );
};
