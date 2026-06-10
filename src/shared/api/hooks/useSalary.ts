import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiListRequestAll, apiPatch, apiPost, apiRequest } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { CreateSalaryPayload, PatchedSalary, Salary } from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const useSalaryList = () =>
  useQuery({
    queryKey: queryKeys.salary.all,
    queryFn: () => apiListRequestAll<Salary>('/api/v1/salary'),
  });

export const useSalary = (id: number) =>
  useQuery({
    queryKey: queryKeys.salary.detail(id),
    queryFn: () => apiRequest<Salary>(`/api/v1/salary/${id}`),
    enabled: id > 0,
  });

export const useCreateSalary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSalaryPayload) =>
      apiPost<Salary, CreateSalaryPayload>('/api/v1/salary', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salary.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
      addNotification.success({ message: 'Выплата добавлена' });
    },
  });
};

export const useUpdateSalary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PatchedSalary }) =>
      apiPatch<Salary, PatchedSalary>(`/api/v1/salary/${id}`, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salary.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.salary.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
      addNotification.success({ message: 'Выплата обновлена' });
    },
  });
};

export const useDeleteSalary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete(`/api/v1/salary/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salary.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
      addNotification.success({ message: 'Выплата удалена' });
    },
  });
};
