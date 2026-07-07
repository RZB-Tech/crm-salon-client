import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiFetchAllPost, apiPatch, apiPost, apiRequest } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  Specialization,
  SpecializationCreatePayload,
  SpecializationUpdatePayload,
} from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const useSpecializations = () =>
  useQuery({
    queryKey: queryKeys.specializations.all,
    queryFn: () => apiFetchAllPost<Specialization>('/api/v1/specializations'),
  });

export const useSpecialization = (id: number) =>
  useQuery({
    queryKey: queryKeys.specializations.detail(id),
    queryFn: () => apiRequest<Specialization>(`/api/v1/specializations/${id}`),
    enabled: id > 0,
  });

export const useCreateSpecialization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SpecializationCreatePayload) =>
      apiPost<Specialization, SpecializationCreatePayload>('/api/v1/specializations', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.specializations.all });
      addNotification.success({ message: 'Специализация создана' });
    },
  });
};

export const useUpdateSpecialization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SpecializationUpdatePayload) =>
      apiPatch<Specialization, SpecializationUpdatePayload>('/api/v1/specializations', payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.specializations.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.specializations.detail(payload.id) });
      addNotification.success({ message: 'Специализация обновлена' });
    },
  });
};

export const useDeleteSpecialization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete(`/api/v1/specializations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.specializations.all });
      addNotification.success({ message: 'Специализация удалена' });
    },
  });
};
