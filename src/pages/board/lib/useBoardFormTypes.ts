import type { AppointmentCancelledReason, Material, Service } from '@/shared/api/types';
import type { formValuesToPayload } from './appointmentForm';

export const DEFAULT_CANCEL_REASON: AppointmentCancelledReason = 'mistaken input';

export interface UseBoardFormOptions {
  date: Date;
  services: Service[];
  materials: Material[];
  createAppointment: {
    mutate: (
      payload: ReturnType<typeof formValuesToPayload>,
      opts?: { onSuccess?: () => void },
    ) => void;
    isPending: boolean;
  };
  archiveAppointment: {
    mutate: (id: number, opts?: { onSuccess?: () => void }) => void;
    isPending: boolean;
  };
  restoreAppointment: {
    mutate: (id: number, opts?: { onSuccess?: () => void }) => void;
    isPending: boolean;
  };
  cancelAppointment: {
    mutate: (
      payload: { id: number; reason: AppointmentCancelledReason },
      opts?: { onSuccess?: () => void },
    ) => void;
    isPending: boolean;
  };
}
