import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  apiDelete,
  apiFetchAllPost,
  apiGetPaginated,
  apiPatch,
  apiPost,
  apiRequest,
} from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  Appointment,
  Employee,
  EmployeeCreatePayload,
  EmployeeUpdatePayload,
  EmployeeWorkScheduleResponse,
  Payroll,
} from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const useEmployees = () =>
  useQuery({
    queryKey: queryKeys.employees.all,
    queryFn: () => apiFetchAllPost<Employee>('/api/v1/employees'),
  });

export const useEmployee = (id: number) =>
  useQuery({
    queryKey: queryKeys.employees.detail(id),
    queryFn: () => apiRequest<Employee>(`/api/v1/employees/${id}`),
    enabled: id > 0,
  });

export const useEmployeeWorkSchedules = (id: number) =>
  useQuery({
    queryKey: queryKeys.employees.workSchedules(id),
    queryFn: () =>
      apiRequest<EmployeeWorkScheduleResponse>(`/api/v1/employees/${id}/work-schedules`),
    enabled: id > 0,
  });

export const useEmployeePayrolls = (id: number) =>
  useQuery({
    queryKey: queryKeys.employees.payrolls(id),
    queryFn: async () => {
      const data = await apiGetPaginated<Payroll>(`/api/v1/employees/${id}/payrolls`, {
        page: 1,
        pageSize: 100,
      });
      return data.items;
    },
    enabled: id > 0,
  });

export const useEmployeeAppointments = (id: number) =>
  useQuery({
    queryKey: queryKeys.employees.appointments(id),
    queryFn: async () => {
      const data = await apiGetPaginated<Appointment>(`/api/v1/employees/${id}/appointments`, {
        page: 1,
        pageSize: 100,
      });
      return data.items;
    },
    enabled: id > 0,
  });

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EmployeeCreatePayload) =>
      apiPost<Employee, EmployeeCreatePayload>('/api/v1/employees', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
      addNotification.success({ message: 'Сотрудник создан' });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EmployeeUpdatePayload) =>
      apiPatch<Employee, EmployeeUpdatePayload>('/api/v1/employees', payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.detail(payload.id) });
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
