import React from 'react';
import { ActionIcon } from '@mantine/core';
import {
  ArchiveIcon,
  ArrowCounterClockwiseIcon,
  ClockCountdownIcon,
  CurrencyCircleDollarIcon,
} from '@phosphor-icons/react';
import type { Service } from '@/shared/api/types';
import { ListEntityCard } from '@/shared/ui';
import { formatPrice } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { formatDuration } from '../lib/formatDuration';
import styles from './service-mobile-card.module.css';

interface ServiceMobileCardProps {
  service: Service;
  categoryLabel: string | null;
  showArchived: boolean;
  canUpdate: boolean;
  canManage: boolean;
  restorePending: boolean;
  onOpen: (service: Service) => void;
  onArchive: (event: React.MouseEvent, serviceId: number) => void;
  onRestore: (event: React.MouseEvent, serviceId: number) => void;
}

export const ServiceMobileCard: React.FC<ServiceMobileCardProps> = ({
  service,
  categoryLabel,
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
    <ListEntityCard onClick={canUpdate ? () => onOpen(service) : undefined}>
      <div className={styles.top}>
        <div className={styles.info}>
          {categoryLabel && <span className={styles.badge}>{categoryLabel}</span>}
          <p className={styles.name}>{service.name}</p>
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
                onRestore(event, service.id);
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
                onArchive(event, service.id);
              }}
            >
              <ArchiveIcon size={16} />
            </ActionIcon>
          ))}
      </div>
      <div className={styles.meta}>
        <div className={styles.row}>
          <ClockCountdownIcon size={16} />
          {formatDuration(service.estimated_time)}
        </div>
        <div className={styles.row}>
          <CurrencyCircleDollarIcon size={16} />
          {service.price > 0 ? formatPrice(service.price) : t('common.dash')}
        </div>
      </div>
    </ListEntityCard>
  );
};
