import React from 'react';
import type { Service, ServiceCategory } from '@/shared/api/types';
import { ListCards } from '@/shared/ui';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { useI18n } from '@/shared/lib/i18n';
import { ServiceMobileCard } from './ServiceMobileCard';
import { ServicesTable } from './ServicesTable';

interface ServicesListBodyProps extends TableSortProps {
  items: Service[];
  categoryMap: Map<number, ServiceCategory>;
  showArchived: boolean;
  restorePending: boolean;
  onEdit: (service: Service) => void;
  onArchive: (event: React.MouseEvent, serviceId: number) => void;
  onRestore: (event: React.MouseEvent, serviceId: number) => void;
}

export const ServicesListBody: React.FC<ServicesListBodyProps> = (props) => {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const { hasPermission } = useAccess();
  const canUpdate = !props.showArchived && hasPermission(PermissionCode.SERVICE_UPDATE);
  const canManage = hasPermission(PermissionCode.SERVICE_MANAGE);

  if (!isMobile) {
    const { restorePending: _restorePending, ...tableProps } = props;
    return <ServicesTable {...tableProps} />;
  }

  return (
    <ListCards isEmpty={props.items.length === 0} emptyMessage={t('services.notFound')}>
      {props.items.map((service) => (
        <ServiceMobileCard
          key={service.id}
          service={service}
          categoryLabel={
            service.category_id != null
              ? (props.categoryMap.get(service.category_id)?.name ?? null)
              : null
          }
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
