import type { AppointmentStatus } from '@/shared/api/types';

export type LineKind = 'service' | 'material';

export interface AppointmentServiceLine {
  key: string;
  id?: number;
  kind: LineKind;
  serviceId: string | null;
  materialId: string | null;
  quantity: number;
  price: number;
  catalogPrice: number;
  priceChangedReason: string;
  notes: string;
}

export interface AppointmentFormValues {
  clientId: string | null;
  employeeId: string | null;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  services: AppointmentServiceLine[];
  notes: string;
}

export interface ServiceOption {
  value: string;
  label: string;
  price: number;
  estimatedTime: number;
}

export interface MaterialOption {
  value: string;
  label: string;
  price: number;
}
