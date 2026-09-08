import React from 'react';
import type { Role } from '@/shared/api/types';
import { ActionIcon } from '@mantine/core';
import { ArchiveIcon, ArrowCounterClockwiseIcon } from '@phosphor-icons/react';
import { ListCardField, ListEntityCard, listPageStyles } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';

interface RoleMobileCardProps {
  role: Role;
  onEdit: (role: Role) => void;
  onToggleArchive: (role: Role) => void;
}

export const RoleMobileCard: React.FC<RoleMobileCardProps> = ({ role, onEdit, onToggleArchive }) => {
  const { t } = useI18n();
  const statusClass = role.archived ? listPageStyles.cardChipMuted : listPageStyles.cardChipSuccess;

  return (
    <ListEntityCard onClick={() => onEdit(role)}>
      <div className={listPageStyles.cardHeader}>
        <div className={listPageStyles.cardBadges}>
          <span className={`${listPageStyles.cardChip} ${statusClass}`}>
            {role.archived ? t('promotions.archived') : t('admin.roleActive')}
          </span>
        </div>
        <ActionIcon
          className={listPageStyles.iconBtn}
          variant="default"
          aria-label={role.archived ? t('common.restore') : t('common.archive')}
          onClick={(event) => {
            event.stopPropagation();
            onToggleArchive(role);
          }}
        >
          {role.archived ? <ArrowCounterClockwiseIcon size={16} /> : <ArchiveIcon size={16} />}
        </ActionIcon>
      </div>
      <div className={listPageStyles.cardFields}>
        <ListCardField label={t('common.name')} value={role.name} />
        <ListCardField label={t('form.description')} value={role.description || t('common.dash')} />
        <ListCardField label={t('admin.permissionsCount')} value={String(role.permissions.length)} />
      </div>
    </ListEntityCard>
  );
};
