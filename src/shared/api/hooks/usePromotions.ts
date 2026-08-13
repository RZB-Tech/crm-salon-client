import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetchAllPost, apiPatch, apiPost, apiRequest } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  Promotion,
  PromotionCreatePayload,
  PromotionUpdatePayload,
} from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const usePromotions = (archived = false, enabled = true) =>
  useQuery({
    queryKey: [...queryKeys.promotions.all, { archived }],
    queryFn: () => apiFetchAllPost<Promotion>('/api/v1/promotions', { archived }),
    enabled,
  });

export const usePromotion = (id: number) =>
  useQuery({
    queryKey: queryKeys.promotions.detail(id),
    queryFn: () => apiRequest<Promotion>(`/api/v1/promotions/${id}`),
    enabled: id > 0,
  });

export const useCreatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PromotionCreatePayload) =>
      apiPost<Promotion, PromotionCreatePayload>('/api/v1/promotions', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.promotions.all });
      addNotification.success({ message: 'Акция создана' });
    },
  });
};

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PromotionUpdatePayload) =>
      apiPatch<Promotion, PromotionUpdatePayload>('/api/v1/promotions', payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.promotions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.promotions.detail(payload.id) });
      addNotification.success({ message: 'Акция обновлена' });
    },
  });
};

export const useArchivePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiPatch<Promotion, { id: number; archived: boolean }>('/api/v1/promotions', {
        id,
        archived: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.promotions.all });
      addNotification.success({ message: 'Акция архивирована' });
    },
  });
};

export const useRestorePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiPatch<Promotion, { id: number; archived: boolean }>('/api/v1/promotions', {
        id,
        archived: false,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.promotions.all });
      addNotification.success({ message: 'Акция восстановлена' });
    },
  });
};
