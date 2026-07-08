import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiFetchAllPost, apiPatch, apiPost, apiRequest } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  Material,
  MaterialCreatePayload,
  MaterialQuantityPayload,
  MaterialUpdatePayload
} from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const useMaterials = () =>
  useQuery({
    queryKey: queryKeys.materials.all,
    queryFn: () => apiFetchAllPost<Material>('/api/v1/materials')
  });

export const useMaterial = (id: number) =>
  useQuery({
    queryKey: queryKeys.materials.detail(id),
    queryFn: () => apiRequest<Material>(`/api/v1/materials/${id}`),
    enabled: id > 0
  });

export const useCreateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MaterialCreatePayload) =>
      apiPost<Material, MaterialCreatePayload>('/api/v1/materials', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materials.all });
      addNotification.success({ message: 'Материал создан' });
    }
  });
};

export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MaterialUpdatePayload) =>
      apiPatch<Material, MaterialUpdatePayload>('/api/v1/materials', payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materials.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.materials.detail(payload.id) });
      addNotification.success({ message: 'Материал обновлён' });
    }
  });
};

export const useUpdateMaterialQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MaterialQuantityPayload) =>
      apiPost<Material, MaterialQuantityPayload>('/api/v1/materials/update-quantity', payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materials.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.materials.detail(payload.id) });
      addNotification.success({ message: 'Количество обновлено' });
    }
  });
};

export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete(`/api/v1/materials/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materials.all });
      addNotification.success({ message: 'Материал удалён' });
    }
  });
};

export const useArchiveMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiPatch<Material, MaterialUpdatePayload>('/api/v1/materials', { id, archived: true }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materials.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.materials.detail(id) });
      addNotification.success({ message: 'Материал архивирован' });
    }
  });
};
