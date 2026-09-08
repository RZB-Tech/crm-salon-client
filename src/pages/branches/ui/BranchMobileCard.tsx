import React from 'react';
import { ActionIcon, Group } from '@mantine/core';
import { PencilSimpleIcon, UserPlusIcon } from '@phosphor-icons/react';
import type { TenantBranch } from '@/shared/api/types';
import { ListCardField, ListEntityCard, listPageStyles } from '@/shared/ui';
import { formatDate } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';

interface BranchMobileCardProps {
  branch: TenantBranch;
  canManage: boolean;
  canCreate: boolean;
  onEdit: (branch: TenantBranch) => void;
  onAddAdmin: (branch: TenantBranch) => void;
}

export const BranchMobileCard: React.FC<BranchMobileCardProps> = ({
  branch,
  canManage,
  canCreate,
  onEdit,
  onAddAdmin,
}) => {
  const { t } = useI18n();
  const statusClass = branch.active ? listPageStyles.cardChipSuccess : listPageStyles.cardChipMuted;

  return (
    <ListEntityCard onClick={canManage ? () => onEdit(branch) : undefined}>
      <div className={listPageStyles.cardHeader}>
        <div className={listPageStyles.cardBadges}>
          <span className={`${listPageStyles.cardChip} ${statusClass}`}>
            {branch.active ? t('branches.active') : t('branches.inactive')}
          </span>
        </div>
        <Group gap={4} wrap="nowrap" onClick={(event) => event.stopPropagation()}>
          {canCreate && (
            <ActionIcon
              className={listPageStyles.iconBtn}
              variant="default"
              aria-label={t('branches.addAdmin')}
              onClick={() => onAddAdmin(branch)}
            >
              <UserPlusIcon size={16} />
            </ActionIcon>
          )}
          {canManage && (
            <ActionIcon
              className={listPageStyles.iconBtn}
              variant="default"
              aria-label={t('common.edit')}
              onClick={() => onEdit(branch)}
            >
              <PencilSimpleIcon size={16} />
            </ActionIcon>
          )}
        </Group>
      </div>
      <p className={listPageStyles.cardTitle}>{branch.name}</p>
      <div className={listPageStyles.cardFields}>
        <ListCardField label={t('branches.tin')} value={branch.TIN || t('common.dash')} />
        <ListCardField label={t('branches.created')} value={formatDate(branch.created_at)} />
      </div>
    </ListEntityCard>
  );
};
