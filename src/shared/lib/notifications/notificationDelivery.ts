import type { SalonNotification, SalonNotificationWsPayload } from '@/shared/api/types';
import type { SalonNotificationStatus } from '@/shared/api/types';

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
  if (notification.delivered_at) return true;
  return isNotificationDue(notification, nowMs);
};

export const getNotificationDelayMs = (
  notification: SalonNotification,
  nowMs = Date.now(),
): number => Math.max(0, new Date(notification.scheduled_at).getTime() - nowMs);
