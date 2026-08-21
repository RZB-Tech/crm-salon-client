import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useArchiveEmployee,
  useCreateEmployee,
  useEmployees,
  useRestoreEmployee,
} from '@/shared/api/hooks/useEmployees';
import { useSpecializations } from '@/shared/api/hooks/useSpecializations';
import type { Employee, EmployeeCreatePayload, EmployeeUpdatePayload } from '@/shared/api/types';
import type { ListViewMode } from '@/shared/ui';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { useResolvedById } from '@/shared/lib/hooks/useResolvedById';
import { useTableSort } from '@/shared/lib/hooks/useTableSort';
import { getEmployeeFullName } from '@/shared/lib/format';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { readStoredView, VIEW_STORAGE_KEY } from '../lib/viewMode';

export function useEmployeesPage() {
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
    for (const item of specializations ?? []) map.set(item.id, item.name);
    return map;
  }, [specializations]);

  const getters = React.useMemo(
    () => ({
      name: (employee: Employee) => getEmployeeFullName(employee),
      spec: (employee: Employee) =>
        employee.specialization_id != null
          ? (specializationMap.get(employee.specialization_id) ?? '')
          : '',
      salary: (employee: Employee) => employee.salary_fixed,
      status: (employee: Employee) => Number(employee.active),
    }),
    [specializationMap],
  );

  const { sort, sortedItems, toggleSort } = useTableSort(employees ?? [], getters, {
    key: 'name',
    dir: 'asc',
  });
  const pagination = usePagination(sortedItems, { defaultPageSize: 20 });

  React.useEffect(() => pagination.resetPage(), [showArchived, sort.key, sort.dir, pagination.resetPage]);
  React.useEffect(() => {
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, view);
    } catch {
      /* ignore */
    }
  }, [view]);

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

  return {
    canCreate: hasPermission(PermissionCode.EMPLOYEE_CREATE),
    canManage: hasPermission(PermissionCode.EMPLOYEE_MANAGE),
    isLoading,
    isError,
    formOpen,
    setFormOpen,
    view,
    setView,
    showArchived,
    setShowArchived,
    pagination,
    sort,
    toggleSort,
    paginatedItems: pagination.paginatedItems,
    specializationMap,
    openProfile: (employee: Employee) => navigate(`/employees/${employee.id}`),
    handleCreate,
    handleArchive,
    archiveTarget,
    archiveEmployee,
    createEmployee,
    restoreEmployee,
    setArchiveTargetId,
  };
}
