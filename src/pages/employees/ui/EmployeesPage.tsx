import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Group,
  Text,
  Badge,
  Avatar,
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
import type { CreateEmployeePayload, Employee, PatchedEmployee, SalaryPayment } from '@/shared/api/types';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import {
  ensureArray,
  formatPrice,
  getEmployeeColor,
  getEmployeeFullName,
  getEmployeeInitials,
  PAYMENT_TYPE_LABELS,
} from '@/shared/lib/format';
import { EmployeeFormModal } from './EmployeeFormModal';
import styles from './employees-page.module.css';

interface EmployeeCardProps {
  employee: Employee;
  onOpen: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onOpen, onDelete }) => {
  const color = getEmployeeColor(employee.id);
  const salaryPayments = ensureArray<SalaryPayment>(employee.salaryPayments);
  const services = ensureArray<number>(employee.services);
  const schedules = ensureArray(employee.schedules);
  const paymentsTotal = salaryPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

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
          <Avatar size={52} radius="md" style={{ backgroundColor: color }}>
            <Text fw={700} c="white">{getEmployeeInitials(employee)}</Text>
          </Avatar>
          <div>
            <Text fw={700} size="md">{getEmployeeFullName(employee)}</Text>
            <Text size="sm" c="dimmed">{employee.phone ?? employee.email ?? '—'}</Text>
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
        <Badge size="xs" variant="light" color="gray">Услуг: {services.length}</Badge>
        <Badge size="xs" variant="light" color="gray">Смен: {schedules.length}</Badge>
        {employee.salary_fixed && <Badge size="xs" variant="light" color="blue">Фикс: {formatPrice(employee.salary_fixed)}</Badge>}
      </Group>

      <Divider mb="md" />

      <Text size="xs" c="dimmed" mb={4}>Выплат: {salaryPayments.length} · {formatPrice(paymentsTotal)}</Text>
      {salaryPayments.length > 0 && (
        <Group gap={6}>
          {salaryPayments.slice(0, 3).map((payment) => (
            <Badge key={payment.id} size="xs" variant="light" color="gray">
              {PAYMENT_TYPE_LABELS[payment.paymentType] ?? payment.paymentType}: {formatPrice(payment.amount)}
            </Badge>
          ))}
        </Group>
      )}
    </Card>
  );
};

export const EmployeesPage: React.FC = () => {
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<Employee | null>(null);

  const { data: employees, isLoading, isError } = useEmployees();
  const createEmployee = useCreateEmployee();
  const deleteEmployee = useDeleteEmployee();

  const openProfile = React.useCallback(
    (employee: Employee) => navigate(`/employees/${employee.id}`),
    [navigate],
  );

  const handleCreate = React.useCallback(
    (payload: CreateEmployeePayload | PatchedEmployee) => {
      createEmployee.mutate(payload as CreateEmployeePayload, { onSuccess: () => setFormOpen(false) });
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
