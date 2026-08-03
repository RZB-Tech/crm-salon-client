import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiPost } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { PaymentCreatePayload, Receipt } from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PaymentCreatePayload) =>
      apiPost<Receipt, PaymentCreatePayload>('/api/v1/receipts/make_payment', payload),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.receipts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      if (result.appointment_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.appointments.detail(result.appointment_id),
        });
      }
      addNotification.success({ message: 'Оплата проведена' });
    },
    onError: (error: Error) => {
      addNotification.error({ message: error.message || 'Не удалось провести оплату' });
    },
  });
};
