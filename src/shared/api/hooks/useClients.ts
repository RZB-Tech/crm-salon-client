import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  apiDelete,
  apiFetchAllPost,
  apiPatch,
  apiPost,
  apiRequest,
} from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  Client,
  ClientCreatePayload,
  ClientDepositPayload,
  ClientUpdatePayload,
} from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const useClients = () =>
  useQuery({
    queryKey: queryKeys.clients.all,
    queryFn: () => apiFetchAllPost<Client>('/api/v1/clients'),
  });

export const useClient = (id: number) =>
  useQuery({
    queryKey: queryKeys.clients.detail(id),
    queryFn: () => apiRequest<Client>(`/api/v1/clients/${id}`),
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

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete(`/api/v1/clients/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      addNotification.success({ message: 'Клиент удалён' });
    },
  });
};
