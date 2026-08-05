import type { AbsenceType, BaseEntity, PayrollType } from './common';
import type { Service } from './service';

export interface Employee extends BaseEntity {
  firstname: string;
  lastname: string | null;
  middlename: string | null;
  phone: string | null;
  birth_date: string;
  active: boolean;
  specialization_id: number | null;
  services: Service[];
  salary_fixed: number;
  percent_from_services: number;
  percent_from_sales: number;
}

export interface EmployeeCreatePayload {
  firstname: string;
  lastname?: string | null;
  middlename?: string | null;
  phone?: string | null;
  birth_date: string;
  active?: boolean;
  specialization_id?: number | null;
  services_ids?: number[];
  salary_fixed?: number;
  percent_from_services?: number;
  percent_from_sales?: number;
}

export interface EmployeeUpdatePayload {
  id: number;
  firstname?: string;
  lastname?: string | null;
  middlename?: string | null;
  phone?: string | null;
  birth_date?: string;
  active?: boolean;
  specialization_id?: number | null;
  services?: number[];
  salary_fixed?: number;
  percent_from_services?: number;
  percent_from_sales?: number;
}

export interface WorkScheduleDay extends BaseEntity {
  day: number;
  start_time: string;
  end_time: string;
}

export interface WorkSchedule {
  employee_id: number;
  work_schedules: WorkScheduleDay[];
}

export interface WorkScheduleDayInput {
  day: number;
  start_time: string;
  end_time: string;
}

export interface WorkScheduleCreatePayload {
  employee_id: number;
  work_schedules: WorkScheduleDayInput[];
}

export interface WorkScheduleItemUpdatePayload {
  id: number;
  start_time: string;
  end_time: string;
}

export interface WorkScheduleUpdatePayload {
  work_schedules: WorkScheduleItemUpdatePayload[];
}

export interface Absence extends BaseEntity {
  employee_id: number;
  start_date: string;
  end_date: string;
  absence_type: AbsenceType;
  reason: string | null;
}

export interface AbsenceCreatePayload {
  employee_id: number;
  start_date: string;
  end_date: string;
  absence_type: AbsenceType;
  reason?: string | null;
}

export interface AbsenceUpdatePayload {
  id: number;
  start_date?: string;
  end_date?: string;
  absence_type?: AbsenceType;
  reason?: string | null;
}

export interface EmployeeWorkScheduleResponse {
  work_schedules: WorkScheduleDay[];
  absences: Absence[];
}

export interface Payroll extends BaseEntity {
  employee_id: number;
  payout_id: number | null;
  amount: number;
  type: PayrollType;
  status: 'pending' | 'paid' | 'cancelled';
  notes: string | null;
  appointment_id: number | null;
  auto_genereted: boolean;
}

export interface PayrollCreatePayload {
  employee_id: number;
  amount: number;
  type: PayrollType;
  notes?: string | null;
  appointment_id?: number | null;
}

export interface PayrollUpdatePayload {
  id: number;
  employee_id?: number;
  amount?: number;
  type?: PayrollType;
  notes?: string | null;
  appointment_id?: number | null;
}
