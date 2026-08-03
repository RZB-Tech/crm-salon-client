import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiPost } from '@/shared/api/client';
import { invalidatePaymentFlow } from '@/shared/api/invalidate';
import { queryKeys } from '@/shared/api/query-keys';
import type { Appointment, PaymentCreatePayload, Receipt } from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

const patchAppointmentPaid = (
  queryClient: ReturnType<typeof useQueryClient>,
  appointmentId: number,
  paid: boolean,
) => {
  queryClient.setQueryData<Appointment>(
    queryKeys.appointments.detail(appointmentId),
    (prev) => (prev ? { ...prev, paid } : prev),
  );

  queryClient.setQueriesData<Appointment[]>(
    { queryKey: queryKeys.appointments.all },
    (list) =>
      list?.map((item) => (item.id === appointmentId ? { ...item, paid } : item)) ?? list,
  );
};

const upsertAppointmentReceipt = (
  queryClient: ReturnType<typeof useQueryClient>,
  receipt: Receipt,
) => {
  if (!receipt.appointment_id) return;
  const key = [...queryKeys.appointments.detail(receipt.appointment_id), 'receipts'] as const;
  queryClient.setQueryData<Receipt[]>(key, (prev) => {
    const list = prev ?? [];
    const index = list.findIndex((item) => item.id === receipt.id);
    if (index >= 0) {
      const next = [...list];
      next[index] = receipt;
      return next;
    }
    return [receipt, ...list];
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PaymentCreatePayload) =>
      apiPost<Receipt, PaymentCreatePayload>('/api/v1/receipts/make_payment', payload),
    onSuccess: async (result) => {
      upsertAppointmentReceipt(queryClient, result);
      if (result.appointment_id) {
        patchAppointmentPaid(queryClient, result.appointment_id, result.status === 'paid');
      }
      await invalidatePaymentFlow(queryClient, result.appointment_id);
      addNotification.success({ message: 'Оплата проведена' });
    },
    onError: (error: Error) => {
      addNotification.error({ message: error.message || 'Не удалось провести оплату' });
    },
  });
};
