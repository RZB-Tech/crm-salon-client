import type { Promotion } from '@/shared/api/types';
import { formatDate, formatPrice } from '@/shared/lib/format';

export type PromotionPeriodStatus = 'active' | 'off' | 'upcoming' | 'expired' | 'archived';

export const PROMOTION_STATUS_LABELS: Record<PromotionPeriodStatus, string> = {
  active: 'Активна',
  off: 'Выключена',
  upcoming: 'Не началась',
  expired: 'Истекла',
  archived: 'Архив',
};

export const PROMOTION_STATUS_COLORS: Record<PromotionPeriodStatus, string> = {
  active: 'teal',
  off: 'gray',
  upcoming: 'blue',
  expired: 'orange',
  archived: 'gray',
};

export const getPromotionStatus = (
  promo: Promotion,
  now = Date.now(),
): PromotionPeriodStatus => {
  if (promo.archived) return 'archived';
  if (promo.is_active === false) return 'off';
  if (promo.start_time && new Date(promo.start_time).getTime() > now) return 'upcoming';
  if (promo.end_time && new Date(promo.end_time).getTime() < now) return 'expired';
  return 'active';
};

export const isPromotionCurrentlyActive = (promo: Promotion, now = Date.now()): boolean =>
  getPromotionStatus(promo, now) === 'active';

export const formatDiscountLabel = (promo: Promotion): string => {
  const value = promo.discount_value ?? 0;
  if (promo.promo_type === 'percentage') return `${value}%`;
  return `−${formatPrice(value)}`;
};

export const formatPromotionPeriod = (promo: Promotion): string => {
  if (!promo.start_time && !promo.end_time) return 'Бессрочно';
  const start = promo.start_time ? formatDate(promo.start_time) : '…';
  const end = promo.end_time ? formatDate(promo.end_time) : '…';
  return `${start} – ${end}`;
};

export const applyPromotionDiscount = (basePrice: number, promo: Promotion): number => {
  const value = promo.discount_value ?? 0;
  if (promo.promo_type === 'fixed_amount') {
    return Math.max(0, basePrice - value);
  }
  return Math.max(0, Math.round(basePrice - (basePrice * value) / 100));
};

export const findActivePromotion = (
  promotions: Promotion[],
  kind: 'service' | 'material',
  targetId: number | string | null,
): Promotion | undefined => {
  if (targetId == null || targetId === '') return undefined;
  const id = Number(targetId);
  return promotions.find((promo) => {
    if (!isPromotionCurrentlyActive(promo)) return false;
    return kind === 'service' ? promo.service_id === id : promo.material_id === id;
  });
};
