import type { BaseEntity } from './common';

export type MeasurementUnit =
  | 'piece'
  | 'pack'
  | 'box'
  | 'bottle'
  | 'milliliter'
  | 'liter'
  | 'gramm'
  | 'kilogram';

export interface Material extends BaseEntity {
  article: string;
  name: string;
  description: string | null;
  quantity: number;
  measurement_unit: MeasurementUnit;
  volume: number;
  sell_price: number;
}

export interface MaterialCreatePayload {
  article: string;
  name: string;
  description?: string | null;
  quantity?: number;
  measurement_unit?: MeasurementUnit;
  volume?: number;
  sell_price?: number;
}

export interface MaterialUpdatePayload {
  id: number;
  article?: string;
  name?: string;
  description?: string | null;
  measurement_unit?: MeasurementUnit;
  volume?: number;
  sell_price?: number;
}

export interface MaterialQuantityPayload {
  id: number;
  operation: 1 | -1;
  quantity: number;
}
