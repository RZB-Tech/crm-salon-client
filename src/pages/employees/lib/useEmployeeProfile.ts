import React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useArchiveEmployee, useEmployee, useUpdateEmployee } from '@/shared/api/hooks/useEmployees';
import { useResetPassword } from '@/shared/api/hooks/useAuth';
import type { EmployeeCreatePayload, EmployeeUpdatePayload } from '@/shared/api/types';
import { isTabValue, type TabValue } from './profileTabs';

export function useEmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [editOpen, setEditOpen] = React.useState(false);
  const [archiveOpen, setArchiveOpen] = React.useState(false);
  const [resetPasswordResult, setResetPasswordResult] = React.useState<string | null>(null);

  const employeeId = Number(id);
  const query = useEmployee(employeeId);
  const updateEmployee = useUpdateEmployee();
  const archiveEmployee = useArchiveEmployee();
  const resetPassword = useResetPassword();

  React.useEffect(() => () => setResetPasswordResult(null), [employeeId]);

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

  return {
    id,
    employeeId,
    employee: query.data,
    isLoading: query.isLoading || (query.isFetching && !query.data),
    isError: query.isError,
    activeTab,
    handleTabChange,
    editOpen,
    setEditOpen,
    archiveOpen,
    setArchiveOpen,
    resetPasswordResult,
    setResetPasswordResult,
    updateEmployee,
    archiveEmployee,
    resetPassword,
    handleSubmit,
    handleArchive,
    handleResetPassword,
    goBack: () => navigate('/employees'),
  };
}
