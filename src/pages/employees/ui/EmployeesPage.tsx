import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
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
} from '@mantine/core';
import { Plus, DotsThree, Trash, ArrowRight } from '@phosphor-icons/react';
import {
  useCreateEmployee,
  useDeleteEmployee,
  useEmployees,
} from '@/shared/api/hooks/useEmployees';
import { useSpecializations } from '@/shared/api/hooks/useSpecializations';
import type { EmployeeCreatePayload, Employee, EmployeeUpdatePayload } from '@/shared/api/types';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { PersonAvatar } from '@/shared/ui/PersonAvatar';
import {
  formatPrice,
  getEmployeeFullName,
  getEmployeeInitials,
} from '@/shared/lib/format';
import { EmployeeFormModal } from './EmployeeFormModal';
import styles from './employees-page.module.css';

interface EmployeeCardProps {
  employee: Employee;
  specializationName: string | null;
  onOpen: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, specializationName, onOpen, onDelete }) => {
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
          <PersonAvatar
            seed={employee.id}
            initials={getEmployeeInitials(employee)}
            size="lg"
          />
          <div>
            <Text fw={700} size="md">{getEmployeeFullName(employee)}</Text>
            <Text size="sm" c="dimmed">{specializationName ?? employee.phone ?? '—'}</Text>
          </div>
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
                <DotsThree size={16} weight="bold" />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<ArrowRight size={14} />} onClick={(e) => { e.stopPropagation(); onOpen(employee); }}>
                Открыть профиль
              </Menu.Item>
              <Menu.Item leftSection={<Trash size={14} />} color="red" onClick={(e) => { e.stopPropagation(); onDelete(employee); }}>
                Удалить
              </Menu.Item>
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
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<Employee | null>(null);

  const { data: employees, isLoading, isError } = useEmployees();
  const { data: specializations } = useSpecializations();
  const createEmployee = useCreateEmployee();
  const deleteEmployee = useDeleteEmployee();

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

  const handleDelete = React.useCallback(() => {
    if (!deleteTarget) return;
    deleteEmployee.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  }, [deleteTarget, deleteEmployee]);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Skeleton height={48} mb="md" />
        <SimpleGrid cols={2} spacing="md">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={280} radius="lg" />)}</SimpleGrid>
      </div>
    );
  }

  if (isError) {
    return <div className={styles.page}><Alert color="red" title="Не удалось загрузить сотрудников">Проверьте доступность API</Alert></div>;
  }

  const list = employees ?? [];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <Text size="xl" fw={700}>Сотрудники</Text>
          <Text size="sm" c="dimmed" mt={2}>{list.length} в системе</Text>
        </div>
        <Button leftSection={<Plus size={16} />} onClick={() => setFormOpen(true)}>Добавить сотрудника</Button>
      </div>

      {list.length === 0 ? (
        <Text c="dimmed">Сотрудники не найдены</Text>
      ) : (
        <SimpleGrid cols={2} spacing="md">
          {list.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              specializationName={employee.specialization_id != null ? specializationMap.get(employee.specialization_id) ?? null : null}
              onOpen={openProfile}
              onDelete={setDeleteTarget}
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
        opened={Boolean(deleteTarget)}
        title="Удалить сотрудника"
        message={`Удалить ${deleteTarget ? getEmployeeFullName(deleteTarget) : ''}?`}
        loading={deleteEmployee.isPending}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
