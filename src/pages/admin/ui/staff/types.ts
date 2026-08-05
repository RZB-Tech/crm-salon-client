import type { StaffType } from '@/shared/api/types';

export interface CreateForm {
  login: string;
  firstname: string;
  lastname: string;
  staff_type: StaffType;
  employee_id: string;
  password: string;
}

export const INITIAL_FORM: CreateForm = {
  login: '',
  firstname: '',
  lastname: '',
  staff_type: 'employee',
  employee_id: '',
  password: '',
};

export type StaffTabHandle = {
  openCreate: () => void;
};
