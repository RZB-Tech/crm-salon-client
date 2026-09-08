import React from 'react';
import { ActionIcon, Group } from '@mantine/core';
import { ArchiveIcon, ArrowCounterClockwiseIcon, XIcon } from '@phosphor-icons/react';
import type { GiftCard } from '@/shared/api/types';
import { ListCardField, ListEntityCard, listPageStyles } from '@/shared/ui';
import { formatDate, formatPrice, GIFT_CARD_STATUS_LABELS } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import {
  canCancelGiftCard,
  getGiftCardViewStatus,
} from '../lib/giftCardHelpers';

interface GiftCardMobileCardProps {
  card: GiftCard;
  showArchived: boolean;
  canUpdate: boolean;
  canManage: boolean;
  restorePending: boolean;
  clientName: string;
  onOpen: (card: GiftCard) => void;
  onArchive: (event: React.MouseEvent, cardId: number) => void;
  onRestore: (event: React.MouseEvent, cardId: number) => void;
  onCancel: (event: React.MouseEvent, cardId: number) => void;
}

const statusChip = (status: string): string => {
  if (status === 'active') return listPageStyles.cardChipSuccess;
  if (status === 'cancelled') return listPageStyles.cardChipDanger;
  return listPageStyles.cardChipMuted;
};

export const GiftCardMobileCard: React.FC<GiftCardMobileCardProps> = ({
  card,
  showArchived,
  canUpdate,
  canManage,
  restorePending,
  clientName,
  onOpen,
  onArchive,
  onRestore,
  onCancel,
}) => {
  const { t } = useI18n();
  const status = getGiftCardViewStatus(card);

  return (
    <ListEntityCard onClick={canUpdate ? () => onOpen(card) : undefined}>
      <div className={listPageStyles.cardHeader}>
        <div className={listPageStyles.cardBadges}>
          <span className={`${listPageStyles.cardChip} ${statusChip(status)}`}>
            {GIFT_CARD_STATUS_LABELS[status] ?? status}
          </span>
        </div>
        <Group gap={4} wrap="nowrap" onClick={(event) => event.stopPropagation()}>
          {canUpdate && canCancelGiftCard(card) && (
            <ActionIcon
              className={listPageStyles.iconBtn}
              variant="default"
              color="orange"
              aria-label={t('common.cancel')}
              onClick={(event) => onCancel(event, card.id)}
            >
              <XIcon size={16} />
            </ActionIcon>
          )}
          {canManage &&
            (showArchived ? (
              <ActionIcon
                className={listPageStyles.iconBtn}
                variant="subtle"
                color="teal"
                aria-label={t('common.restore')}
                loading={restorePending}
                onClick={(event) => onRestore(event, card.id)}
              >
                <ArrowCounterClockwiseIcon size={16} />
              </ActionIcon>
            ) : (
              <ActionIcon
                className={listPageStyles.iconBtn}
                variant="default"
                aria-label={t('common.archive')}
                onClick={(event) => onArchive(event, card.id)}
              >
                <ArchiveIcon size={16} />
              </ActionIcon>
            ))}
        </Group>
      </div>
      <p className={listPageStyles.cardTitle}>{card.code}</p>
      <div className={listPageStyles.cardFields}>
        <ListCardField label={t('giftCards.client')} value={clientName} />
        <ListCardField
          label={t('giftCards.remainder')}
          value={`${formatPrice(card.remain_amount)} ${t('common.of')} ${formatPrice(card.initial_amount)}`}
        />
        <ListCardField label={t('giftCards.issued')} value={formatDate(card.issue_date)} />
      </div>
    </ListEntityCard>
  );
};
