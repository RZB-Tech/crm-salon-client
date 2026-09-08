import React from 'react';
import type { Client } from '@/shared/api/types';
import { ListCards } from '@/shared/ui';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { useI18n } from '@/shared/lib/i18n';
import { ClientMobileCard } from './ClientMobileCard';
import { ClientsTable } from './ClientsTable';

interface ClientsListBodyProps extends TableSortProps {
  items: Client[];
  showArchived: boolean;
  onRowClick: (client: Client) => void;
  onArchive: (event: React.MouseEvent, clientId: number) => void;
  onRestore: (event: React.MouseEvent, clientId: number) => void;
}

export const ClientsListBody: React.FC<ClientsListBodyProps> = (props) => {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const { hasPermission } = useAccess();
  const canManage = hasPermission(PermissionCode.CLIENT_MANAGE);

  if (!isMobile) {
    return <ClientsTable {...props} />;
  }

  return (
    <ListCards isEmpty={props.items.length === 0} emptyMessage={t('clients.notFound')}>
      {props.items.map((client) => (
        <ClientMobileCard
          key={client.id}
          client={client}
          showArchived={props.showArchived}
          canManage={canManage}
          onOpen={props.onRowClick}
          onArchive={props.onArchive}
          onRestore={props.onRestore}
        />
      ))}
    </ListCards>
  );
};
