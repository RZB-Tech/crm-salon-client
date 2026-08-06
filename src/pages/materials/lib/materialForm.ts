import type { Material, MeasurementUnit } from '@/shared/api/types';
import { MEASUREMENT_UNIT_LABELS } from '@/shared/lib/format';

export const MEASUREMENT_OPTIONS = Object.entries(MEASUREMENT_UNIT_LABELS).map(
  ([value, label]) => ({ value, label })
);

export interface MaterialFormState {
  article: string;
  name: string;
  description: string;
  quantity: number;
  measurement_unit: MeasurementUnit;
  volume: number;
  sell_price: number;
}

export const emptyMaterialForm = (): MaterialFormState => ({
  article: '',
  name: '',
  description: '',
  quantity: 0,
  measurement_unit: 'piece',
  volume: 0,
  sell_price: 0
});

export const materialToForm = (m: Material): MaterialFormState => ({
  article: m.article,
  name: m.name,
  description: m.description ?? '',
  quantity: m.quantity,
  measurement_unit: m.measurement_unit,
  volume: m.volume,
  sell_price: m.sell_price
});
