import React from 'react';
import { Alert, Box, Button, ScrollArea, Skeleton, Tabs } from '@mantine/core';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { getEmployeeFullName } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { useEmployeeProfile } from '../lib/useEmployeeProfile';
import { EmployeePasswordAlert } from './EmployeePasswordAlert';
import { EmployeeProfileHeader } from './EmployeeProfileHeader';
import { EmployeeFormModal } from './modals/EmployeeFormModal';
import { OverviewTab } from './tabs/OverviewTab';
import { ScheduleTab } from './tabs/ScheduleTab';
import { PaymentsTab } from './tabs/PaymentsTab';
import { FinanceTab } from './tabs/FinanceTab';
import { ServicesTab } from './tabs/ServicesTab';
import styles from './employee-profile.module.css';

export const EmployeeProfilePage: React.FC = () => {
  const { t } = useI18n();
  const page = useEmployeeProfile();

  if (!page.id || Number.isNaN(page.employeeId) || page.employeeId <= 0) {
    return (
      <Box className={styles.page}>
        <Button variant="subtle" leftSection={<ArrowLeftIcon size={16} />} onClick={page.goBack} w="fit-content">
          {t('employees.backToList')}
        </Button>
        <Alert color="red" title={t('employees.invalidId')}>
          {t('employees.invalidIdHint')}
        </Alert>
      </Box>
    );
  }

  if (page.isLoading) {
    return (
      <Box className={styles.page}>
        <Skeleton height={120} radius="lg" />
        <Skeleton height={400} radius="lg" />
      </Box>
    );
  }

  if (page.isError || !page.employee) {
    return (
      <Box className={styles.page}>
        <Button variant="subtle" leftSection={<ArrowLeftIcon size={16} />} onClick={page.goBack} w="fit-content">
          {t('employees.backToList')}
        </Button>
        <Alert color="red" title={t('employees.notFoundTitle')}>
          {t('employees.notFoundHint')}
        </Alert>
      </Box>
    );
  }

  const employee = page.employee;

  return (
    <Box className={styles.page}>
      <EmployeeProfileHeader
        employee={employee}
        resetPasswordPending={page.resetPassword.isPending}
        onBack={page.goBack}
        onEdit={() => page.setEditOpen(true)}
        onResetPassword={page.handleResetPassword}
        onArchive={() => page.setArchiveOpen(true)}
      />
      {page.resetPasswordResult && (
        <EmployeePasswordAlert
          password={page.resetPasswordResult}
          onClose={() => page.setResetPasswordResult(null)}
        />
      )}

      <ScrollArea className={styles.pageBody} offsetScrollbars>
        <Tabs value={page.activeTab} onChange={page.handleTabChange} radius="md" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="overview">{t('employees.overview')}</Tabs.Tab>
            <Tabs.Tab value="schedule">{t('employees.schedule')}</Tabs.Tab>
            <Tabs.Tab value="payments">{t('employees.payments')}</Tabs.Tab>
            <Tabs.Tab value="finance">{t('employees.finance')}</Tabs.Tab>
            <Tabs.Tab value="services">{t('employees.services')}</Tabs.Tab>
            <Tabs.Tab value="audit">{t('finance.history')}</Tabs.Tab>
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
        opened={page.editOpen}
        employee={employee}
        loading={page.updateEmployee.isPending}
        onClose={() => page.setEditOpen(false)}
        onSubmit={page.handleSubmit}
      />
      <ConfirmModal
        opened={page.archiveOpen}
        title={t('employees.archiveTitle')}
        message={t('employees.archiveMessage', { name: getEmployeeFullName(employee) })}
        loading={page.archiveEmployee.isPending}
        onConfirm={page.handleArchive}
        onClose={() => page.setArchiveOpen(false)}
      />
    </Box>
  );
};
