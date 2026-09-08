import React from 'react';
import type { SalonNotification } from '@/shared/api/types';
import { ListCards } from '@/shared/ui';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { useI18n } from '@/shared/lib/i18n';
import { NotificationMobileCard } from './NotificationMobileCard';
import { NotificationsTable } from './NotificationsTable';

interface NotificationsListBodyProps extends TableSortProps {
  items: SalonNotification[];
  cancelPending: boolean;
  onMarkRead: (id: number) => void;
  onCancel: (id: number) => void;
}

export const NotificationsListBody: React.FC<NotificationsListBodyProps> = (props) => {
  const { t } = useI18n();
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <NotificationsTable {...props} />;
  }

  return (
    <ListCards isEmpty={props.items.length === 0} emptyMessage={t('notifications.empty')}>
      {props.items.map((item) => (
        <NotificationMobileCard
          key={item.id}
          item={item}
          cancelPending={props.cancelPending}
          onMarkRead={props.onMarkRead}
          onCancel={props.onCancel}
        />
      ))}
    </ListCards>
  );
};
