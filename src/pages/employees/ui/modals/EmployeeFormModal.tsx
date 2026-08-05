import React from 'react';
import { Button, Group, Modal, Stack } from '@mantine/core';
import { useServices } from '@/shared/api/hooks/useServices';
import { useSpecializations } from '@/shared/api/hooks/useSpecializations';
import type { Employee, EmployeeCreatePayload, EmployeeUpdatePayload } from '@/shared/api/types';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
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

  const handleSubmit = React.useCallback(() => {
    if (!isValid) return;
    if (employee) {
      onSubmit(toUpdatePayload(employee.id, form));
    } else {
      onSubmit(toCreatePayload(form));
    }
  }, [form, employee, onSubmit, isValid]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={employee ? 'Редактировать сотрудника' : 'Новый сотрудник'}
      radius="md"
      size="lg"
    >
      <Stack gap="md">
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
        <Group justify="flex-end">
          <Button variant="subtle" color="gray" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} loading={loading} disabled={!isValid}>
            {employee ? 'Сохранить' : 'Создать'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
