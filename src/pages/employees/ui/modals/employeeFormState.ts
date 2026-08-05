import type {
  Employee,
  EmployeeCreatePayload,
  EmployeeUpdatePayload,
} from '@/shared/api/types';

export interface EmployeeFormState {
  firstname: string;
  lastname: string;
  middlename: string;
  phone: string;
  birth_date: string;
  active: boolean;
  specialization_id: string | null;
  salary_fixed: number;
  percent_from_services: number;
  percent_from_sales: number;
  services_ids: string[];
}

export const emptyEmployeeForm = (): EmployeeFormState => ({
  firstname: '',
  lastname: '',
  middlename: '',
  phone: '',
  birth_date: new Date().toISOString().slice(0, 10),
  active: true,
  specialization_id: null,
  salary_fixed: 0,
  percent_from_services: 0,
  percent_from_sales: 0,
  services_ids: [],
});

export const employeeToForm = (employee: Employee): EmployeeFormState => ({
  firstname: employee.firstname,
  lastname: employee.lastname ?? '',
  middlename: employee.middlename ?? '',
  phone: employee.phone ?? '',
  birth_date: employee.birth_date,
  active: employee.active,
  specialization_id: employee.specialization_id != null ? String(employee.specialization_id) : null,
  salary_fixed: employee.salary_fixed,
  percent_from_services: employee.percent_from_services,
  percent_from_sales: employee.percent_from_sales,
  services_ids: (employee.services ?? []).map((s) => String(s.id)),
});

export const toCreatePayload = (form: EmployeeFormState): EmployeeCreatePayload => ({
  firstname: form.firstname,
  lastname: form.lastname || null,
  middlename: form.middlename || null,
  phone: form.phone || null,
  birth_date: form.birth_date,
  active: form.active,
  specialization_id: form.specialization_id ? Number(form.specialization_id) : null,
  salary_fixed: form.salary_fixed,
  percent_from_services: form.percent_from_services,
  percent_from_sales: form.percent_from_sales,
  services_ids: form.services_ids.map(Number),
});

export const toUpdatePayload = (id: number, form: EmployeeFormState): EmployeeUpdatePayload => ({
  id,
  firstname: form.firstname,
  lastname: form.lastname || null,
  middlename: form.middlename || null,
  phone: form.phone || null,
  birth_date: form.birth_date,
  active: form.active,
  specialization_id: form.specialization_id ? Number(form.specialization_id) : null,
  salary_fixed: form.salary_fixed,
  percent_from_services: form.percent_from_services,
  percent_from_sales: form.percent_from_sales,
  services: form.services_ids.map(Number),
});

export function validateEmployeeForm(form: EmployeeFormState) {
  const errors: { firstname?: string; lastname?: string; birth_date?: string } = {};
  if (!form.firstname.trim()) errors.firstname = 'Имя обязательно';
  if (!form.lastname.trim()) errors.lastname = 'Фамилия обязательна';
  if (form.birth_date) {
    const birth = new Date(form.birth_date);
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 18);
    if (birth > minDate) errors.birth_date = 'Сотруднику должно быть не менее 18 лет';
  } else {
    errors.birth_date = 'Дата рождения обязательна';
  }
  return errors;
}
