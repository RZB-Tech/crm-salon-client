import type { BaseEntity } from './common';

export type PromotionType = 'percentage' | 'fixed_amount';

export interface Promotion extends BaseEntity {
  name: string;
  promo_type: PromotionType;
  service_id: number | null;
  material_id: number | null;
  discount_value: number | null;
  description: string | null;
  start_time: string | null;
  end_time: string | null;
  /** Может отсутствовать в ответе API — схема GET его не отдаёт. */
  is_active?: boolean;
}

export interface PromotionCreatePayload {
  name: string;
  promo_type: PromotionType;
  service_id?: number | null;
  material_id?: number | null;
  discount_value: number;
  description?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  is_active?: boolean | null;
}

export interface PromotionUpdatePayload {
  id: number;
  name?: string | null;
  promo_type?: PromotionType | null;
  service_id?: number | null;
  material_id?: number | null;
  discount_value?: number | null;
  description?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  is_active?: boolean | null;
  archived?: boolean | null;
}
