import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetchAllPost, apiPost, apiRequest } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { Payment, PaymentCreatePayload, Receipt } from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const usePayments = () =>
  useQuery({
    queryKey: queryKeys.payments.all,
    queryFn: () => apiFetchAllPost<Payment>('/api/v1/payments'),
  });

export const usePayment = (id: number) =>
  useQuery({
    queryKey: queryKeys.payments.detail(id),
    queryFn: () => apiRequest<Payment>(`/api/v1/payments/${id}`),
    enabled: id > 0,
  });

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PaymentCreatePayload) =>
      apiPost<Receipt, PaymentCreatePayload>('/api/v1/payments', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.receipts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      addNotification.success({ message: 'Оплата проведена' });
    },
  });
};
