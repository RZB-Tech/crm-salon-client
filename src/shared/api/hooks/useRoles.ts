import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetchAllPost, apiPatch, apiPost, apiRequest } from '@/shared/api/client';
import type { Role, RoleCreatePayload, RoleUpdatePayload } from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

const QUERY_KEY = ['roles'] as const;

export const useRoles = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => apiFetchAllPost<Role>('/api/v1/roles'),
  });

export const useRole = (id: number) =>
  useQuery({
    queryKey: [...QUERY_KEY, id] as const,
    queryFn: () => apiRequest<Role>(`/api/v1/roles/${id}`),
    enabled: id > 0,
  });

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RoleCreatePayload) =>
      apiPost<Role, RoleCreatePayload>('/api/v1/roles', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      addNotification.success({ message: 'Роль создана' });
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RoleUpdatePayload) =>
      apiPatch<Role, RoleUpdatePayload>('/api/v1/roles', payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, payload.id] });
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      addNotification.success({ message: 'Роль обновлена' });
    },
  });
};
