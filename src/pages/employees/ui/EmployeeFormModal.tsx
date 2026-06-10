import React from 'react';
import {
  Modal,
  TextInput,
  Group,
  Button,
  Switch,
  MultiSelect,
  Text,
  Stack,
} from '@mantine/core';
import { useServices } from '@/shared/api/hooks/useServices';
import type { CreateEmployeePayload, Employee, PatchedEmployee } from '@/shared/api/types';

interface EmployeeFormState {
  firstname: string;
  lastname: string;
  middlename: string;
  phone: string;
  email: string;
  birthDate: string;
  active: boolean;
  salary_fixed: string;
  precent_from_services: string;
  precent_from_sales: string;
  precent_from_self_services: string;
  precent_from_self_sales: string;
  precent_from_attract_client: string;
  precent_from_develop_client: string;
  services: string[];
}

interface EmployeeFormModalProps {
  opened: boolean;
  employee: Employee | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateEmployeePayload | PatchedEmployee) => void;
}

const emptyForm = (): EmployeeFormState => ({
  firstname: '',
  lastname: '',
  middlename: '',
  phone: '',
  email: '',
  birthDate: new Date().toISOString().slice(0, 10),
  active: true,
  salary_fixed: '',
  precent_from_services: '',
  precent_from_sales: '',
  precent_from_self_services: '',
  precent_from_self_sales: '',
  precent_from_attract_client: '',
  precent_from_develop_client: '',
  services: [],
});

const employeeToForm = (employee: Employee): EmployeeFormState => ({
  firstname: employee.firstname,
  lastname: employee.lastname ?? '',
  middlename: employee.middlename ?? '',
  phone: employee.phone ?? '',
  email: employee.email ?? '',
  birthDate: employee.birthDate,
  active: employee.active,
  salary_fixed: employee.salary_fixed ?? '',
  precent_from_services: employee.precent_from_services ?? '',
  precent_from_sales: employee.precent_from_sales ?? '',
  precent_from_self_services: employee.precent_from_self_services ?? '',
  precent_from_self_sales: employee.precent_from_self_sales ?? '',
  precent_from_attract_client: employee.precent_from_attract_client ?? '',
  precent_from_develop_client: employee.precent_from_develop_client ?? '',
  services: (employee.services ?? []).map(String),
});

const toPayload = (form: EmployeeFormState): CreateEmployeePayload => ({
  firstname: form.firstname,
  lastname: form.lastname || null,
  middlename: form.middlename || null,
  phone: form.phone || null,
  email: form.email || null,
  birthDate: form.birthDate,
  active: form.active,
  salary_fixed: form.salary_fixed || null,
  precent_from_services: form.precent_from_services || null,
  precent_from_sales: form.precent_from_sales || null,
  precent_from_self_services: form.precent_from_self_services || null,
  precent_from_self_sales: form.precent_from_self_sales || null,
  precent_from_attract_client: form.precent_from_attract_client || null,
  precent_from_develop_client: form.precent_from_develop_client || null,
  services: form.services.map(Number),
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

  React.useEffect(() => {
    if (opened) {
      setForm(employee ? employeeToForm(employee) : emptyForm());
    }
  }, [opened, employee]);

  const serviceOptions = React.useMemo(
    () => (services ?? []).map((s) => ({ value: String(s.id), label: s.name })),
    [services],
  );

  const handleSubmit = React.useCallback(() => {
    onSubmit(toPayload(form));
  }, [form, onSubmit]);

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
          <TextInput label="Имя" required value={form.firstname} onChange={(e) => setForm({ ...form, firstname: e.currentTarget.value })} />
          <TextInput label="Фамилия" value={form.lastname} onChange={(e) => setForm({ ...form, lastname: e.currentTarget.value })} />
        </Group>
        <Group grow>
          <TextInput label="Отчество" value={form.middlename} onChange={(e) => setForm({ ...form, middlename: e.currentTarget.value })} />
          <TextInput label="Дата рождения" type="date" required value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.currentTarget.value })} />
        </Group>
        <Group grow>
          <TextInput label="Телефон" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.currentTarget.value })} />
          <TextInput label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.currentTarget.value })} />
        </Group>
        <Switch label="Активен" checked={form.active} onChange={(e) => setForm({ ...form, active: e.currentTarget.checked })} />
        <MultiSelect
          label="Услуги"
          data={serviceOptions}
          value={form.services}
          onChange={(v) => setForm({ ...form, services: v })}
          searchable
          loading={servicesLoading}
        />
        <Text size="sm" fw={600}>Зарплата</Text>
        <Group grow>
          <TextInput label="Фиксированная" value={form.salary_fixed} onChange={(e) => setForm({ ...form, salary_fixed: e.currentTarget.value })} />
          <TextInput label="% от услуг" value={form.precent_from_services} onChange={(e) => setForm({ ...form, precent_from_services: e.currentTarget.value })} />
        </Group>
        <Group grow>
          <TextInput label="% от продаж" value={form.precent_from_sales} onChange={(e) => setForm({ ...form, precent_from_sales: e.currentTarget.value })} />
          <TextInput label="% от своих услуг" value={form.precent_from_self_services} onChange={(e) => setForm({ ...form, precent_from_self_services: e.currentTarget.value })} />
        </Group>
        <Group grow>
          <TextInput label="% от своих продаж" value={form.precent_from_self_sales} onChange={(e) => setForm({ ...form, precent_from_self_sales: e.currentTarget.value })} />
          <TextInput label="% за привлечение" value={form.precent_from_attract_client} onChange={(e) => setForm({ ...form, precent_from_attract_client: e.currentTarget.value })} />
        </Group>
        <TextInput label="% за развитие клиента" value={form.precent_from_develop_client} onChange={(e) => setForm({ ...form, precent_from_develop_client: e.currentTarget.value })} />
        <Group justify="flex-end">
          <Button variant="subtle" color="gray" onClick={onClose}>Отмена</Button>
          <Button onClick={handleSubmit} loading={loading} disabled={!form.firstname || !form.birthDate}>
            {employee ? 'Сохранить' : 'Создать'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
