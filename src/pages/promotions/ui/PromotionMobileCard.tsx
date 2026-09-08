import React from 'react';
import { ActionIcon } from '@mantine/core';
import {
  ArchiveIcon,
  ArrowCounterClockwiseIcon,
  CalendarDotsIcon,
  PackageIcon,
  ScissorsIcon,
} from '@phosphor-icons/react';
import type { Promotion } from '@/shared/api/types';
import { ListEntityCard } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import {
  formatDiscountLabel,
  formatPromotionPeriod,
  getPromotionStatus,
  PROMOTION_STATUS_LABELS,
} from '../lib/promotionHelpers';
import styles from './promotion-mobile-card.module.css';

interface PromotionMobileCardProps {
  promo: Promotion;
  targetName: string;
  showArchived: boolean;
  canUpdate: boolean;
  canManage: boolean;
  restorePending: boolean;
  onOpen: (promo: Promotion) => void;
  onArchive: (event: React.MouseEvent, promoId: number) => void;
  onRestore: (event: React.MouseEvent, promoId: number) => void;
}

export const PromotionMobileCard: React.FC<PromotionMobileCardProps> = ({
  promo,
  targetName,
  showArchived,
  canUpdate,
  canManage,
  restorePending,
  onOpen,
  onArchive,
  onRestore,
}) => {
  const { t } = useI18n();
  const status = getPromotionStatus(promo);
  const isService = promo.service_id != null;

  return (
    <ListEntityCard onClick={canUpdate ? () => onOpen(promo) : undefined}>
      <div className={styles.top}>
        <div className={styles.info}>
          <div className={styles.badges}>
            <span className={`${styles.status}${status !== 'active' ? ` ${styles.statusMuted}` : ''}`}>
              {PROMOTION_STATUS_LABELS[status]}
            </span>
            <span className={styles.percent}>{formatDiscountLabel(promo)}</span>
          </div>
          <p className={styles.name}>{promo.name}</p>
        </div>
        {canManage &&
          (showArchived ? (
            <ActionIcon
              className={styles.archiveBtn}
              variant="subtle"
              color="teal"
              aria-label={t('common.restore')}
              loading={restorePending}
              onClick={(event) => {
                event.stopPropagation();
                onRestore(event, promo.id);
              }}
            >
              <ArrowCounterClockwiseIcon size={16} />
            </ActionIcon>
          ) : (
            <ActionIcon
              className={styles.archiveBtn}
              variant="default"
              aria-label={t('common.archive')}
              onClick={(event) => {
                event.stopPropagation();
                onArchive(event, promo.id);
              }}
            >
              <ArchiveIcon size={16} />
            </ActionIcon>
          ))}
      </div>
      <div className={styles.meta}>
        <div className={styles.row}>
          {isService ? <ScissorsIcon size={16} /> : <PackageIcon size={16} />}
          {targetName}
        </div>
        <div className={styles.row}>
          <CalendarDotsIcon size={16} />
          {formatPromotionPeriod(promo)}
        </div>
      </div>
    </ListEntityCard>
  );
};
