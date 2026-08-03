import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiPost } from '@/shared/api/client';
import { invalidatePaymentFlow } from '@/shared/api/invalidate';
import { queryKeys } from '@/shared/api/query-keys';
import type { Appointment, Receipt, ReceiptPaymentPayload } from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

/** @deprecated Prefer useCreatePayment — kept for compatibility */
export const useMakeReceiptPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReceiptPaymentPayload) =>
      apiPost<Receipt, ReceiptPaymentPayload>('/api/v1/receipts/make_payment', payload),
    onSuccess: async (result) => {
      if (result.appointment_id) {
        const key = [...queryKeys.appointments.detail(result.appointment_id), 'receipts'] as const;
        queryClient.setQueryData<Receipt[]>(key, (prev) => {
          const list = prev ?? [];
          const index = list.findIndex((item) => item.id === result.id);
          if (index >= 0) {
            const next = [...list];
            next[index] = result;
            return next;
          }
          return [result, ...list];
        });
        queryClient.setQueryData<Appointment>(
          queryKeys.appointments.detail(result.appointment_id),
          (prev) => (prev ? { ...prev, paid: result.status === 'paid' } : prev),
        );
      }
      await invalidatePaymentFlow(queryClient, result.appointment_id);
      addNotification.success({ message: 'Оплата проведена' });
    },
  });
};
