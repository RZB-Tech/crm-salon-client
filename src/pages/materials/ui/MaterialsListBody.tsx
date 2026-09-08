import React from 'react';
import type { Material } from '@/shared/api/types';
import { ListCards } from '@/shared/ui';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { useI18n } from '@/shared/lib/i18n';
import { MaterialMobileCard } from './MaterialMobileCard';
import { MaterialsTable } from './MaterialsTable';

interface MaterialsListBodyProps extends TableSortProps {
  items: Material[];
  showArchived: boolean;
  restorePending: boolean;
  onEdit: (material: Material) => void;
  onArchive: (event: React.MouseEvent, materialId: number) => void;
  onRestore: (event: React.MouseEvent, materialId: number) => void;
}

export const MaterialsListBody: React.FC<MaterialsListBodyProps> = (props) => {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const { hasPermission } = useAccess();
  const canUpdate = !props.showArchived && hasPermission(PermissionCode.MATERIAL_UPDATE);
  const canManage = hasPermission(PermissionCode.MATERIAL_MANAGE);

  if (!isMobile) {
    const { restorePending: _restorePending, ...tableProps } = props;
    return <MaterialsTable {...tableProps} />;
  }

  return (
    <ListCards isEmpty={props.items.length === 0} emptyMessage={t('materials.notFound')}>
      {props.items.map((material) => (
        <MaterialMobileCard
          key={material.id}
          material={material}
          showArchived={props.showArchived}
          canUpdate={canUpdate}
          canManage={canManage}
          restorePending={props.restorePending}
          onOpen={props.onEdit}
          onArchive={props.onArchive}
          onRestore={props.onRestore}
        />
      ))}
    </ListCards>
  );
};
