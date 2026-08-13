import type { Promotion, PromotionCreatePayload, PromotionUpdatePayload, PromotionType } from '@/shared/api/types';
import { parseApiDateFromDateTime } from '@/shared/lib/format';

export type PromotionTargetKind = 'service' | 'material';

export interface PromotionFormState {
  name: string;
  targetKind: PromotionTargetKind;
  targetId: string | null;
  promoType: PromotionType;
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  description: string;
}

export const emptyPromotionForm = (): PromotionFormState => ({
  name: '',
  targetKind: 'service',
  targetId: null,
  promoType: 'percentage',
  discountValue: 10,
  startDate: '',
  endDate: '',
  isActive: true,
  description: '',
});

const dateFromApi = (value: string | null): string => {
  if (!value) return '';
  return parseApiDateFromDateTime(value);
};

const dateToApi = (value: string, endOfDay: boolean): string | null => {
  if (!value) return null;
  return endOfDay ? `${value}T23:59:59` : `${value}T00:00:00`;
};

export const promotionToForm = (promo: Promotion): PromotionFormState => ({
  name: promo.name,
  targetKind: promo.material_id != null ? 'material' : 'service',
  targetId:
    promo.material_id != null
      ? String(promo.material_id)
      : promo.service_id != null
        ? String(promo.service_id)
        : null,
  promoType: promo.promo_type,
  discountValue: promo.discount_value ?? 0,
  startDate: dateFromApi(promo.start_time),
  endDate: dateFromApi(promo.end_time),
  isActive: promo.is_active !== false,
  description: promo.description ?? '',
});

export const isPromotionFormValid = (form: PromotionFormState): boolean => {
  if (!form.name.trim() || !form.targetId || form.discountValue < 1) return false;
  if (form.promoType === 'percentage' && form.discountValue > 100) return false;
  if (form.startDate && form.endDate && form.endDate <= form.startDate) return false;
  return true;
};

export const formToCreatePayload = (form: PromotionFormState): PromotionCreatePayload => ({
  name: form.name.trim(),
  promo_type: form.promoType,
  service_id: form.targetKind === 'service' ? Number(form.targetId) : null,
  material_id: form.targetKind === 'material' ? Number(form.targetId) : null,
  discount_value: form.discountValue,
  description: form.description.trim() || null,
  start_time: dateToApi(form.startDate, false),
  end_time: dateToApi(form.endDate, true),
  is_active: form.isActive,
});

export const formToUpdatePayload = (
  id: number,
  form: PromotionFormState,
  original?: Promotion | null,
): PromotionUpdatePayload => {
  const created = formToCreatePayload(form);
  const payload: PromotionUpdatePayload = {
    id,
    name: created.name,
    promo_type: created.promo_type,
    discount_value: created.discount_value,
    description: created.description,
    start_time: created.start_time,
    end_time: created.end_time,
    is_active: created.is_active,
  };

  const originalId = original?.material_id ?? original?.service_id ?? null;
  const originalKind: PromotionTargetKind =
    original?.material_id != null ? 'material' : 'service';
  const nextId = Number(form.targetId);
  if (!original || originalKind !== form.targetKind || originalId !== nextId) {
    payload.service_id = created.service_id;
    payload.material_id = created.material_id;
  }

  return payload;
};
