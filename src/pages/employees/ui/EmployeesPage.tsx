import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Group, Skeleton, Stack } from '@mantine/core';
import { PlusIcon } from '@phosphor-icons/react';
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
  ViewModeToggle,
  type ListViewMode,
} from '@/shared/ui';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { useResolvedById } from '@/shared/lib/hooks/useResolvedById';
import { getEmployeeFullName } from '@/shared/lib/format';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { readStoredView, VIEW_STORAGE_KEY } from '../lib/viewMode';
import { EmployeesListBody } from './EmployeesListBody';
import { EmployeeFormModal } from './modals/EmployeeFormModal';

export const EmployeesPage: React.FC = () => {
  const { hasPermission } = useAccess();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = React.useState(false);
  const [archiveTargetId, setArchiveTargetId] = React.useState<number | null>(null);
  const [showArchived, setShowArchived] = React.useState(false);
  const [view, setView] = React.useState<ListViewMode>(readStoredView);

  const { data: employees, isLoading, isError } = useEmployees(showArchived);
  const { data: specializations } = useSpecializations();
  const createEmployee = useCreateEmployee();
  const archiveEmployee = useArchiveEmployee();
  const restoreEmployee = useRestoreEmployee();
  const archiveTarget = useResolvedById(employees, archiveTargetId);

  const specializationMap = React.useMemo(() => {
    const map = new Map<number, string>();
    for (const s of specializations ?? []) map.set(s.id, s.name);
    return map;
  }, [specializations]);

  const { page, pageSize, paginatedItems, total, setPage, setPageSize, resetPage } = usePagination(
    employees ?? [],
    { defaultPageSize: 20 },
  );

  React.useEffect(() => resetPage(), [showArchived, resetPage]);
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
      createEmployee.mutate(payload as EmployeeCreatePayload, { onSuccess: () => setFormOpen(false) });
    },
    [createEmployee],
  );

  const handleArchive = React.useCallback(() => {
    if (!archiveTarget) return;
    archiveEmployee.mutate(archiveTarget.id, { onSuccess: () => setArchiveTargetId(null) });
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
      <EmployeesListBody
        view={view}
        employees={paginatedItems}
        specializationMap={specializationMap}
        showArchived={showArchived}
        canManage={canManage}
        onOpen={openProfile}
        onArchive={setArchiveTargetId}
        onRestore={(id) => restoreEmployee.mutate(id)}
      />

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
        onClose={() => setArchiveTargetId(null)}
      />
    </ListPageShell>
  );
};
