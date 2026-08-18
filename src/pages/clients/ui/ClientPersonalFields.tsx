import React from 'react';
import { Select, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import type { Sex } from '@/shared/api/types';
import { SEX_OPTIONS } from '@/shared/lib/format';
import { FormFieldGrid, FormSection } from '@/shared/ui';
import type { ClientFormState } from '../lib/clientForm';

interface ClientPersonalFieldsProps {
  form: ClientFormState;
  onChange: (form: ClientFormState) => void;
}

export const ClientPersonalFields: React.FC<ClientPersonalFieldsProps> = ({ form, onChange }) => (
  <FormSection title="Персональные данные">
    <FormFieldGrid>
      <TextInput
        label="Фамилия"
        required
        placeholder="Введите фамилию"
        value={form.lastname}
        onChange={(e) => onChange({ ...form, lastname: e.currentTarget.value })}
      />
      <TextInput
        label="Имя"
        required
        placeholder="Введите имя"
        value={form.firstname}
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
      <Select
        label="Пол"
        required
        placeholder="Выберите пол"
        data={[...SEX_OPTIONS]}
        value={form.sex}
        onChange={(v) => onChange({ ...form, sex: (v as Sex) ?? 'female' })}
      />
    </FormFieldGrid>
    <FormFieldGrid>
      <TextInput
        label="Телефон"
        required
        placeholder="Введите номер телефона"
        value={form.phone}
        onChange={(e) => onChange({ ...form, phone: e.currentTarget.value })}
      />
      <DateInput
        label="Дата рождения"
        required
        placeholder="Выберите дату"
        value={form.birth_date || null}
        onChange={(value) => onChange({ ...form, birth_date: value ?? '' })}
      />
    </FormFieldGrid>
  </FormSection>
);
