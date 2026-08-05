import type { SalonNotification, SalonNotificationWsPayload } from '@/shared/api/types';

export const RECONNECT_DELAY_MS = 5000;
export const POLL_INTERVAL_MS = 10_000;

export const toSalonNotification = (payload: SalonNotificationWsPayload): SalonNotification => ({
  id: payload.id,
  client_id: payload.client_id ?? null,
  title: payload.title,
  body: payload.body,
  type: payload.type,
  status: 'pending',
  scheduled_at: payload.scheduled_at,
  delivered_at: payload.delivered_at ?? new Date().toISOString(),
  created_at: payload.scheduled_at,
  updated_at: payload.scheduled_at,
  archived: false,
});
