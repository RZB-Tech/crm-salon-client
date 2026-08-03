import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetchAllPost, apiPost, apiRequest } from '@/shared/api/client';
import { invalidatePaymentFlow } from '@/shared/api/invalidate';
import { queryKeys } from '@/shared/api/query-keys';
import type { Appointment, Receipt, ReceiptCreatePayload } from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

const upsertAppointmentReceipt = (queryClient: ReturnType<typeof useQueryClient>, receipt: Receipt) => {
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

export const useReceipts = () =>
  useQuery({
    queryKey: queryKeys.receipts.all,
    queryFn: () => apiFetchAllPost<Receipt>('/api/v1/receipts'),
  });

export const useReceipt = (id: number) =>
  useQuery({
    queryKey: queryKeys.receipts.detail(id),
    queryFn: () => apiRequest<Receipt>(`/api/v1/receipts/${id}`),
    enabled: id > 0,
  });

export const useCreateReceipt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReceiptCreatePayload) =>
      apiPost<Receipt, ReceiptCreatePayload>('/api/v1/receipts', payload),
    onSuccess: async (result) => {
      upsertAppointmentReceipt(queryClient, result);
      if (result.id) {
        queryClient.setQueryData(queryKeys.receipts.detail(result.id), result);
      }
      await invalidatePaymentFlow(queryClient, result.appointment_id);
      addNotification.success({ message: 'Чек создан' });
    },
  });
};

export const useCancelReceipt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiPost<Receipt, Record<string, never>>(`/api/v1/receipts/cancel?id=${id}`, {}),
    onSuccess: async (result) => {
      upsertAppointmentReceipt(queryClient, result);
      if (result.appointment_id) {
        queryClient.setQueryData<Appointment>(
          queryKeys.appointments.detail(result.appointment_id),
          (prev) => (prev ? { ...prev, paid: false } : prev),
        );
        queryClient.setQueriesData<Appointment[]>(
          { queryKey: queryKeys.appointments.all },
          (list) =>
            list?.map((item) =>
              item.id === result.appointment_id ? { ...item, paid: false } : item,
            ) ?? list,
        );
      }
      await invalidatePaymentFlow(queryClient, result.appointment_id);
      addNotification.success({ message: 'Чек отменён' });
    },
  });
};
