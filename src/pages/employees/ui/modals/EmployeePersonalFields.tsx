import React from 'react';
import { MultiSelect, Select, Switch, TextInput } from '@mantine/core';
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
    <FormSection title="Персональные данные">
      <FormFieldGrid>
        <TextInput
          label="Фамилия"
          required
          placeholder="Введите фамилию"
          value={form.lastname}
          error={form.lastname.trim() ? undefined : errors.lastname}
          onChange={(e) => onChange({ ...form, lastname: e.currentTarget.value })}
        />
        <TextInput
          label="Имя"
          required
          placeholder="Введите имя"
          value={form.firstname}
          error={form.firstname.trim() ? undefined : errors.firstname}
          onChange={(e) => onChange({ ...form, firstname: e.currentTarget.value })}
        />
      </FormFieldGrid>
      <FormFieldGrid>
        <TextInput
          label="Отчество"
          placeholder="Введите отчество"
          value={form.middlename}
          onChange={(e) => onChange({ ...form, middlename: e.currentTarget.value })}
        />
        <DateInput
          label="Дата рождения"
          required
          placeholder="Выберите дату"
          value={form.birth_date || null}
          error={errors.birth_date}
          onChange={(value) => onChange({ ...form, birth_date: value ?? '' })}
        />
      </FormFieldGrid>
      <FormFieldGrid>
        <Select
          label="Специализация"
          placeholder="Введите специализацию"
          data={specializationOptions}
          value={form.specialization_id}
          onChange={(v) => onChange({ ...form, specialization_id: v })}
          clearable
          searchable
          loading={specializationsLoading}
        />
        <TextInput
          label="Телефон"
          placeholder="Введите номер телефона"
          value={form.phone}
          onChange={(e) => onChange({ ...form, phone: e.currentTarget.value })}
        />
      </FormFieldGrid>
      <Switch
        label="Активен"
        color="sage"
        checked={form.active}
        onChange={(e) => onChange({ ...form, active: e.currentTarget.checked })}
      />
    </FormSection>

    <MultiSelect
      label="Услуги"
      description="Услуги, которые может оказывать сотрудник"
      data={serviceOptions}
      value={form.services_ids}
      onChange={(v) => onChange({ ...form, services_ids: v })}
      searchable
      loading={servicesLoading}
      placeholder="Выберите услуги"
    />
  </>
);
