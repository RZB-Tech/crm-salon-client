import React from 'react';
import type { Promotion } from '@/shared/api/types';
import { ListCards } from '@/shared/ui';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { t, useI18n } from '@/shared/lib/i18n';
import { PromotionMobileCard } from './PromotionMobileCard';
import { PromotionsTable } from './PromotionsTable';

interface PromotionsListBodyProps extends TableSortProps {
  items: Promotion[];
  showArchived: boolean;
  restorePending: boolean;
  serviceNameMap: Map<number, string>;
  materialNameMap: Map<number, string>;
  onEdit: (promo: Promotion) => void;
  onArchive: (event: React.MouseEvent, promoId: number) => void;
  onRestore: (event: React.MouseEvent, promoId: number) => void;
}

const targetLabel = (
  promo: Promotion,
  serviceNameMap: Map<number, string>,
  materialNameMap: Map<number, string>,
): string => {
  if (promo.service_id != null) {
    return serviceNameMap.get(promo.service_id) ?? t('promotions.serviceNamed', { id: promo.service_id });
  }
  if (promo.material_id != null) {
    return materialNameMap.get(promo.material_id) ?? t('promotions.materialNamed', { id: promo.material_id });
  }
  return t('common.dash');
};

export const PromotionsListBody: React.FC<PromotionsListBodyProps> = (props) => {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const { hasPermission } = useAccess();
  const canUpdate = !props.showArchived && hasPermission(PermissionCode.PROMOTION_UPDATE);
  const canManage = hasPermission(PermissionCode.PROMOTION_MANAGE);

  if (!isMobile) {
    const { restorePending: _restorePending, ...tableProps } = props;
    return <PromotionsTable {...tableProps} />;
  }

  return (
    <ListCards isEmpty={props.items.length === 0} emptyMessage={t('promotions.notFound')}>
      {props.items.map((promo) => (
        <PromotionMobileCard
          key={promo.id}
          promo={promo}
          targetName={targetLabel(promo, props.serviceNameMap, props.materialNameMap)}
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
