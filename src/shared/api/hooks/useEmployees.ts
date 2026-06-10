import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiListRequestAll, apiPatch, apiPost, apiRequest } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  CreateEmployeePayload,
  Employee,
  FinanceReport,
  PatchedEmployee,
  SalaryPayment,
  WorkSchedule,
} from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const useEmployees = () =>
  useQuery({
    queryKey: queryKeys.employees.all,
    queryFn: () => apiListRequestAll<Employee>('/api/v1/employees'),
  });

export const useEmployee = (id: number) =>
  useQuery({
    queryKey: queryKeys.employees.detail(id),
    queryFn: () => apiRequest<Employee>(`/api/v1/employees/${id}`),
    enabled: id > 0,
  });

export const useEmployeePayments = (id: number) =>
  useQuery({
    queryKey: queryKeys.employees.payments(id),
    queryFn: () => apiListRequestAll<SalaryPayment>(`/api/v1/employees/${id}/payments`),
    enabled: id > 0,
  });

export const useEmployeeSchedules = (id: number) =>
  useQuery({
    queryKey: queryKeys.employees.schedules(id),
    queryFn: () => apiListRequestAll<WorkSchedule>(`/api/v1/employees/${id}/schedules`),
    enabled: id > 0,
  });

export const useEmployeeFinanceReport = (id: number, dateFrom?: string, dateTo?: string) =>
  useQuery({
    queryKey: queryKeys.employees.financeReport(id, dateFrom, dateTo),
    queryFn: () => {
      const params = new URLSearchParams();
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      const query = params.toString();
      return apiRequest<FinanceReport>(
        `/api/v1/employees/${id}/finance-report${query ? `?${query}` : ''}`,
      );
    },
    enabled: id > 0,
  });

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) =>
      apiPost<Employee, CreateEmployeePayload>('/api/v1/employees', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
      addNotification.success({ message: 'Сотрудник создан' });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PatchedEmployee }) =>
      apiPatch<Employee, PatchedEmployee>(`/api/v1/employees/${id}`, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.detail(id) });
      addNotification.success({ message: 'Сотрудник обновлён' });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete(`/api/v1/employees/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
      addNotification.success({ message: 'Сотрудник удалён' });
    },
  });
};
