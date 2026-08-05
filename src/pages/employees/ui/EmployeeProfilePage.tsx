import React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Alert, Box, Button, ScrollArea, Skeleton, Tabs } from '@mantine/core';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import {
  useEmployee,
  useUpdateEmployee,
  useArchiveEmployee,
} from '@/shared/api/hooks/useEmployees';
import { useResetPassword } from '@/shared/api/hooks/useAuth';
import type { EmployeeCreatePayload, EmployeeUpdatePayload } from '@/shared/api/types';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { getEmployeeFullName } from '@/shared/lib/format';
import { isTabValue, type TabValue } from '../lib/profileTabs';
import { EmployeeProfileHeader } from './EmployeeProfileHeader';
import { EmployeeFormModal } from './modals/EmployeeFormModal';
import { OverviewTab } from './tabs/OverviewTab';
import { ScheduleTab } from './tabs/ScheduleTab';
import { PaymentsTab } from './tabs/PaymentsTab';
import { FinanceTab } from './tabs/FinanceTab';
import { ServicesTab } from './tabs/ServicesTab';
import styles from './employee-profile.module.css';

export const EmployeeProfilePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [editOpen, setEditOpen] = React.useState(false);
  const [archiveOpen, setArchiveOpen] = React.useState(false);
  const [resetPasswordResult, setResetPasswordResult] = React.useState<string | null>(null);

  const employeeId = Number(id);
  const { data: employee, isLoading, isFetching, isError } = useEmployee(employeeId);
  const updateEmployee = useUpdateEmployee();
  const archiveEmployee = useArchiveEmployee();
  const resetPassword = useResetPassword();

  React.useEffect(() => {
    return () => setResetPasswordResult(null);
  }, [employeeId]);

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
      onSuccess: (result) => setResetPasswordResult(result.new_password),
    });
  }, [resetPassword, employeeId]);

  if (!id || isNaN(employeeId) || employeeId <= 0) {
    return (
      <Box className={styles.page}>
        <Button
          variant="subtle"
          leftSection={<ArrowLeftIcon size={16} />}
          onClick={() => navigate('/employees')}
          w="fit-content"
        >
          К сотрудникам
        </Button>
        <Alert color="red" title="Некорректный ID">
          URL содержит невалидный идентификатор сотрудника.
        </Alert>
      </Box>
    );
  }

  if (isLoading || (isFetching && !employee)) {
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
        <Button
          variant="subtle"
          leftSection={<ArrowLeftIcon size={16} />}
          onClick={() => navigate('/employees')}
          w="fit-content"
        >
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
      <EmployeeProfileHeader
        employee={employee}
        resetPasswordResult={resetPasswordResult}
        resetPasswordPending={resetPassword.isPending}
        onBack={() => navigate('/employees')}
        onEdit={() => setEditOpen(true)}
        onResetPassword={handleResetPassword}
        onArchive={() => setArchiveOpen(true)}
        onDismissPasswordResult={() => setResetPasswordResult(null)}
      />

      <ScrollArea className={styles.pageBody} offsetScrollbars>
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
      </ScrollArea>

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
