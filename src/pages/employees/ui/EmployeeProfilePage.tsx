import React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Avatar,
  Card,
  Group,
  Text,
  Badge,
  Button,
  ActionIcon,
  Tabs,
  Skeleton,
  Alert,
  CopyButton,
  Tooltip,
  Box,
} from '@mantine/core';
import {
  ArchiveIcon,
  ArrowLeftIcon,
  CakeIcon,
  CheckIcon,
  CopyIcon,
  LockKeyIcon,
  PencilSimpleIcon,
  PhoneIcon,
} from '@phosphor-icons/react';
import {
  useEmployee,
  useUpdateEmployee,
  useArchiveEmployee,
} from '@/shared/api/hooks/useEmployees';
import { useResetPassword } from '@/shared/api/hooks/useAuth';
import type { EmployeeCreatePayload, EmployeeUpdatePayload } from '@/shared/api/types';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';

import { getEmployeeFullName, getEmployeeInitials } from '@/shared/lib/format';
import { EmployeeFormModal } from './modals/EmployeeFormModal';
import { OverviewTab } from './tabs/OverviewTab';
import { ScheduleTab } from './tabs/ScheduleTab';
import { PaymentsTab } from './tabs/PaymentsTab';
import { FinanceTab } from './tabs/FinanceTab';
import { ServicesTab } from './tabs/ServicesTab';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import styles from './employee-profile.module.css';

const TAB_VALUES = ['overview', 'schedule', 'payments', 'finance', 'services', 'audit'] as const;
type TabValue = (typeof TAB_VALUES)[number];

const isTabValue = (value: string | null): value is TabValue =>
  TAB_VALUES.includes(value as TabValue);

export const EmployeeProfilePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAccess();
  const [searchParams, setSearchParams] = useSearchParams();
  const [editOpen, setEditOpen] = React.useState(false);
  const [archiveOpen, setArchiveOpen] = React.useState(false);

  const employeeId = Number(id);
  const { data: employee, isLoading, isError } = useEmployee(employeeId);
  const updateEmployee = useUpdateEmployee();
  const archiveEmployee = useArchiveEmployee();
  const resetPassword = useResetPassword();

  const [resetPasswordResult, setResetPasswordResult] = React.useState<string | null>(null);

  const tabParam = searchParams.get('tab');
  const activeTab: TabValue = isTabValue(tabParam) ? tabParam : 'overview';

  const handleTabChange = React.useCallback(
    (value: string | null) => {
      setSearchParams({ tab: value ?? 'overview' }, { replace: true });
    },
    [setSearchParams],
  );

  const handleSubmit = React.useCallback(
    (payload: EmployeeCreatePayload | EmployeeUpdatePayload) => {
      updateEmployee.mutate(payload as EmployeeUpdatePayload, { onSuccess: () => setEditOpen(false) });
    },
    [updateEmployee],
  );

  const handleArchive = React.useCallback(() => {
    archiveEmployee.mutate(employeeId, { onSuccess: () => navigate('/employees') });
  }, [archiveEmployee, employeeId, navigate]);

  const handleResetPassword = React.useCallback(() => {
    resetPassword.mutate(employeeId, {
      onSuccess: (result) => {
        setResetPasswordResult(result.new_password);
      },
    });
  }, [resetPassword, employeeId]);

  if (isLoading) {
    return (
      <Box className={styles.page}>
        <Skeleton height={120} radius="lg" />
        <Skeleton height={400} radius="lg" />
      </Box>
    );
  }

  if (isError || !employee) {
    return (
      <Box className={styles.page}>
        <Button variant="subtle" leftSection={<ArrowLeftIcon size={16} />} onClick={() => navigate('/employees')} w="fit-content">
          К сотрудникам
        </Button>
        <Alert color="red" title="Сотрудник не найден">
          Проверьте доступность API или вернитесь к списку.
        </Alert>
      </Box>
    );
  }

  return (
    <Box className={styles.page}>
      <Box className={styles.pageTop}>
        <Button variant="subtle" color="gray" leftSection={<ArrowLeftIcon size={16} />} onClick={() => navigate('/employees')} w="fit-content">
          К сотрудникам
        </Button>

        <Card padding="md" radius="md" withBorder className={styles.headerCard}>
          <Box className={styles.headerLeft}>
            <Avatar radius="md" size={64} color="sage">
              {getEmployeeInitials(employee)}
            </Avatar>
            <Box>
              <Group gap={10}>
                <Text fw={700} size="xl">
                  {getEmployeeFullName(employee)}
                </Text>
                <Badge color={employee.active ? 'green' : 'gray'} variant="light" size="sm">
                  {employee.active ? 'Активен' : 'Неактивен'}
                </Badge>
              </Group>
              <Box className={styles.contactRow}>
                <Group gap={5}>
                  <PhoneIcon size={14} color="var(--mantine-color-gray-5)" />
                  <Text size="sm" c="dimmed">{employee.phone ?? '—'}</Text>
                </Group>
                <Group gap={5}>
                  <CakeIcon size={14} color="var(--mantine-color-gray-5)" />
                  <Text size="sm" c="dimmed">{employee.birth_date}</Text>
                </Group>
              </Box>
            </Box>
          </Box>

          <Group gap="sm">
            {hasPermission(PermissionCode.EMPLOYEE_UPDATE) && (
              <Button variant="light" leftSection={<PencilSimpleIcon size={16} />} onClick={() => setEditOpen(true)}>
                Редактировать
              </Button>
            )}
            {hasPermission(PermissionCode.EMPLOYEE_MANAGE) && (
              <>
                <Button
                  variant="light"
                  leftSection={<LockKeyIcon size={16} />}
                  onClick={handleResetPassword}
                  loading={resetPassword.isPending}
                >
                  Сбросить пароль
                </Button>
                <ActionIcon
                  variant="light"
                  color="orange"
                  size="lg"
                  aria-label="Архивировать"
                  onClick={() => setArchiveOpen(true)}
                >
                  <ArchiveIcon size={18} />
                </ActionIcon>
              </>
            )}
          </Group>
        </Card>

        {resetPasswordResult && (
          <Alert
            color="sage"
            title="Пароль сброшен"
            onClose={() => setResetPasswordResult(null)}
            withCloseButton
          >
            <Group gap="sm">
              <Text size="sm" fw={600}>
                Новый пароль: {resetPasswordResult}
              </Text>
              <CopyButton value={resetPasswordResult}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? 'Скопировано!' : 'Скопировать'} withArrow>
                    <ActionIcon
                      color={copied ? 'teal' : 'sage'}
                      variant="light"
                      onClick={copy}
                      size="sm"
                    >
                      {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>
            <Text size="xs" c="dimmed" mt="xs">
              Обязательно передайте этот пароль сотруднику
            </Text>
          </Alert>
        )}
      </Box>

      <Box className={styles.pageBody}>
        <Tabs value={activeTab} onChange={handleTabChange} radius="md" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="overview">Обзор</Tabs.Tab>
            <Tabs.Tab value="schedule">График</Tabs.Tab>
            <Tabs.Tab value="payments">Выплаты</Tabs.Tab>
            <Tabs.Tab value="finance">Финансы</Tabs.Tab>
            <Tabs.Tab value="services">Услуги</Tabs.Tab>
            <Tabs.Tab value="audit">История</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="overview" className={styles.tabPanel}>
            <OverviewTab employee={employee} />
          </Tabs.Panel>
          <Tabs.Panel value="schedule" className={styles.tabPanel}>
            <ScheduleTab employeeId={employee.id} />
          </Tabs.Panel>
          <Tabs.Panel value="payments" className={styles.tabPanel}>
            <PaymentsTab employeeId={employee.id} />
          </Tabs.Panel>
          <Tabs.Panel value="finance" className={styles.tabPanel}>
            <FinanceTab employeeId={employee.id} />
          </Tabs.Panel>
          <Tabs.Panel value="services" className={styles.tabPanel}>
            <ServicesTab employee={employee} />
          </Tabs.Panel>
          <Tabs.Panel value="audit" className={styles.tabPanel}>
            <AuditLogsPanel tableName="employees" recordId={employee.id} />
          </Tabs.Panel>
        </Tabs>
      </Box>

      <EmployeeFormModal
        opened={editOpen}
        employee={employee}
        loading={updateEmployee.isPending}
        onClose={() => setEditOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        opened={archiveOpen}
        title="Архивировать сотрудника"
        message={`Архивировать ${getEmployeeFullName(employee)}? Сотрудник будет скрыт из списка.`}
        loading={archiveEmployee.isPending}
        onConfirm={handleArchive}
        onClose={() => setArchiveOpen(false)}
      />
    </Box>
  );
};
