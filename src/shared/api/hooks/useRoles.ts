import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetchAllPost, apiPatch, apiPost } from '@/shared/api/client';
import type { Role, RoleCreatePayload, RoleUpdatePayload } from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

const QUERY_KEY = ['roles'] as const;

const patchRoleInList = (
  queryClient: ReturnType<typeof useQueryClient>,
  role: Role,
) => {
  queryClient.setQueryData<Role[]>(QUERY_KEY, (list) => {
    if (!list) return [role];
    const index = list.findIndex((item) => item.id === role.id);
    if (index < 0) return [role, ...list];
    const next = [...list];
    next[index] = role;
    return next;
  });
};

export const useRoles = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => apiFetchAllPost<Role>('/api/v1/roles'),
  });

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RoleCreatePayload) =>
      apiPost<Role, RoleCreatePayload>('/api/v1/roles', payload),
    onSuccess: async (result) => {
      patchRoleInList(queryClient, result);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      addNotification.success({ message: 'Роль создана' });
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RoleUpdatePayload) =>
      apiPatch<Role, RoleUpdatePayload>('/api/v1/roles', payload),
    onSuccess: async (result, payload) => {
      patchRoleInList(queryClient, result);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, payload.id] });
      await queryClient.invalidateQueries({ queryKey: ['staff'] });
      addNotification.success({ message: 'Роль обновлена' });
    },
  });
};
