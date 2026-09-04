import type { SalonNotification, SalonNotificationStatus, SalonNotificationWsPayload } from '@/shared/api/types';
import { t } from '@/shared/lib/i18n';

export const getSalonNotificationCopy = (item: {
  title: string | null;
  body: string;
  type: SalonNotification['type'];
}): { title: string; body: string } => {
  const rawTitle = item.title?.trim() ?? '';
  const rawBody = item.body?.trim() ?? '';
  const title =
    rawTitle ||
    (item.type === 'reminder' ? t('notifications.reminderFallback') : t('notifications.newItem'));
  const body = rawBody && rawBody !== rawTitle ? rawBody : '';
  return { title, body };
};

/** Вычисляет эффективный статус уведомления (fallback когда бэк не отдаёт status) */
export const getEffectiveStatus = (n: SalonNotification): SalonNotificationStatus => {
  if (n.status) return n.status;
  if (n.delivered_at) return 'read';
  return 'pending';
};

export const toNotificationWsPayload = (
  notification: SalonNotification,
): SalonNotificationWsPayload => ({
  id: notification.id,
  client_id: notification.client_id,
  title: notification.title,
  body: notification.body,
  type: notification.type,
  scheduled_at: notification.scheduled_at,
  delivered_at: notification.delivered_at,
});

export const isNotificationDue = (notification: SalonNotification, nowMs = Date.now()): boolean =>
  new Date(notification.scheduled_at).getTime() <= nowMs;

export const shouldShowNotification = (
  notification: SalonNotification,
  shownIds: ReadonlySet<number>,
  nowMs = Date.now(),
): boolean => {
  if (shownIds.has(notification.id)) return false;
  const status = getEffectiveStatus(notification);
  if (status === 'read' || status === 'cancelled') return false;
  if (notification.delivered_at) return true;
  return isNotificationDue(notification, nowMs);
};

export const getNotificationDelayMs = (
  notification: SalonNotification,
  nowMs = Date.now(),
): number => Math.max(0, new Date(notification.scheduled_at).getTime() - nowMs);
