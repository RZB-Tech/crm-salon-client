import { useQuery } from '@tanstack/react-query';
import { apiPost } from '@/shared/api/client';
import type { ClientFinanceReport, ClientFinanceReportPayload } from '@/shared/api/types';

export const useClientFinanceReport = (params: ClientFinanceReportPayload) =>
  useQuery({
    queryKey: ['clients', params.clientID, 'finance-report', params.start_date, params.end_date] as const,
    queryFn: () =>
      apiPost<ClientFinanceReport, ClientFinanceReportPayload>(
        '/api/v1/clients/finance-report',
        params,
      ),
    enabled: params.clientID > 0,
  });
