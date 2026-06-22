import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetchAllPost, apiPost } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { Receipt, ReceiptCreatePayload } from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const useReceipts = () =>
  useQuery({
    queryKey: queryKeys.receipts.all,
    queryFn: () => apiFetchAllPost<Receipt>('/api/v1/receipts'),
  });

export const useCreateReceipt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReceiptCreatePayload) =>
      apiPost<Receipt, ReceiptCreatePayload>('/api/v1/receipts', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.receipts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      addNotification.success({ message: 'Чек создан' });
    },
  });
};

export const useCancelReceipt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiPost<Receipt, Record<string, never>>(`/api/v1/receipts/cancel?id=${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.receipts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      addNotification.success({ message: 'Чек отменён' });
    },
  });
};
