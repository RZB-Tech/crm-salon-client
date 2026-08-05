import type { BaseEntity } from './common';

export interface ServiceCategory extends BaseEntity {
  name: string;
}

export interface Service extends BaseEntity {
  name: string;
  price: number;
  category_id: number | null;
  estimated_time: number;
}

export interface ServiceCreatePayload {
  name: string;
  category_id?: number | null;
  estimated_time?: number | null;
}

export interface ServiceUpdatePayload {
  id: number;
  name?: string;
  price?: number;
  category_id?: number | null;
  estimated_time?: number | null;
}

export interface ServiceCategoryCreatePayload {
  name: string;
}

export interface ServiceCategoryUpdatePayload {
  id: number;
  name?: string;
}

export interface ServicesImportResult {
  created_categories: number;
  created_services: number;
}
