import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, apiPatch, apiPost, apiRequest } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  BranchAdminCreatePayload,
  BranchCredentials,
  TenantBranch,
  TenantBranchCreatePayload,
  TenantBranchCreateResponse,
  TenantBranchReport,
  TenantBranchUpdatePayload,
} from '@/shared/api/types';
import { t } from '@/shared/lib/i18n';
import { addNotification } from '@/shared/lib/notifications';

export interface TenantBranchesQueryData {
  isParent: boolean;
  branches: TenantBranch[];
}

const fetchBranches = async (): Promise<TenantBranchesQueryData> => {
  try {
    const branches = await apiRequest<TenantBranch[]>('/api/v1/tenant-branches');
    return { isParent: true, branches };
  } catch (error) {
    if (error instanceof ApiError && error.errorCode === 'ONLY_FOR_PARENT_TENANT') {
      return { isParent: false, branches: [] };
    }
    throw error;
  }
};

export const useTenantBranches = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.tenantBranches.all,
    queryFn: fetchBranches,
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

export const useTenantBranchesReport = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.tenantBranches.report,
    queryFn: () => apiRequest<TenantBranchReport>('/api/v1/tenant-branches/report'),
    enabled,
  });

export const useCreateTenantBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TenantBranchCreatePayload) =>
      apiPost<TenantBranchCreateResponse, TenantBranchCreatePayload>(
        '/api/v1/tenant-branches',
        payload,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tenantBranches.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tenantBranches.report });
      addNotification.success({ message: t('toast.branchCreated') });
    },
  });
};

export const useUpdateTenantBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TenantBranchUpdatePayload) =>
      apiPatch<TenantBranch, TenantBranchUpdatePayload>('/api/v1/tenant-branches/update', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tenantBranches.all });
      addNotification.success({ message: t('toast.branchUpdated') });
    },
  });
};

export const useCreateBranchAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BranchAdminCreatePayload) =>
      apiPost<BranchCredentials, BranchAdminCreatePayload>(
        '/api/v1/tenant-branches/create-branch-admin',
        payload,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tenantBranches.report });
      addNotification.success({ message: t('toast.branchAdminCreated') });
    },
  });
};
