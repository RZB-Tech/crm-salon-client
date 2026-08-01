import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ActionIcon,
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import {
  ArchiveIcon,
  ArrowCounterClockwiseIcon,
  PlusIcon,
} from '@phosphor-icons/react';
import {
  useCreateEmployee,
  useArchiveEmployee,
  useEmployees,
  useRestoreEmployee,
} from '@/shared/api/hooks/useEmployees';
import { useSpecializations } from '@/shared/api/hooks/useSpecializations';
import type { EmployeeCreatePayload, Employee, EmployeeUpdatePayload } from '@/shared/api/types';
import {
  ArchiveToggle,
  ConfirmModal,
  ListPageShell,
  ListPaginationFooter,
  listPageStyles,
  ViewModeToggle,
  type ListViewMode,
} from '@/shared/ui';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import {
  formatPrice,
  getEmployeeFullName,
  getEmployeeInitials,
} from '@/shared/lib/format';
import { EmployeeFormModal } from './modals/EmployeeFormModal';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import styles from './employees-page.module.css';

const VIEW_STORAGE_KEY = 'employees.view';

const readStoredView = (): ListViewMode => {
  try {
    const value = localStorage.getItem(VIEW_STORAGE_KEY);
    return value === 'table' ? 'table' : 'cards';
  } catch {
    return 'cards';
  }
};

interface EmployeeCardProps {
  employee: Employee;
  specializationName: string | null;
  showArchived: boolean;
  canManage: boolean;
  onOpen: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onRestore: (employee: Employee) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  specializationName,
  showArchived,
  canManage,
  onOpen,
  onDelete,
  onRestore,
}) => {
  const servicesCount = employee.services?.length ?? 0;

  return (
    <Card
      padding="lg"
      radius="md"
      className={styles.card}
      onClick={() => onOpen(employee)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onOpen(employee);
      }}
    >
      <Group justify="space-between" align="flex-start" mb="md">
        <Group gap={12}>
          <Avatar radius="md" size="lg" color="sage">
            {getEmployeeInitials(employee)}
          </Avatar>
          <Box>
            <Text fw={600} size="sm" c="#484848">
              {getEmployeeFullName(employee)}
            </Text>
            <Text size="sm" c="rgba(72,72,72,0.4)">
              {specializationName ?? employee.phone ?? '—'}
            </Text>
          </Box>
        </Group>
        <Group gap={6}>
          <Badge color={employee.active ? 'green' : 'gray'} variant="light" size="sm">
            {employee.active ? 'Активен' : 'Неактивен'}
          </Badge>
          {canManage && (
            showArchived ? (
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                aria-label="Восстановить"
                onClick={(e) => {
                  e.stopPropagation();
                  onRestore(employee);
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
                  onDelete(employee);
                }}
              >
                <ArchiveIcon size={18} />
              </ActionIcon>
            )
          )}
        </Group>
      </Group>

      <Group gap={6} mb="md">
        <Badge size="xs" variant="light" color="gray">
          Услуг: {servicesCount}
        </Badge>
        {employee.salary_fixed > 0 && (
          <Badge size="xs" variant="light" color="sage">
            Фикс: {formatPrice(employee.salary_fixed)}
          </Badge>
        )}
        {employee.percent_from_services > 0 && (
          <Badge size="xs" variant="light" color="teal">
            % услуг: {employee.percent_from_services}
          </Badge>
        )}
      </Group>

      <Divider mb="md" />
      <Text size="xs" c="dimmed">
        Дата рождения: {employee.birth_date}
      </Text>
    </Card>
  );
};

export const EmployeesPage: React.FC = () => {
  const { hasPermission } = useAccess();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = React.useState(false);
  const [archiveTarget, setArchiveTarget] = React.useState<Employee | null>(null);
  const [showArchived, setShowArchived] = React.useState(false);
  const [view, setView] = React.useState<ListViewMode>(readStoredView);

  const { data: employees, isLoading, isError } = useEmployees(showArchived);
  const { data: specializations } = useSpecializations();
  const createEmployee = useCreateEmployee();
  const archiveEmployee = useArchiveEmployee();
  const restoreEmployee = useRestoreEmployee();

  const specializationMap = React.useMemo(() => {
    const map = new Map<number, string>();
    for (const s of specializations ?? []) map.set(s.id, s.name);
    return map;
  }, [specializations]);

  const list = employees ?? [];
  const { page, pageSize, paginatedItems, total, setPage, setPageSize, resetPage } = usePagination(
    list,
    { defaultPageSize: 20 },
  );

  React.useEffect(() => {
    resetPage();
  }, [showArchived, resetPage]);

  React.useEffect(() => {
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, view);
    } catch {
      /* ignore */
    }
  }, [view]);

  const openProfile = React.useCallback(
    (employee: Employee) => navigate(`/employees/${employee.id}`),
    [navigate],
  );

  const handleCreate = React.useCallback(
    (payload: EmployeeCreatePayload | EmployeeUpdatePayload) => {
      createEmployee.mutate(payload as EmployeeCreatePayload, {
        onSuccess: () => setFormOpen(false),
      });
    },
    [createEmployee],
  );

  const handleArchive = React.useCallback(() => {
    if (!archiveTarget) return;
    archiveEmployee.mutate(archiveTarget.id, { onSuccess: () => setArchiveTarget(null) });
  }, [archiveTarget, archiveEmployee]);

  const canManage = hasPermission(PermissionCode.EMPLOYEE_MANAGE);

  if (isLoading) {
    return (
      <ListPageShell
        toolbar={
          <>
            <Skeleton height={32} width={280} radius="md" />
            <Skeleton height={32} width={160} radius="md" />
          </>
        }
      >
        <Stack gap="xs" p="md">
          {Array.from({ length: 6 }).map((_, i) => (
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
          <Alert color="red" title="Не удалось загрузить сотрудников">
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
          <ViewModeToggle value={view} onChange={setView} />
          <Group gap={8} wrap="nowrap">
            {!showArchived && hasPermission(PermissionCode.EMPLOYEE_CREATE) && (
              <Button
                color="sage.7"
                rightSection={<PlusIcon size={16} />}
                size="sm"
                onClick={() => setFormOpen(true)}
              >
                Добавить сотрудника
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
      {view === 'cards' ? (
        <Box className={styles.cardsArea}>
          {paginatedItems.length === 0 ? (
            <Text size="sm" c="dimmed" ta="center" py="xl">
              Сотрудники не найдены
            </Text>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
              {paginatedItems.map((employee) => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  specializationName={
                    employee.specialization_id != null
                      ? (specializationMap.get(employee.specialization_id) ?? null)
                      : null
                  }
                  showArchived={showArchived}
                  canManage={canManage}
                  onOpen={openProfile}
                  onDelete={setArchiveTarget}
                  onRestore={(e) => restoreEmployee.mutate(e.id)}
                />
              ))}
            </SimpleGrid>
          )}
        </Box>
      ) : (
        <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className={listPageStyles.headCell}>Сотрудник</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Специализация</Table.Th>
              <Table.Th className={listPageStyles.headCell} w={120}>
                Услуги
              </Table.Th>
              <Table.Th className={listPageStyles.headCell} w={180}>
                Ставка
              </Table.Th>
              <Table.Th className={listPageStyles.headCell} w={120}>
                Статус
              </Table.Th>
              <Table.Th className={listPageStyles.headCell} w={48} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedItems.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text size="sm" c="dimmed" ta="center" py="xl">
                    Сотрудники не найдены
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              paginatedItems.map((employee) => {
                const specializationName =
                  employee.specialization_id != null
                    ? (specializationMap.get(employee.specialization_id) ?? null)
                    : null;
                return (
                  <Table.Tr
                    key={employee.id}
                    className={`${listPageStyles.row} ${listPageStyles.rowClickable}`}
                    onClick={() => openProfile(employee)}
                  >
                    <Table.Td className={listPageStyles.bodyCell}>
                      <Group gap={8} wrap="nowrap">
                        <Avatar radius="md" size={32} color="sage">
                          {getEmployeeInitials(employee)}
                        </Avatar>
                        <Box>
                          <Text size="sm" fw={400} c="#484848">
                            {getEmployeeFullName(employee)}
                          </Text>
                          <Text size="xs" c="rgba(72,72,72,0.4)">
                            {employee.phone ?? '—'}
                          </Text>
                        </Box>
                      </Group>
                    </Table.Td>
                    <Table.Td className={listPageStyles.bodyCell}>
                      <Text size="sm" c="rgba(72,72,72,0.4)">
                        {specializationName ?? '—'}
                      </Text>
                    </Table.Td>
                    <Table.Td className={listPageStyles.bodyCell}>
                      <Text size="sm" c="rgba(72,72,72,0.4)">
                        {employee.services?.length ?? 0}
                      </Text>
                    </Table.Td>
                    <Table.Td className={listPageStyles.bodyCell}>
                      <Text size="sm" fw={600} c="#484848">
                        {employee.salary_fixed > 0 ? formatPrice(employee.salary_fixed) : '—'}
                      </Text>
                    </Table.Td>
                    <Table.Td className={listPageStyles.bodyCell}>
                      <Badge color={employee.active ? 'green' : 'gray'} variant="light" size="sm">
                        {employee.active ? 'Активен' : 'Неактивен'}
                      </Badge>
                    </Table.Td>
                    <Table.Td className={listPageStyles.bodyCell}>
                      {canManage && (
                        showArchived ? (
                          <ActionIcon
                            variant="subtle"
                            color="gray"
                            size="sm"
                            aria-label="Восстановить"
                            onClick={(e) => {
                              e.stopPropagation();
                              restoreEmployee.mutate(employee.id);
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
                              setArchiveTarget(employee);
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
      )}

      <EmployeeFormModal
        opened={formOpen}
        employee={null}
        loading={createEmployee.isPending}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
      />

      <ConfirmModal
        opened={Boolean(archiveTarget)}
        title="Архивировать сотрудника"
        message={`Архивировать ${archiveTarget ? getEmployeeFullName(archiveTarget) : ''}? Сотрудник будет скрыт из списка.`}
        loading={archiveEmployee.isPending}
        onConfirm={handleArchive}
        onClose={() => setArchiveTarget(null)}
      />
    </ListPageShell>
  );
};
