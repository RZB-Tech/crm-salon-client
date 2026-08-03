import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetchAllPost, apiPost, apiRequest } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { Payout, PayoutCreatePayload } from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const usePayouts = () =>
  useQuery({
    queryKey: queryKeys.payouts.all,
    queryFn: () => apiFetchAllPost<Payout>('/api/v1/payouts'),
  });

export const usePayout = (id: number) =>
  useQuery({
    queryKey: queryKeys.payouts.detail(id),
    queryFn: () => apiRequest<Payout>(`/api/v1/payouts/${id}`),
    enabled: id > 0,
  });

export const useCreatePayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PayoutCreatePayload) =>
      apiPost<Payout, PayoutCreatePayload>('/api/v1/payouts', payload),
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.payouts.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.payrolls.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
      if (result.employee_id) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.employees.payrolls(result.employee_id),
        });
      }
      addNotification.success({ message: 'Выплата проведена' });
    },
    onError: (error: Error) => {
      addNotification.error({ message: error.message || 'Не удалось создать выплату' });
    },
  });
};
