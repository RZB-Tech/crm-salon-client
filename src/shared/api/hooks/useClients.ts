import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  apiFetchAllPost,
  apiGetPaginated,
  apiPatch,
  apiPost,
  apiRequest,
} from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  Appointment,
  Client,
  ClientCreatePayload,
  ClientDepositPayload,
  ClientUpdatePayload,
} from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const useClients = (archived = false) =>
  useQuery({
    queryKey: [...queryKeys.clients.all, { archived }],
    queryFn: () => apiFetchAllPost<Client>('/api/v1/clients', { archived }),
    staleTime: 2 * 60 * 1000,
  });

export const useClient = (id: number) =>
  useQuery({
    queryKey: queryKeys.clients.detail(id),
    queryFn: () => apiRequest<Client>(`/api/v1/clients/${id}`),
    enabled: id > 0,
  });

export const useClientAppointments = (id: number) =>
  useQuery({
    queryKey: queryKeys.clients.appointments(id),
    queryFn: async () => {
      const data = await apiGetPaginated<Appointment>(`/api/v1/clients/${id}/appointments`, {
        page: 1,
        pageSize: 100,
      });
      return data.items;
    },
    enabled: id > 0,
  });

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ClientCreatePayload) =>
      apiPost<Client, ClientCreatePayload>('/api/v1/clients', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      addNotification.success({ message: 'Клиент создан' });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ClientUpdatePayload) =>
      apiPatch<Client, ClientUpdatePayload>('/api/v1/clients', payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.detail(payload.id) });
      addNotification.success({ message: 'Клиент обновлён' });
    },
  });
};

export const useUpdateClientDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ClientDepositPayload) =>
      apiPost<Client, ClientDepositPayload>('/api/v1/clients/update-deposit', payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.detail(payload.id) });
      addNotification.success({ message: 'Депозит обновлён' });
    },
  });
};

export const useArchiveClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiPatch<Client, { id: number; archived: boolean }>('/api/v1/clients', { id, archived: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      addNotification.success({ message: 'Клиент архивирован' });
    },
  });
};

export const useRestoreClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiPatch<Client, { id: number; archived: boolean }>('/api/v1/clients', { id, archived: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      addNotification.success({ message: 'Клиент восстановлен' });
    },
  });
};
