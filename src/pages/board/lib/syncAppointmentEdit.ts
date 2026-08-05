import { apiDelete, apiPatch, apiPost } from '@/shared/api/client';
import type {
  Appointment,
  AppointmentCreatePayload,
  AppointmentRecordCreatePayload,
  AppointmentServiceCreatePayload,
  AppointmentServiceUpdatePayload,
  AppointmentStatus,
  AppointmentUpdatePayload,
} from '@/shared/api/types';
import {
  formLinesToCreatePayloads,
  formValuesToPayload,
  getLineReason,
  hasScheduleChanged,
  isLineFilled,
  type AppointmentFormValues,
  type AppointmentServiceLine,
} from './appointmentForm';

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

const lineFingerprint = (line: AppointmentServiceLine): string =>
  [
    line.kind,
    line.serviceId ?? '',
    line.materialId ?? '',
    line.quantity,
    line.price,
    line.notes.trim(),
    line.priceChangedReason.trim(),
  ].join('|');

const buildServiceUpdate = (
  line: AppointmentServiceLine,
): AppointmentServiceUpdatePayload | null => {
  if (!line.id || !isLineFilled(line)) return null;

  const payload: AppointmentServiceUpdatePayload = { id: line.id };
  if (line.kind === 'service') {
    payload.service_id = Number(line.serviceId);
  } else {
    payload.material_id = Number(line.materialId);
  }
  payload.quantity = line.quantity;
  payload.price = line.price;
  payload.notes = null;
  payload.price_changed_reason = getLineReason(line) || null;
  return payload;
};

const syncServiceLines = async (
  recordId: number,
  originalLines: AppointmentServiceLine[],
  nextLines: AppointmentServiceLine[],
) => {
  const originalById = new Map(
    originalLines.filter((line) => line.id != null).map((line) => [line.id!, line]),
  );
  const keptIds = new Set(
    nextLines.filter((line) => line.id != null && isLineFilled(line)).map((line) => line.id!),
  );

  for (const [id] of originalById) {
    if (!keptIds.has(id)) {
      await apiDelete<Appointment>(`/api/v1/appointments-services/${id}`);
    }
  }

  for (const line of nextLines.filter(isLineFilled)) {
    if (line.id && originalById.has(line.id)) {
      const original = originalById.get(line.id)!;
      if (lineFingerprint(original) === lineFingerprint(line)) continue;
      const payload = buildServiceUpdate(line);
      if (payload) {
        await apiPatch<Appointment, AppointmentServiceUpdatePayload>(
          '/api/v1/appointments-services',
          payload,
        );
      }
      continue;
    }

    const [createPayload] = formLinesToCreatePayloads(recordId, [line]);
    await apiPost<Appointment, AppointmentServiceCreatePayload>(
      '/api/v1/appointments-services',
      createPayload as AppointmentServiceCreatePayload,
    );
  }
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
  const structureTouched =
    employeeChanged ||
    (() => {
      if (!record) return values.services.some(isLineFilled);
      const original = record.services.map((item) =>
        [
          item.id,
          item.service_id,
          item.material_id,
          item.quantity,
          item.price,
          item.notes ?? '',
          item.price_changed_reason ?? '',
        ].join('|'),
      );
      const next = values.services.filter(isLineFilled).map((line) =>
        [
          line.id ?? 'new',
          line.serviceId,
          line.materialId,
          line.quantity,
          line.price,
          line.notes.trim(),
          line.priceChangedReason.trim(),
        ].join('|'),
      );
      if (original.length !== next.length) return true;
      return original.some((value, index) => value !== next[index]);
    })();

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

    // Create first, archive only after success — otherwise a failed POST
    // would leave the original appointment archived with no replacement.
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
      // New appointment exists; roll it back so the user is not left with duplicates.
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

  const originalLines: AppointmentServiceLine[] = record.services.map((item) => ({
    key: String(item.id),
    id: item.id,
    kind: item.material_id != null ? 'material' : 'service',
    serviceId: item.service_id != null ? String(item.service_id) : null,
    materialId: item.material_id != null ? String(item.material_id) : null,
    quantity: item.quantity,
    price: item.price,
    catalogPrice: item.price,
    priceChangedReason: item.price_changed_reason ?? '',
    notes: item.notes ?? '',
  }));

  await syncServiceLines(record.id, originalLines, values.services);
  return 'updated';
};
