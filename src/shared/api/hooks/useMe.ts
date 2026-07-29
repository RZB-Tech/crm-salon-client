import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/shared/api/client';
import type { MeResponse } from '@/shared/api/types';

const QUERY_KEY = ['auth', 'me'] as const;

export const useMe = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => apiRequest<MeResponse>('/api/v1/auth/me'),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
