import React from 'react';
import { MultiSelect, Select, Stack, Switch, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { FormFieldGrid, FormSection } from '@/shared/ui';
import type { EmployeeFormState } from './employeeFormState';

interface EmployeePersonalFieldsProps {
  form: EmployeeFormState;
  errors: { firstname?: string; lastname?: string; birth_date?: string };
  serviceOptions: { value: string; label: string }[];
  specializationOptions: { value: string; label: string }[];
  servicesLoading: boolean;
  specializationsLoading: boolean;
  onChange: (form: EmployeeFormState) => void;
}

export const EmployeePersonalFields: React.FC<EmployeePersonalFieldsProps> = ({
  form,
  errors,
  serviceOptions,
  specializationOptions,
  servicesLoading,
  specializationsLoading,
  onChange,
}) => (
  <>
    <FormSection title="Личные данные">
      <Stack gap="sm">
        <FormFieldGrid>
          <TextInput
            label="Имя"
            required
            value={form.firstname}
            error={form.firstname.trim() ? undefined : errors.firstname}
            onChange={(e) => onChange({ ...form, firstname: e.currentTarget.value })}
          />
          <TextInput
            label="Фамилия"
            required
            value={form.lastname}
            error={form.lastname.trim() ? undefined : errors.lastname}
            onChange={(e) => onChange({ ...form, lastname: e.currentTarget.value })}
          />
        </FormFieldGrid>
        <FormFieldGrid>
          <TextInput
            label="Отчество"
            value={form.middlename}
            onChange={(e) => onChange({ ...form, middlename: e.currentTarget.value })}
          />
          <DateInput
            label="Дата рождения"
            required
            value={form.birth_date || null}
            error={errors.birth_date}
            onChange={(value) => onChange({ ...form, birth_date: value ?? '' })}
          />
        </FormFieldGrid>
        <FormFieldGrid>
          <TextInput
            label="Телефон"
            value={form.phone}
            onChange={(e) => onChange({ ...form, phone: e.currentTarget.value })}
          />
          <Select
            label="Специализация"
            data={specializationOptions}
            value={form.specialization_id}
            onChange={(v) => onChange({ ...form, specialization_id: v })}
            clearable
            searchable
            loading={specializationsLoading}
            placeholder="Выберите специализацию"
          />
        </FormFieldGrid>
        <Switch
          label="Активен"
          checked={form.active}
          onChange={(e) => onChange({ ...form, active: e.currentTarget.checked })}
        />
      </Stack>
    </FormSection>

    <FormSection title="Услуги" hint="Услуги, которые сотрудник может оказывать">
      <MultiSelect
        data={serviceOptions}
        value={form.services_ids}
        onChange={(v) => onChange({ ...form, services_ids: v })}
        searchable
        loading={servicesLoading}
        placeholder="Выберите услуги"
      />
    </FormSection>
  </>
);
