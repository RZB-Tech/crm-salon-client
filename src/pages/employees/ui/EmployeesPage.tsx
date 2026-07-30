import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Group,
  Text,
  Badge,
  Card,
  SimpleGrid,
  Skeleton,
  Alert,
  Divider,
  Button,
  ActionIcon,
  Menu,
  Tooltip,
} from '@mantine/core';
import { PlusIcon, DotsThreeIcon, ArchiveIcon, ArrowRightIcon, ArrowCounterClockwiseIcon } from '@phosphor-icons/react';
import {
  useCreateEmployee,
  useArchiveEmployee,
  useEmployees,
  useRestoreEmployee,
} from '@/shared/api/hooks/useEmployees';
import { useSpecializations } from '@/shared/api/hooks/useSpecializations';
import type { EmployeeCreatePayload, Employee, EmployeeUpdatePayload } from '@/shared/api/types';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';

import {
  formatPrice,
  getEmployeeFullName,
  getEmployeeInitials,
} from '@/shared/lib/format';
import { EmployeeFormModal } from './modals/EmployeeFormModal';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import styles from './employees-page.module.css';

interface EmployeeCardProps {
  employee: Employee;
  specializationName: string | null;
  showArchived: boolean;
  canManage: boolean;
  onOpen: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onRestore: (employee: Employee) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, specializationName, showArchived, canManage, onOpen, onDelete, onRestore }) => {
  const servicesCount = employee.services?.length ?? 0;

  return (
    <Card
      padding="lg"
      radius="lg"
      shadow="xs"
      className={styles.card}
      onClick={() => onOpen(employee)}
      role="button"
      tabIndex={0}
    >
      <Group justify="space-between" align="flex-start" mb="md">
        <Group gap={12}>
          <Avatar radius="md" size="lg" color="sage">
            {getEmployeeInitials(employee)}
          </Avatar>
          <Box>
            <Text fw={700} size="md">{getEmployeeFullName(employee)}</Text>
            <Text size="sm" c="dimmed">{specializationName ?? employee.phone ?? '—'}</Text>
          </Box>
        </Group>
        <Group gap={6}>
          <Badge color={employee.active ? 'green' : 'gray'} variant="light" size="sm">{employee.active ? 'Активен' : 'Неактивен'}</Badge>
          <Menu shadow="sm" width={180} radius="md">
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                onClick={(e) => e.stopPropagation()}
              >
                <DotsThreeIcon size={16} weight="bold" />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<ArrowRightIcon size={14} />} onClick={(e) => { e.stopPropagation(); onOpen(employee); }}>
                Открыть профиль
              </Menu.Item>
              {showArchived ? (
                canManage && (
                  <Menu.Item leftSection={<ArrowCounterClockwiseIcon size={14} />} onClick={(e) => { e.stopPropagation(); onRestore(employee); }}>
                    Восстановить
                  </Menu.Item>
                )
              ) : (
                canManage && (
                  <Menu.Item leftSection={<ArchiveIcon size={14} />} color="orange" onClick={(e) => { e.stopPropagation(); onDelete(employee); }}>
                    Архивировать
                  </Menu.Item>
                )
              )}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>

      <Group gap={6} mb="md">
        <Badge size="xs" variant="light" color="gray">Услуг: {servicesCount}</Badge>
        {employee.salary_fixed > 0 && <Badge size="xs" variant="light" color="sage">Фикс: {formatPrice(employee.salary_fixed)}</Badge>}
        {employee.percent_from_services > 0 && <Badge size="xs" variant="light" color="teal">% услуг: {employee.percent_from_services}</Badge>}
      </Group>

      <Divider mb="md" />
      <Text size="xs" c="dimmed">Дата рождения: {employee.birth_date}</Text>
    </Card>
  );
};

export const EmployeesPage: React.FC = () => {
  const { hasPermission } = useAccess();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = React.useState(false);
  const [archiveTarget, setArchiveTarget] = React.useState<Employee | null>(null);
  const [showArchived, setShowArchived] = React.useState(false);

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

  const openProfile = React.useCallback(
    (employee: Employee) => navigate(`/employees/${employee.id}`),
    [navigate],
  );

  const handleCreate = React.useCallback(
    (payload: EmployeeCreatePayload | EmployeeUpdatePayload) => {
      createEmployee.mutate(payload as EmployeeCreatePayload, { onSuccess: () => setFormOpen(false) });
    },
    [createEmployee],
  );

  const handleArchive = React.useCallback(() => {
    if (!archiveTarget) return;
    archiveEmployee.mutate(archiveTarget.id, { onSuccess: () => setArchiveTarget(null) });
  }, [archiveTarget, archiveEmployee]);

  if (isLoading) {
    return (
      <Box className={styles.page}>
        <Skeleton height={48} mb="md" />
        <SimpleGrid cols={2} spacing="md">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={280} radius="lg" />)}</SimpleGrid>
      </Box>
    );
  }

  if (isError) {
    return <Box className={styles.page}><Alert color="red" title="Не удалось загрузить сотрудников">Проверьте доступность API</Alert></Box>;
  }

  const list = employees ?? [];

  return (
    <Box className={styles.page}>
      <Box className={styles.pageHeader}>
        <Box>
          <Text size="xl" fw={700}>Сотрудники</Text>
          <Text size="sm" c="dimmed" mt={2}>{list.length} {showArchived ? 'в архиве' : 'в системе'}</Text>
        </Box>
        <Group gap={8}>
          <Tooltip label={showArchived ? 'Показать активных' : 'Показать архив'}>
            <ActionIcon
              variant={showArchived ? 'filled' : 'subtle'}
              color={showArchived ? 'orange' : 'gray'}
              size="lg"
              onClick={() => setShowArchived((v) => !v)}
              aria-label="Переключить архив"
            >
              <ArchiveIcon size={20} />
            </ActionIcon>
          </Tooltip>
          {!showArchived && hasPermission(PermissionCode.EMPLOYEE_CREATE) && (
            <Button leftSection={<PlusIcon size={16} />} onClick={() => setFormOpen(true)}>Добавить сотрудника</Button>
          )}
        </Group>
      </Box>

      {list.length === 0 ? (
        <Text c="dimmed">Сотрудники не найдены</Text>
      ) : (
        <SimpleGrid cols={2} spacing="md">
          {list.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              specializationName={employee.specialization_id != null ? specializationMap.get(employee.specialization_id) ?? null : null}
              showArchived={showArchived}
              canManage={hasPermission(PermissionCode.EMPLOYEE_MANAGE)}
              onOpen={openProfile}
              onDelete={setArchiveTarget}
              onRestore={(e) => restoreEmployee.mutate(e.id)}
            />
          ))}
        </SimpleGrid>
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
    </Box>
  );
};
