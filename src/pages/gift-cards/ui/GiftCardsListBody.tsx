import React from 'react';
import type { GiftCard } from '@/shared/api/types';
import { ListCards } from '@/shared/ui';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { useI18n } from '@/shared/lib/i18n';
import { GiftCardMobileCard } from './GiftCardMobileCard';
import { GiftCardsTable } from './GiftCardsTable';

interface GiftCardsListBodyProps extends TableSortProps {
  items: GiftCard[];
  showArchived: boolean;
  restorePending: boolean;
  clientNameMap: Map<number, string>;
  onEdit: (card: GiftCard) => void;
  onArchive: (event: React.MouseEvent, cardId: number) => void;
  onRestore: (event: React.MouseEvent, cardId: number) => void;
  onCancel: (event: React.MouseEvent, cardId: number) => void;
}

export const GiftCardsListBody: React.FC<GiftCardsListBodyProps> = (props) => {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const { hasPermission } = useAccess();
  const canUpdate = !props.showArchived && hasPermission(PermissionCode.GIFT_CARD_UPDATE);
  const canManage = hasPermission(PermissionCode.GIFT_CARD_MANAGE);

  if (!isMobile) {
    const { restorePending: _restorePending, ...tableProps } = props;
    return <GiftCardsTable {...tableProps} />;
  }

  return (
    <ListCards isEmpty={props.items.length === 0} emptyMessage={t('giftCards.notFound')}>
      {props.items.map((card) => (
        <GiftCardMobileCard
          key={card.id}
          card={card}
          showArchived={props.showArchived}
          canUpdate={canUpdate}
          canManage={canManage}
          restorePending={props.restorePending}
          clientName={
            card.client_id != null
              ? (props.clientNameMap.get(card.client_id) ?? t('form.clientNamed', { id: card.client_id }))
              : t('form.anyClient')
          }
          onOpen={props.onEdit}
          onArchive={props.onArchive}
          onRestore={props.onRestore}
          onCancel={props.onCancel}
        />
      ))}
    </ListCards>
  );
};
