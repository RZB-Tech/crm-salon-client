import { useQuery } from '@tanstack/react-query';
import { apiFetchAllPost, apiRequest } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { Service, ServiceCategory } from '@/shared/api/types';

export const useServices = (archived = false) =>
  useQuery({
    queryKey: [...queryKeys.services.all, { archived }],
    queryFn: () => apiFetchAllPost<Service>('/api/v1/services', { archived }),
  });

export const useService = (id: number) =>
  useQuery({
    queryKey: queryKeys.services.detail(id),
    queryFn: () => apiRequest<Service>(`/api/v1/services/${id}`),
    enabled: id > 0,
  });

export const useServiceCategories = (archived = false) =>
  useQuery({
    queryKey: [...queryKeys.serviceCategories.all, { archived }],
    queryFn: () => apiFetchAllPost<ServiceCategory>('/api/v1/service-categories', { archived }),
  });

export const useServiceCategory = (id: number) =>
  useQuery({
    queryKey: queryKeys.serviceCategories.detail(id),
    queryFn: () => apiRequest<ServiceCategory>(`/api/v1/service-categories/${id}`),
    enabled: id > 0,
  });
