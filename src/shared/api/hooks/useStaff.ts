import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetchAllPost, apiPatch, apiPost } from '@/shared/api/client';
import type {
  Staff,
  StaffCreatePayload,
  StaffCreateResponse,
  StaffPermissionsUpdatePayload,
  StaffRolesAssignPayload,
} from '@/shared/api/types';
import { t } from '@/shared/lib/i18n';
import { addNotification } from '@/shared/lib/notifications';

const QUERY_KEY = ['staff'] as const;

const patchStaffInList = (
  queryClient: ReturnType<typeof useQueryClient>,
  staff: Staff,
) => {
  queryClient.setQueryData<Staff[]>(QUERY_KEY, (list) => {
    if (!list) return [staff];
    const index = list.findIndex((item) => item.id === staff.id);
    if (index < 0) return [staff, ...list];
    const next = [...list];
    next[index] = staff;
    return next;
  });
};

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
    onSuccess: async (result) => {
      patchStaffInList(queryClient, result);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      addNotification.success({ message: t('toast.staffCreated') });
    },
  });
};

export const useAssignStaffRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StaffRolesAssignPayload) =>
      apiPatch<Staff, StaffRolesAssignPayload>('/api/v1/staff/roles', payload),
    onSuccess: async (result) => {
      patchStaffInList(queryClient, result);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      addNotification.success({ message: t('toast.rolesAssigned') });
    },
  });
};

export const useUpdateStaffPermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StaffPermissionsUpdatePayload) =>
      apiPatch<Staff, StaffPermissionsUpdatePayload>('/api/v1/staff/permissions', payload),
    onSuccess: async (result) => {
      patchStaffInList(queryClient, result);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      addNotification.success({ message: t('toast.permissionsUpdated') });
    },
  });
};
