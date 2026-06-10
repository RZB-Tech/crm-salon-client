export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Sex = 'male' | 'female';

export type PaymentType =
  | 'salary'
  | 'bonus'
  | 'penalty'
  | 'percent from services'
  | 'percent from sefl services'
  | 'percent from sales'
  | 'percent from self sales'
  | 'precent from attracting client'
  | 'precent from developing client';

export interface WorkSchedule {
  id: number;
  createdAt: string;
  updatedAt: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  employee: number;
}

export interface SalaryPayment {
  id: number;
  createdAt: string;
  updatedAt: string;
  paymentType: PaymentType;
  amount: string;
  note: string;
  employee: number;
}

export interface Employee {
  id: number;
  schedules: WorkSchedule[];
  salaryPayments: SalaryPayment[];
  createdAt: string;
  updatedAt: string;
  firstname: string;
  lastname: string | null;
  middlename: string | null;
  phone: string | null;
  email: string | null;
  birthDate: string;
  active: boolean;
  salary_fixed: string | null;
  precent_from_services: string | null;
  precent_from_sales: string | null;
  precent_from_self_services: string | null;
  precent_from_self_sales: string | null;
  precent_from_attract_client: string | null;
  precent_from_develop_client: string | null;
  specialization: number | null;
  services: number[];
}

export interface PatchedEmployee {
  firstname?: string;
  lastname?: string | null;
  middlename?: string | null;
  phone?: string | null;
  email?: string | null;
  birthDate?: string;
  active?: boolean;
  salary_fixed?: string | null;
  precent_from_services?: string | null;
  precent_from_sales?: string | null;
  precent_from_self_services?: string | null;
  precent_from_self_sales?: string | null;
  precent_from_attract_client?: string | null;
  precent_from_develop_client?: string | null;
  specialization?: number | null;
  services?: number[];
}

export interface CreateEmployeePayload {
  firstname: string;
  lastname?: string | null;
  middlename?: string | null;
  phone?: string | null;
  email?: string | null;
  birthDate: string;
  active?: boolean;
  salary_fixed?: string | null;
  precent_from_services?: string | null;
  precent_from_sales?: string | null;
  precent_from_self_services?: string | null;
  precent_from_self_sales?: string | null;
  precent_from_attract_client?: string | null;
  precent_from_develop_client?: string | null;
  specialization?: number | null;
  services?: number[];
}

export interface Client {
  id: number;
  addedBy: number;
  createdAt: string;
  updatedAt: string;
  firstname: string;
  lastname: string | null;
  middlename: string | null;
  sex: Sex;
  phone: string | null;
  email: string | null;
  birthDate: string;
  city: string | null;
  notes: string;
}

export interface PatchedClient {
  firstname?: string;
  lastname?: string | null;
  middlename?: string | null;
  sex?: Sex;
  phone?: string | null;
  email?: string | null;
  birthDate?: string;
  city?: string | null;
  notes?: string;
}

export interface CreateClientPayload {
  firstname: string;
  lastname?: string | null;
  middlename?: string | null;
  sex: Sex;
  phone?: string | null;
  email?: string | null;
  birthDate: string;
  city?: string | null;
  notes?: string;
}

export interface ServiceCategory {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
}

export interface Service {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  price: string;
  category: number | null;
}

export interface PatchedService {
  name?: string;
  price?: string;
  category?: number | null;
}

export interface CreateServicePayload {
  name: string;
  price: string;
  category?: number | null;
}

export interface PatchedServiceCategory {
  name?: string;
}

export interface CreateServiceCategoryPayload {
  name: string;
}

export interface Schedule extends WorkSchedule {}

export interface PatchedSchedule {
  dayOfWeek?: DayOfWeek;
  startTime?: string;
  endTime?: string;
  employee?: number;
}

export interface CreateSchedulePayload {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  employee: number;
}

export interface Salary {
  id: number;
  createdAt: string;
  updatedAt: string;
  paymentType: PaymentType;
  amount: string;
  note: string;
  employee: number;
}

export interface PatchedSalary {
  paymentType?: PaymentType;
  amount?: string;
  note?: string;
  employee?: number;
}

export interface CreateSalaryPayload {
  paymentType: PaymentType;
  amount: string;
  note?: string;
  employee: number;
}

export type FinanceReport = Record<string, number>;
