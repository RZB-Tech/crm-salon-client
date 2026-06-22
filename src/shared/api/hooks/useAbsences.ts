import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  apiDelete,
  apiFetchAllGet,
  apiPatch,
  apiPost,
} from '@/shared/api/client';
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
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.absences.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.employees.workSchedules(payload.employee_id),
      });
      addNotification.success({ message: 'Отсутствие добавлено' });
    },
  });
};

export const useUpdateAbsence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AbsenceUpdatePayload) =>
      apiPatch<Absence, AbsenceUpdatePayload>('/api/v1/absences', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.absences.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      addNotification.success({ message: 'Отсутствие обновлено' });
    },
  });
};

export const useDeleteAbsence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete(`/api/v1/absences/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.absences.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      addNotification.success({ message: 'Отсутствие удалено' });
    },
  });
};
