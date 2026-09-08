import React from 'react';
import type { TenantBranch } from '@/shared/api/types';
import { ListCards } from '@/shared/ui';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { useI18n } from '@/shared/lib/i18n';
import { BranchMobileCard } from './BranchMobileCard';
import { BranchesTable } from './BranchesTable';

interface BranchesListBodyProps extends TableSortProps {
  items: TenantBranch[];
  onEdit: (branch: TenantBranch) => void;
  onAddAdmin: (branch: TenantBranch) => void;
}

export const BranchesListBody: React.FC<BranchesListBodyProps> = (props) => {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const { hasPermission } = useAccess();
  const canManage = hasPermission(PermissionCode.TENANT_BRANCH_MANAGE);
  const canCreate = hasPermission(PermissionCode.TENANT_BRANCH_CREATE);

  if (!isMobile) {
    return <BranchesTable {...props} />;
  }

  return (
    <ListCards isEmpty={props.items.length === 0} emptyMessage={t('branches.empty')}>
      {props.items.map((branch) => (
        <BranchMobileCard
          key={branch.id}
          branch={branch}
          canManage={canManage}
          canCreate={canCreate}
          onEdit={props.onEdit}
          onAddAdmin={props.onAddAdmin}
        />
      ))}
    </ListCards>
  );
};
