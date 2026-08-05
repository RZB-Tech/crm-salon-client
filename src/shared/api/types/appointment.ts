import type { BaseEntity } from './common';

export interface AppointmentServiceNested {
  id: number;
  appointment_record_id: number;
  service_id: number | null;
  service: { id: number; name: string } | null;
  material_id: number | null;
  quantity: number;
  price: number;
  price_changed_reason: string | null;
  notes: string | null;
}

export interface AppointmentRecordNested {
  id: number;
  appointment_id: number;
  employee_id: number;
  employee: { id: number; firstname: string; lastname: string | null } | null;
  services: AppointmentServiceNested[];
}

export type AppointmentStatus = 'awaiting' | 'started' | 'finished' | 'cancelled';

export type AppointmentCancelledReason =
  | 'client changed his mind'
  | 'mistaken input'
  | 'incorrect client'
  | 'incorrect date';

export interface Appointment extends BaseEntity {
  /** Может отсутствовать в ответе API — тогда брать `client.id` */
  client_id?: number;
  client: { id: number; firstname: string; lastname: string | null; phone: string | null } | null;
  start_time_est: string;
  end_time_est: string;
  status: AppointmentStatus;
  paid: boolean;
  total_price: number;
  records: AppointmentRecordNested[] | null;
  notes: string | null;
  cancelled_reason: AppointmentCancelledReason | null;
}

export interface AppointmentServiceInput {
  service_id?: number | null;
  material_id?: number | null;
  quantity: number;
  price?: number | null;
  price_changed_reason?: string | null;
  notes?: string | null;
}

export interface AppointmentRecordInput {
  employee_id: number;
  services: AppointmentServiceInput[];
}

export interface AppointmentCreatePayload {
  client_id: number;
  start_time_est: string;
  end_time_est: string;
  records?: AppointmentRecordInput[];
  notes?: string | null;
}

export interface AppointmentRecord extends BaseEntity {
  appointment_id: number;
  employee_id: number;
  employee: {
    id: number;
    firstname: string;
    lastname: string | null;
    specialization: string | null;
  } | null;
  services: AppointmentServiceRecord[];
}

export interface AppointmentServiceRecord extends BaseEntity {
  appointment_record_id: number;
  service_id: number;
  service: { id: number; name: string } | null;
  material_id: number | null;
  quantity: number;
  price: number;
  price_changed_reason: string | null;
  notes: string | null;
}

export interface AppointmentServiceCreatePayload {
  appointment_record_id?: number | null;
  service_id?: number | null;
  material_id?: number | null;
  quantity?: number;
  price?: number | null;
  price_changed_reason?: string | null;
  notes?: string | null;
}

export interface AppointmentRecordCreatePayload {
  appointment_id: number;
  employee_id: number;
  services: Omit<AppointmentServiceCreatePayload, 'appointment_record_id'>[];
}

export interface AppointmentUpdatePayload {
  id: number;
  status?: AppointmentStatus | null;
  notes?: string | null;
  archived?: boolean | null;
}

export interface AppointmentCancelPayload {
  id: number;
  reason: AppointmentCancelledReason;
}

export interface AppointmentServiceUpdatePayload {
  id: number;
  service_id?: number | null;
  material_id?: number | null;
  quantity?: number;
  price?: number;
  price_changed_reason?: string | null;
  notes?: string | null;
}
