import type { AppointmentServiceNested, Promotion } from '@/shared/api/types';
import { applyPromotionDiscount, findActivePromotion } from '@/pages/promotions/lib/promotionHelpers';
import type { AppointmentServiceLine, LineKind } from './appointmentFormTypes';

export const createEmptyServiceLine = (kind: LineKind = 'service'): AppointmentServiceLine => ({
  key: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  kind,
  serviceId: null,
  materialId: null,
  quantity: 1,
  price: 0,
  catalogPrice: 0,
  promotionId: null,
  priceChangedReason: '',
  notes: '',
});

export const getNestedBasePrice = (item: AppointmentServiceNested): number =>
  item.base_price ?? item.price ?? item.final_price ?? 0;

export const getNestedFinalPrice = (item: AppointmentServiceNested): number =>
  item.final_price ?? item.price ?? item.base_price ?? 0;

export const mapNestedToLinePrices = (
  item: AppointmentServiceNested,
  catalogPrice: number,
): Pick<
  AppointmentServiceLine,
  'price' | 'catalogPrice' | 'basePrice' | 'finalPrice' | 'discountAmount' | 'promotionId'
> => {
  const base = getNestedBasePrice(item);
  return {
    price: base,
    catalogPrice: catalogPrice || base,
    basePrice: base,
    finalPrice: getNestedFinalPrice(item),
    discountAmount: item.discount_amount,
    promotionId: item.promotion_id ?? null,
  };
};

export interface LinePromoView {
  hasPromo: boolean;
  preview: boolean;
  base: number;
  final: number;
}

export const getLinePromoView = (
  line: AppointmentServiceLine,
  promotions: Promotion[] = [],
): LinePromoView => {
  const targetId = line.kind === 'service' ? line.serviceId : line.materialId;
  const catalogPromo = findActivePromotion(promotions, line.kind, targetId);
  const mappedBase = line.basePrice ?? line.price;
  const savedUnchanged = Boolean(line.id && line.promotionId && line.finalPrice != null && line.price === mappedBase);

  if (savedUnchanged) {
    return { hasPromo: true, preview: false, base: line.price, final: line.finalPrice ?? line.price };
  }

  if (catalogPromo) {
    return {
      hasPromo: true,
      preview: !line.id,
      base: line.price,
      final: applyPromotionDiscount(line.price, catalogPromo),
    };
  }

  return { hasPromo: false, preview: false, base: line.price, final: line.price };
};

export const getLineUnitFinal = (
  line: AppointmentServiceLine,
  promotions: Promotion[] = [],
): number => getLinePromoView(line, promotions).final;

export const calcServicesTotal = (
  lines: AppointmentServiceLine[],
  promotions: Promotion[] = [],
): number => lines.reduce((sum, line) => sum + line.quantity * getLineUnitFinal(line, promotions), 0);

export const isLineFilled = (line: AppointmentServiceLine): boolean =>
  line.kind === 'service' ? Boolean(line.serviceId) : Boolean(line.materialId);

export const isPriceChanged = (line: AppointmentServiceLine): boolean =>
  isLineFilled(line) && line.price !== line.catalogPrice;

/** Текст поля «Заметка» в строке услуги → price_changed_reason */
export const getLineReason = (line: AppointmentServiceLine): string =>
  line.priceChangedReason.trim();
