export type Sex = 'male' | 'female';

export type PayrollType = 'salary' | 'bonus' | 'penalty' | 'commission';

export type AbsenceType = 'sick' | 'vacation' | 'day off' | 'weekend' | 'other';

export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
  archived: boolean;
}

export interface Specialization {
  id: number;
  name: string;
}

export interface SpecializationCreatePayload {
  name: string;
}

export interface SpecializationUpdatePayload {
  id: number;
  name: string;
}
