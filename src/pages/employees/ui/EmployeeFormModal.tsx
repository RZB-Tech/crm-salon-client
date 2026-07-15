import React from 'react';
import {
  Modal,
  TextInput,
  Group,
  Button,
  Switch,
  MultiSelect,
  Select,
  Text,
  Stack,
  NumberInput,
} from '@mantine/core';
import { useServices } from '@/shared/api/hooks/useServices';
import { useSpecializations } from '@/shared/api/hooks/useSpecializations';
import type {
  EmployeeCreatePayload,
  Employee,
  EmployeeUpdatePayload,
} from '@/shared/api/types';

interface EmployeeFormState {
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

interface EmployeeFormModalProps {
  opened: boolean;
  employee: Employee | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: EmployeeCreatePayload | EmployeeUpdatePayload) => void;
}

const emptyForm = (): EmployeeFormState => ({
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

const employeeToForm = (employee: Employee): EmployeeFormState => ({
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

const toCreatePayload = (form: EmployeeFormState): EmployeeCreatePayload => ({
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

const toUpdatePayload = (id: number, form: EmployeeFormState): EmployeeUpdatePayload => ({
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

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  opened,
  employee,
  loading = false,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = React.useState<EmployeeFormState>(emptyForm);
  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: specializations, isLoading: specializationsLoading } = useSpecializations();

  React.useEffect(() => {
    if (opened) {
      setForm(employee ? employeeToForm(employee) : emptyForm());
    }
  }, [opened, employee]);

  const serviceOptions = React.useMemo(
    () => (services ?? []).map((s) => ({ value: String(s.id), label: s.name })),
    [services],
  );

  const specializationOptions = React.useMemo(
    () => (specializations ?? []).map((s) => ({ value: String(s.id), label: s.name })),
    [specializations],
  );

  const errors = React.useMemo(() => {
    const e: { firstname?: string; lastname?: string; birth_date?: string } = {};
    if (!form.firstname.trim()) e.firstname = 'Имя обязательно';
    if (!form.lastname.trim()) e.lastname = 'Фамилия обязательна';
    if (form.birth_date) {
      const birth = new Date(form.birth_date);
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 18);
      if (birth > minDate) e.birth_date = 'Сотруднику должно быть не менее 18 лет';
    } else {
      e.birth_date = 'Дата рождения обязательна';
    }
    return e;
  }, [form.firstname, form.lastname, form.birth_date]);

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
        <Group grow>
          <TextInput label="Имя" required value={form.firstname} error={form.firstname.trim() ? undefined : errors.firstname} onChange={(e) => setForm({ ...form, firstname: e.currentTarget.value })} />
          <TextInput label="Фамилия" required value={form.lastname} error={form.lastname.trim() ? undefined : errors.lastname} onChange={(e) => setForm({ ...form, lastname: e.currentTarget.value })} />
        </Group>
        <Group grow>
          <TextInput label="Отчество" value={form.middlename} onChange={(e) => setForm({ ...form, middlename: e.currentTarget.value })} />
          <TextInput label="Дата рождения" type="date" required value={form.birth_date} error={errors.birth_date} onChange={(e) => setForm({ ...form, birth_date: e.currentTarget.value })} />
        </Group>
        <TextInput label="Телефон" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.currentTarget.value })} />
        <Select
          label="Специализация"
          data={specializationOptions}
          value={form.specialization_id}
          onChange={(v) => setForm({ ...form, specialization_id: v })}
          clearable
          searchable
          loading={specializationsLoading}
          placeholder="Выберите специализацию"
        />
        <Switch label="Активен" checked={form.active} onChange={(e) => setForm({ ...form, active: e.currentTarget.checked })} />
        <MultiSelect
          label="Услуги"
          data={serviceOptions}
          value={form.services_ids}
          onChange={(v) => setForm({ ...form, services_ids: v })}
          searchable
          loading={servicesLoading}
        />
        <Text size="sm" fw={600}>Зарплата</Text>
        <Group grow>
          <NumberInput label="Фиксированная" min={0} value={form.salary_fixed} onChange={(v) => setForm({ ...form, salary_fixed: Number(v) || 0 })} />
          <NumberInput label="% от услуг" min={0} max={100} value={form.percent_from_services} onChange={(v) => setForm({ ...form, percent_from_services: Number(v) || 0 })} />
        </Group>
        <NumberInput label="% от продаж" min={0} max={100} value={form.percent_from_sales} onChange={(v) => setForm({ ...form, percent_from_sales: Number(v) || 0 })} />
        <Group justify="flex-end">
          <Button variant="subtle" color="gray" onClick={onClose}>Отмена</Button>
          <Button onClick={handleSubmit} loading={loading} disabled={!isValid}>
            {employee ? 'Сохранить' : 'Создать'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
