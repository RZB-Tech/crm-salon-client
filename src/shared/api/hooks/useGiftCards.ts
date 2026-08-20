import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetchAllPost, apiPatch, apiPost, apiRequest } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  GiftCard,
  GiftCardCancelPayload,
  GiftCardCreatePayload,
  GiftCardUpdatePayload,
} from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const useGiftCards = (archived = false, enabled = true) =>
  useQuery({
    queryKey: [...queryKeys.giftCards.all, { archived }],
    queryFn: () => apiFetchAllPost<GiftCard>('/api/v1/gift-cards', { archived }),
    enabled,
  });

export const useGiftCard = (id: number) =>
  useQuery({
    queryKey: queryKeys.giftCards.detail(id),
    queryFn: () => apiRequest<GiftCard>(`/api/v1/gift-cards/${id}`),
    enabled: id > 0,
  });

export const useCreateGiftCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GiftCardCreatePayload) =>
      apiPost<GiftCard, GiftCardCreatePayload>('/api/v1/gift-cards', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.giftCards.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.receipts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      addNotification.success({ message: 'Купон создан' });
    },
  });
};

export const useUpdateGiftCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GiftCardUpdatePayload) =>
      apiPatch<GiftCard, GiftCardUpdatePayload>('/api/v1/gift-cards', payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.giftCards.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.giftCards.detail(payload.id) });
      addNotification.success({ message: 'Купон обновлён' });
    },
  });
};

export const useArchiveGiftCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiPatch<GiftCard, GiftCardUpdatePayload>('/api/v1/gift-cards', { id, archived: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.giftCards.all });
      addNotification.success({ message: 'Купон архивирован' });
    },
  });
};

export const useRestoreGiftCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiPatch<GiftCard, GiftCardUpdatePayload>('/api/v1/gift-cards', { id, archived: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.giftCards.all });
      addNotification.success({ message: 'Купон восстановлен' });
    },
  });
};

export const useCancelGiftCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GiftCardCancelPayload) =>
      apiPost<GiftCard, GiftCardCancelPayload>('/api/v1/gift-cards/cancel', payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.giftCards.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.giftCards.detail(payload.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      addNotification.success({ message: 'Купон отменён' });
    },
  });
};
