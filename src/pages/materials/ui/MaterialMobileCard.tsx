import React from 'react';
import { ActionIcon } from '@mantine/core';
import {
  ArchiveIcon,
  ArrowCounterClockwiseIcon,
  CurrencyCircleDollarIcon,
  ListNumbersIcon,
} from '@phosphor-icons/react';
import type { Material } from '@/shared/api/types';
import { ListEntityCard } from '@/shared/ui';
import { formatPrice, MEASUREMENT_UNIT_LABELS } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import styles from './material-mobile-card.module.css';

interface MaterialMobileCardProps {
  material: Material;
  showArchived: boolean;
  canUpdate: boolean;
  canManage: boolean;
  restorePending: boolean;
  onOpen: (material: Material) => void;
  onArchive: (event: React.MouseEvent, materialId: number) => void;
  onRestore: (event: React.MouseEvent, materialId: number) => void;
}

export const MaterialMobileCard: React.FC<MaterialMobileCardProps> = ({
  material,
  showArchived,
  canUpdate,
  canManage,
  restorePending,
  onOpen,
  onArchive,
  onRestore,
}) => {
  const { t } = useI18n();

  return (
    <ListEntityCard onClick={canUpdate ? () => onOpen(material) : undefined}>
      <div className={styles.top}>
        <div className={styles.info}>
          {material.article && <span className={styles.badge}>{material.article}</span>}
          <p className={styles.name}>{material.name}</p>
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
                onRestore(event, material.id);
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
                onArchive(event, material.id);
              }}
            >
              <ArchiveIcon size={16} />
            </ActionIcon>
          ))}
      </div>
      <div className={styles.meta}>
        <div className={styles.row}>
          <ListNumbersIcon size={16} />
          {material.quantity} {MEASUREMENT_UNIT_LABELS[material.measurement_unit]}
        </div>
        <div className={styles.row}>
          <CurrencyCircleDollarIcon size={16} />
          {formatPrice(material.sell_price)}
        </div>
      </div>
    </ListEntityCard>
  );
};
