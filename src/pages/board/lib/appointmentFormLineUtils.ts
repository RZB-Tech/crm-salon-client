import type { LineKind, AppointmentServiceLine } from './appointmentFormTypes';

export const createEmptyServiceLine = (kind: LineKind = 'service'): AppointmentServiceLine => ({
  key: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  kind,
  serviceId: null,
  materialId: null,
  quantity: 1,
  price: 0,
  catalogPrice: 0,
  priceChangedReason: '',
  notes: '',
});

export const calcServicesTotal = (lines: AppointmentServiceLine[]): number =>
  lines.reduce((sum, line) => sum + line.quantity * line.price, 0);

export const isLineFilled = (line: AppointmentServiceLine): boolean =>
  line.kind === 'service' ? Boolean(line.serviceId) : Boolean(line.materialId);

export const isPriceChanged = (line: AppointmentServiceLine): boolean =>
  isLineFilled(line) && line.price !== line.catalogPrice;

/** Текст поля «Заметка» в строке услуги → price_changed_reason */
export const getLineReason = (line: AppointmentServiceLine): string =>
  line.priceChangedReason.trim();
