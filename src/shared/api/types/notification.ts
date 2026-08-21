import type { BaseEntity } from './common';

export type SalonNotificationType = 'reminder' | 'other';

export type SalonNotificationStatus = 'pending' | 'read' | 'cancelled';

export interface SalonNotificationWsPayload {
  id: number;
  client_id: number | null;
  type: SalonNotificationType;
  title: string | null;
  body: string;
  scheduled_at: string;
  delivered_at: string | null;
}

export interface SalonNotification extends BaseEntity {
  client_id: number | null;
  title: string | null;
  body: string;
  type: SalonNotificationType;
  status?: SalonNotificationStatus;
  notes?: string | null;
  scheduled_at: string;
  delivered_at: string | null;
}

export interface SalonNotificationReadPayload {
  id: number;
  notes: string;
}

export interface SalonNotificationCancelPayload {
  id: number;
  notes: string;
}

export interface SalonNotificationCreatePayload {
  client_id?: number | null;
  title?: string | null;
  body: string;
  type?: SalonNotificationType;
  scheduled_at: string;
}
