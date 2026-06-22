import { useQuery } from '@tanstack/react-query';
import { apiRequest, type PaginatedResponse } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { AuditLog, AuditLogsParams } from '@/shared/api/types';

export const useAuditLogs = (params: AuditLogsParams) =>
  useQuery({
    queryKey: queryKeys.auditLogs.list(
      params.table_name,
      params.record_id,
      params.page ?? 1,
    ),
    queryFn: () => {
      const qs = new URLSearchParams();
      qs.set('table_name', params.table_name);
      qs.set('record_id', String(params.record_id));
      qs.set('page', String(params.page ?? 1));
      qs.set('pageSize', String(params.pageSize ?? 100));
      return apiRequest<PaginatedResponse<AuditLog>>(`/api/v1/audit-logs?${qs}`);
    },
    enabled: params.record_id > 0,
  });
