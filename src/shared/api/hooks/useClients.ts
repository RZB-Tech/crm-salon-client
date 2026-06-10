import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiListRequestAll, apiPatch, apiPost, apiRequest } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  Client,
  CreateClientPayload,
  PatchedClient,
} from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const useClients = () =>
  useQuery({
    queryKey: queryKeys.clients.all,
    queryFn: () => apiListRequestAll<Client>('/api/v1/clients'),
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
    mutationFn: (payload: CreateClientPayload) =>
      apiPost<Client, CreateClientPayload>('/api/v1/clients', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      addNotification.success({ message: 'Клиент создан' });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PatchedClient }) =>
      apiPatch<Client, PatchedClient>(`/api/v1/clients/${id}`, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.detail(id) });
      addNotification.success({ message: 'Клиент обновлён' });
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
