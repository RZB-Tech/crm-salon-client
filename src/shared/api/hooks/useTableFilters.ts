import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { FilterFieldSchema, FilterTable } from '@/shared/api/types';

/** Схема доступных фильтров таблицы: GET /api/v1/docs/filters/{table} */
export const useTableFilters = (table: FilterTable) =>
  useQuery({
    queryKey: queryKeys.filterDocs.table(table),
    queryFn: () => apiRequest<FilterFieldSchema[]>(`/api/v1/docs/filters/${table}`),
    staleTime: 30 * 60 * 1000,
  });
