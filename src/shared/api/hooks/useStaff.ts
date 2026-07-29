import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetchAllPost, apiPatch, apiPost } from '@/shared/api/client';
import type {
  Staff,
  StaffCreatePayload,
  StaffCreateResponse,
  StaffPermissionsUpdatePayload,
  StaffRolesAssignPayload,
} from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

const QUERY_KEY = ['staff'] as const;

export const useStaffList = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => apiFetchAllPost<Staff>('/api/v1/staff'),
  });

export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StaffCreatePayload) =>
      apiPost<StaffCreateResponse, StaffCreatePayload>('/api/v1/staff/create-user', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      addNotification.success({ message: 'Пользователь создан' });
    },
  });
};

export const useAssignStaffRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StaffRolesAssignPayload) =>
      apiPatch<Staff, StaffRolesAssignPayload>('/api/v1/staff/roles', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      addNotification.success({ message: 'Роли назначены' });
    },
  });
};

export const useUpdateStaffPermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StaffPermissionsUpdatePayload) =>
      apiPatch<Staff, StaffPermissionsUpdatePayload>('/api/v1/staff/permissions', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      addNotification.success({ message: 'Разрешения обновлены' });
    },
  });
};
