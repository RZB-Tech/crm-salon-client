import React from 'react';
import type { Role } from '@/shared/api/types';
import { ListCards } from '@/shared/ui';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { useI18n } from '@/shared/lib/i18n';
import { RoleMobileCard } from './RoleMobileCard';
import { RolesTable } from './RolesTable';

interface RolesListBodyProps extends TableSortProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onToggleArchive: (role: Role) => void;
}

export const RolesListBody: React.FC<RolesListBodyProps> = (props) => {
  const { t } = useI18n();
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <RolesTable
        roles={props.roles}
        sort={props.sort}
        onSort={props.onSort}
        onEdit={props.onEdit}
        onToggleArchive={props.onToggleArchive}
      />
    );
  }

  return (
    <ListCards isEmpty={props.roles.length === 0} emptyMessage={t('admin.emptyRoles')}>
      {props.roles.map((role) => (
        <RoleMobileCard
          key={role.id}
          role={role}
          onEdit={props.onEdit}
          onToggleArchive={props.onToggleArchive}
        />
      ))}
    </ListCards>
  );
};
