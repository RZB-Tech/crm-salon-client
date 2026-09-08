import React from 'react';
import { ActionIcon, Group } from '@mantine/core';
import { CheckIcon, XIcon } from '@phosphor-icons/react';
import type { SalonNotification } from '@/shared/api/types';
import { ListEntityCard, listPageStyles } from '@/shared/ui';
import { getEffectiveStatus, getSalonNotificationCopy } from '@/shared/lib/notifications/notificationDelivery';
import { formatDateTime, NOTIFICATION_TYPE_LABELS } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';

interface NotificationMobileCardProps {
  item: SalonNotification;
  cancelPending: boolean;
  onMarkRead: (id: number) => void;
  onCancel: (id: number) => void;
}

const statusClass = (status: string): string => {
  if (status === 'read') return listPageStyles.cardChipSuccess;
  if (status === 'cancelled') return listPageStyles.cardChipDanger;
  return listPageStyles.cardChipMuted;
};

export const NotificationMobileCard: React.FC<NotificationMobileCardProps> = ({
  item,
  cancelPending,
  onMarkRead,
  onCancel,
}) => {
  const { t } = useI18n();
  const status = getEffectiveStatus(item);
  const copy = getSalonNotificationCopy(item);
  const statusLabel =
    status === 'read'
      ? t('notifications.markReadShort')
      : status === 'cancelled'
        ? t('notifications.cancelledItem')
        : t('notifications.newItem');

  return (
    <ListEntityCard>
      <div className={listPageStyles.cardHeader}>
        <div className={listPageStyles.cardBadges}>
          <span className={listPageStyles.cardChip}>
            {NOTIFICATION_TYPE_LABELS[item.type] ?? item.type}
          </span>
          <span className={`${listPageStyles.cardChip} ${statusClass(status)}`}>{statusLabel}</span>
        </div>
        {status === 'pending' && (
          <Group gap={4} wrap="nowrap">
            <ActionIcon
              className={listPageStyles.iconBtn}
              variant="default"
              color="green"
              aria-label={t('notifications.markReadShort')}
              onClick={() => onMarkRead(item.id)}
            >
              <CheckIcon size={16} />
            </ActionIcon>
            <ActionIcon
              className={listPageStyles.iconBtn}
              variant="default"
              color="orange"
              aria-label={t('common.cancel')}
              loading={cancelPending}
              onClick={() => onCancel(item.id)}
            >
              <XIcon size={16} />
            </ActionIcon>
          </Group>
        )}
      </div>
      <p className={listPageStyles.cardTitle}>{copy.title}</p>
      <span className={listPageStyles.cardValue}>{copy.body || t('common.dash')}</span>
      <span className={`${listPageStyles.cardMeta} ${listPageStyles.cardMetaAccent}`}>
        {formatDateTime(item.scheduled_at)}
      </span>
    </ListEntityCard>
  );
};
