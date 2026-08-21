import React from 'react';
import { Alert, Box, Button, Group, Skeleton, Stack } from '@mantine/core';
import { PlusIcon } from '@phosphor-icons/react';
import {
  ArchiveToggle,
  ConfirmModal,
  ListPageShell,
  ListPaginationFooter,
  ViewModeToggle,
} from '@/shared/ui';
import { getEmployeeFullName } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { useEmployeesPage } from '../lib/useEmployeesPage';
import { EmployeesListBody } from './EmployeesListBody';
import { EmployeeFormModal } from './modals/EmployeeFormModal';

export const EmployeesPage: React.FC = () => {
  const { t } = useI18n();
  const page = useEmployeesPage();

  if (page.isLoading) {
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

  if (page.isError) {
    return (
      <ListPageShell>
        <Box p="xl">
          <Alert color="red" title={t('employees.loadError')}>
            {t('common.checkApi')}
          </Alert>
        </Box>
      </ListPageShell>
    );
  }

  return (
    <ListPageShell
      toolbar={
        <>
          <ViewModeToggle value={page.view} onChange={page.setView} />
          <Group gap={8} wrap="nowrap">
            {!page.showArchived && page.canCreate && (
              <Button
                color="sage.7"
                rightSection={<PlusIcon size={16} />}
                size="sm"
                onClick={() => page.setFormOpen(true)}
              >
                {t('employees.add')}
              </Button>
            )}
            <ArchiveToggle active={page.showArchived} onChange={page.setShowArchived} />
          </Group>
        </>
      }
      footer={
        <ListPaginationFooter
          page={page.pagination.page}
          pageSize={page.pagination.pageSize}
          total={page.pagination.total}
          onPageChange={page.pagination.setPage}
          onPageSizeChange={page.pagination.setPageSize}
        />
      }
    >
      <EmployeesListBody
        view={page.view}
        employees={page.paginatedItems}
        specializationMap={page.specializationMap}
        sort={page.sort}
        onSort={page.toggleSort}
        showArchived={page.showArchived}
        canManage={page.canManage}
        onOpen={page.openProfile}
        onArchive={page.setArchiveTargetId}
        onRestore={(id) => page.restoreEmployee.mutate(id)}
      />

      <EmployeeFormModal
        opened={page.formOpen}
        employee={null}
        loading={page.createEmployee.isPending}
        onClose={() => page.setFormOpen(false)}
        onSubmit={page.handleCreate}
      />

      <ConfirmModal
        opened={Boolean(page.archiveTarget)}
        title={t('employees.archiveTitle')}
        message={t('employees.archiveMessage', {
          name: page.archiveTarget ? getEmployeeFullName(page.archiveTarget) : '',
        })}
        loading={page.archiveEmployee.isPending}
        onConfirm={page.handleArchive}
        onClose={() => page.setArchiveTargetId(null)}
      />
    </ListPageShell>
  );
};
