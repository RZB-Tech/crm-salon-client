import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  apiDelete,
  apiFetchAllPost,
  apiPatch,
  apiPost,
  apiRequest,
} from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  Payroll,
  PayrollCreatePayload,
  PayrollUpdatePayload,
} from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const usePayrolls = () =>
  useQuery({
    queryKey: queryKeys.payrolls.all,
    queryFn: () => apiFetchAllPost<Payroll>('/api/v1/payrolls'),
  });

export const usePayroll = (id: number) =>
  useQuery({
    queryKey: queryKeys.payrolls.detail(id),
    queryFn: () => apiRequest<Payroll>(`/api/v1/payrolls/${id}`),
    enabled: id > 0,
  });

export const useCreatePayroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PayrollCreatePayload) =>
      apiPost<Payroll, PayrollCreatePayload>('/api/v1/payrolls', payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payrolls.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.employees.payrolls(payload.employee_id),
      });
      addNotification.success({ message: 'Выплата добавлена' });
    },
  });
};

export const useUpdatePayroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PayrollUpdatePayload) =>
      apiPatch<Payroll, PayrollUpdatePayload>('/api/v1/payrolls', payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payrolls.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.payrolls.detail(payload.id) });
      if (payload.employee_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.employees.payrolls(payload.employee_id),
        });
      }
      addNotification.success({ message: 'Выплата обновлена' });
    },
  });
};

export const useDeletePayroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete(`/api/v1/payrolls/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payrolls.all });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      addNotification.success({ message: 'Выплата удалена' });
    },
  });
};

export const useCancelPayroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiPost<Payroll, Record<string, never>>(`/api/v1/payrolls/cancel?id=${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payrolls.all });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      addNotification.success({ message: 'Начисление отменено' });
    },
  });
};
