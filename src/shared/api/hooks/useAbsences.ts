import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetchAllGet, apiPatch, apiPost } from '@/shared/api/client';
import { invalidateEmployeeSchedule } from '@/shared/api/invalidate';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  Absence,
  AbsenceCreatePayload,
  AbsenceUpdatePayload,
} from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const useAbsences = () =>
  useQuery({
    queryKey: queryKeys.absences.all,
    queryFn: () => apiFetchAllGet<Absence>('/api/v1/absences'),
  });

export const useCreateAbsence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AbsenceCreatePayload) =>
      apiPost<Absence, AbsenceCreatePayload>('/api/v1/absences', payload),
    onSuccess: async (result, payload) => {
      await invalidateEmployeeSchedule(queryClient, payload.employee_id ?? result.employee_id);
      addNotification.success({ message: 'Отсутствие добавлено' });
    },
  });
};

export const useUpdateAbsence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AbsenceUpdatePayload) =>
      apiPatch<Absence, AbsenceUpdatePayload>('/api/v1/absences', payload),
    onSuccess: async (result) => {
      await invalidateEmployeeSchedule(queryClient, result.employee_id);
      addNotification.success({ message: 'Отсутствие обновлено' });
    },
  });
};

export const useArchiveAbsence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiPatch<Absence, { id: number; archived: boolean }>('/api/v1/absences', {
        id,
        archived: true,
      }),
    onSuccess: async (result) => {
      await invalidateEmployeeSchedule(queryClient, result.employee_id);
      addNotification.success({ message: 'Отсутствие архивировано' });
    },
  });
};
