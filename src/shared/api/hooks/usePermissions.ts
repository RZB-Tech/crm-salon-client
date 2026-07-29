import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/shared/api/client';
import type { Permission } from '@/shared/api/types';

const QUERY_KEY = ['permissions'] as const;

export const usePermissions = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => apiRequest<Permission[]>('/api/v1/permissions'),
    staleTime: 10 * 60 * 1000, // 10 минут — справочник меняется редко
  });
