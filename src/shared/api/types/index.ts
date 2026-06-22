export type Sex = 'male' | 'female';

export type PayrollType = 'salary' | 'bonus' | 'penalty' | 'commission';

export type AbsenceType = 'sick' | 'vacation' | 'day off' | 'weekend' | 'other';

export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface Client extends BaseEntity {
  firstname: string;
  lastname: string | null;
  middlename: string | null;
  phone: string | null;
  birth_date: string | null;
  sex: Sex;
  deposit: number;
  notes: string | null;
}

export interface ClientCreatePayload {
  firstname: string;
  lastname?: string | null;
  middlename?: string | null;
  phone?: string | null;
  birth_date?: string | null;
  sex: Sex;
  deposit?: number;
  notes?: string | null;
}

export interface ClientUpdatePayload {
  id: number;
  firstname?: string;
  lastname?: string | null;
  middlename?: string | null;
  phone?: string | null;
  birth_date?: string | null;
  sex?: Sex;
  notes?: string | null;
}

export interface ClientDepositPayload {
  id: number;
  operation: 1 | -1;
  amount: number;
}

export interface ServiceCategory extends BaseEntity {
  name: string;
}

export interface Service extends BaseEntity {
  name: string;
  price: number;
  category_id: number | null;
}

export interface ServiceCreatePayload {
  name: string;
  category_id?: number | null;
}

export interface ServiceUpdatePayload {
  id: number;
  name?: string;
  category_id?: number | null;
}

export interface ServiceCategoryCreatePayload {
  name: string;
}

export interface ServiceCategoryUpdatePayload {
  id: number;
  name?: string;
}

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

export interface WorkSchedule extends BaseEntity {
  employee_id: number;
  day: string;
  start_time: string;
  end_time: string;
}

export interface WorkScheduleCreatePayload {
  employee_id: number;
  day: string;
  start_time: string;
  end_time: string;
}

export interface WorkScheduleUpdatePayload {
  id: number;
  day?: string;
  start_time?: string;
  end_time?: string;
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
  work_schedules: WorkSchedule[];
  absences: Absence[];
}

export interface Payroll extends BaseEntity {
  employee_id: number;
  amount: number;
  type: PayrollType;
  notes: string | null;
  appointment_id: number | null;
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

export interface AppointmentServiceNested {
  id: number;
  appointment_record_id: number;
  service_id: number | null;
  service: { id: number; name: string } | null;
  material_id: number | null;
  quantity: number;
  price: number;
  notes: string | null;
}

export interface AppointmentRecordNested {
  id: number;
  appointment_id: number;
  employee_id: number;
  employee: { id: number; firstname: string; lastname: string | null } | null;
  services: AppointmentServiceNested[];
}

export interface Appointment extends BaseEntity {
  client_id: number;
  client: { id: number; firstname: string; lastname: string | null; phone: string | null } | null;
  start_time_est: string;
  end_time_est: string;
  paid: boolean;
  total_price: number;
  records: AppointmentRecordNested[] | null;
  notes: string | null;
}

export interface AppointmentServiceInput {
  service_id?: number | null;
  material_id?: number | null;
  quantity: number;
  price: number;
  notes?: string | null;
}

export interface AppointmentRecordInput {
  employee_id: number;
  services: AppointmentServiceInput[];
}

export interface AppointmentCreatePayload {
  client_id: number;
  start_time_est: string;
  end_time_est: string;
  records?: AppointmentRecordInput[];
  notes?: string | null;
}

export interface LoginPayload {
  login: string;
  password: string;
}
