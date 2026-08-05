import { apiDelete, apiPatch, apiPost } from '@/shared/api/client';
import type {
  Appointment,
  AppointmentCreatePayload,
  AppointmentRecordCreatePayload,
  AppointmentStatus,
  AppointmentUpdatePayload,
} from '@/shared/api/types';
import {
  formLinesToCreatePayloads,
  formValuesToPayload,
  hasScheduleChanged,
  type AppointmentFormValues,
} from '../appointmentForm';
import { detectStructureTouched } from './structureChanges';
import { mapRecordToLines, syncServiceLines } from './serviceLines';

export class AppointmentEditBlockedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppointmentEditBlockedError';
  }
}

interface SyncAppointmentEditParams {
  appointment: Appointment;
  values: AppointmentFormValues;
  editingEmployeeId: number;
  hasActiveReceipt: boolean;
}

const editableStatus = (status: AppointmentStatus): AppointmentStatus | null => {
  if (status === 'awaiting' || status === 'started' || status === 'finished') return status;
  return null;
};

/**
 * Порядок операций при редактировании:
 * 1. status / notes — PATCH /appointments (можно всегда, кроме cancelled)
 * 2. клиент / время — API не поддерживает; только create + archive (если нет активного чека)
 * 3. сотрудник / услуги / товары — только без активного чека
 * 4. оплата — отдельно: создать чек → make_payment; правка состава — сначала cancel receipt
 */
export const syncAppointmentEdit = async ({
  appointment,
  values,
  editingEmployeeId,
  hasActiveReceipt,
}: SyncAppointmentEditParams): Promise<'updated' | 'recreated'> => {
  const record =
    appointment.records?.find((item) => item.employee_id === editingEmployeeId) ??
    appointment.records?.[0];

  const scheduleChanged = hasScheduleChanged(appointment, values);
  const employeeChanged =
    record != null && Number(values.employeeId) !== record.employee_id;
  const structureTouched = employeeChanged || detectStructureTouched(record, values);

  if ((scheduleChanged || structureTouched) && hasActiveReceipt) {
    throw new AppointmentEditBlockedError(
      'Сначала отмените активный чек — иначе нельзя менять время, клиента, мастера или состав услуг',
    );
  }

  if (scheduleChanged) {
    if (appointment.paid) {
      throw new AppointmentEditBlockedError(
        'Нельзя пересоздать оплаченную запись. Сначала отмените чек',
      );
    }

    const createPayload = formValuesToPayload(values);
    const created = await apiPost<Appointment, AppointmentCreatePayload>(
      '/api/v1/appointments',
      createPayload,
    );

    try {
      await apiPatch<Appointment, AppointmentUpdatePayload>('/api/v1/appointments', {
        id: appointment.id,
        archived: true,
      });
    } catch (archiveError) {
      try {
        await apiPatch<Appointment, AppointmentUpdatePayload>('/api/v1/appointments', {
          id: created.id,
          archived: true,
        });
      } catch {
        // Best-effort cleanup; rethrow the original archive failure.
      }
      throw archiveError;
    }

    const status = editableStatus(values.status);
    if (status && status !== 'awaiting') {
      await apiPatch<Appointment, AppointmentUpdatePayload>('/api/v1/appointments', {
        id: created.id,
        status,
      });
    }
    return 'recreated';
  }

  const patch: AppointmentUpdatePayload = { id: appointment.id };
  let needsPatch = false;

  if (values.notes !== (appointment.notes ?? '')) {
    patch.notes = values.notes || null;
    needsPatch = true;
  }

  const nextStatus = editableStatus(values.status);
  if (
    nextStatus &&
    appointment.status !== 'cancelled' &&
    nextStatus !== appointment.status
  ) {
    patch.status = nextStatus;
    needsPatch = true;
  }

  if (needsPatch) {
    await apiPatch<Appointment, AppointmentUpdatePayload>('/api/v1/appointments', patch);
  }

  if (!structureTouched) {
    return 'updated';
  }

  if (!record || employeeChanged) {
    if (record) {
      await apiDelete<Appointment>(`/api/v1/appointments-records/${record.id}`);
    }

    const services = formLinesToCreatePayloads(0, values.services).map(
      ({ appointment_record_id: _ignored, ...rest }) => ({
        ...rest,
        price: rest.price ?? undefined,
      }),
    );

    const recordPayload: AppointmentRecordCreatePayload = {
      appointment_id: appointment.id,
      employee_id: Number(values.employeeId),
      services,
    };

    await apiPost<Appointment, AppointmentRecordCreatePayload>(
      '/api/v1/appointments-records',
      recordPayload,
    );
    return 'updated';
  }

  await syncServiceLines(record.id, mapRecordToLines(record.services), values.services);
  return 'updated';
};
