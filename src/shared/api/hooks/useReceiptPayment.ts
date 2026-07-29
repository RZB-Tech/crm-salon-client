import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiPost } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { Receipt, ReceiptPaymentPayload } from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const useMakeReceiptPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReceiptPaymentPayload) =>
      apiPost<Receipt, ReceiptPaymentPayload>('/api/v1/receipts/make_payment', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.receipts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      addNotification.success({ message: 'Оплата проведена' });
    },
  });
};
