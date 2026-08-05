import { apiDelete, apiPatch, apiPost } from '@/shared/api/client';
import type {
  Appointment,
  AppointmentServiceCreatePayload,
  AppointmentServiceUpdatePayload,
} from '@/shared/api/types';
import {
  formLinesToCreatePayloads,
  getLineReason,
  isLineFilled,
  type AppointmentServiceLine,
} from '../appointmentForm';

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

export const syncServiceLines = async (
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

export const mapRecordToLines = (
  services: NonNullable<Appointment['records']>[number]['services'],
): AppointmentServiceLine[] =>
  services.map((item) => ({
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
