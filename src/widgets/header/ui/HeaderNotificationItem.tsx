import { BellRingingIcon } from '@phosphor-icons/react';
import type { SalonNotification } from '@/shared/api/types';
import { formatNotificationListStamp, NOTIFICATION_TYPE_LABELS } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { getEffectiveStatus } from '@/shared/lib/notifications/notificationDelivery';
import styles from './header-notifications.module.css';

interface HeaderNotificationItemProps {
  item: SalonNotification;
}

export function HeaderNotificationItem({ item }: HeaderNotificationItemProps) {
  const { t } = useI18n();
  const unread = getEffectiveStatus(item) === 'pending';
  const typeLabel = NOTIFICATION_TYPE_LABELS[item.type] ?? item.type;
  const showBody = Boolean(item.body) && item.body !== item.title;

  return (
    <div className={styles.item}>
      <div className={styles.itemIcon}>
        <BellRingingIcon size={16} />
      </div>
      <div className={styles.itemBody}>
        <div className={styles.itemText}>
          <p className={styles.itemTitle}>{item.title ?? t('notifications.resolveTitle')}</p>
          {showBody ? <p className={styles.itemDescription}>{item.body}</p> : null}
          <div className={styles.itemMeta}>
            <span>{formatNotificationListStamp(item.scheduled_at)}</span>
            <span>•</span>
            <span className={styles.itemType}>{typeLabel}</span>
          </div>
        </div>
        {unread ? <span className={styles.unreadDot} aria-label={t('notifications.unread')} /> : null}
      </div>
    </div>
  );
}
