import type { Appointment } from '@/shared/api/types';
import { isLineFilled, type AppointmentFormValues } from '../appointmentForm';

export const detectStructureTouched = (
  record: NonNullable<Appointment['records']>[number] | undefined,
  values: AppointmentFormValues,
): boolean => {
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
};
