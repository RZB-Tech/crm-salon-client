import React from 'react';
import { UserIcon } from '@phosphor-icons/react';
import { useServices } from '@/shared/api/hooks/useServices';
import { useSpecializations } from '@/shared/api/hooks/useSpecializations';
import type { Employee, EmployeeCreatePayload, EmployeeUpdatePayload } from '@/shared/api/types';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { FormModal, FormModalFooter } from '@/shared/ui';
import {
  emptyEmployeeForm,
  employeeToForm,
  toCreatePayload,
  toUpdatePayload,
  validateEmployeeForm,
  type EmployeeFormState,
} from './employeeFormState';
import { EmployeePersonalFields } from './EmployeePersonalFields';
import { EmployeeSalaryFields } from './EmployeeSalaryFields';

interface EmployeeFormModalProps {
  opened: boolean;
  employee: Employee | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: EmployeeCreatePayload | EmployeeUpdatePayload) => void;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  opened,
  employee,
  loading = false,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = React.useState<EmployeeFormState>(emptyEmployeeForm);
  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: specializations, isLoading: specializationsLoading } = useSpecializations();

  useResetOnOpen(opened, () => setForm(employee ? employeeToForm(employee) : emptyEmployeeForm()));

  const serviceOptions = React.useMemo(
    () => (services ?? []).map((s) => ({ value: String(s.id), label: s.name })),
    [services],
  );

  const specializationOptions = React.useMemo(
    () => (specializations ?? []).map((s) => ({ value: String(s.id), label: s.name })),
    [specializations],
  );

  const errors = React.useMemo(() => validateEmployeeForm(form), [form]);
  const isValid = Object.keys(errors).length === 0;

  const initials =
    [form.firstname[0], form.lastname[0]].filter(Boolean).join('').toUpperCase() || null;

  const handleSubmit = React.useCallback(() => {
    if (!isValid) return;
    if (employee) {
      onSubmit(toUpdatePayload(employee.id, form));
    } else {
      onSubmit(toCreatePayload(form));
    }
  }, [form, employee, onSubmit, isValid]);

  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title={employee ? 'Редактировать сотрудника' : 'Новый сотрудник'}
      subtitle="Личные данные, услуги и зарплата"
      initials={initials}
      icon={<UserIcon size={22} />}
      size="lg"
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel={employee ? 'Сохранить' : 'Создать'}
          onSubmit={handleSubmit}
          submitDisabled={!isValid}
          loading={loading}
        />
      }
    >
      <EmployeePersonalFields
        form={form}
        errors={errors}
        serviceOptions={serviceOptions}
        specializationOptions={specializationOptions}
        servicesLoading={servicesLoading}
        specializationsLoading={specializationsLoading}
        onChange={setForm}
      />
      <EmployeeSalaryFields form={form} onChange={setForm} />
    </FormModal>
  );
};
