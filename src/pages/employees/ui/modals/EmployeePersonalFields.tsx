import React from 'react';
import { MultiSelect, Select, Switch, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useI18n } from '@/shared/lib/i18n';
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
}) => {
  const { t } = useI18n();
  return (
    <>
      <FormSection title={t('clients.personalData')}>
        <FormFieldGrid>
          <TextInput
            label={t('common.lastName')}
            required
            placeholder={t('clients.enterLastName')}
            value={form.lastname}
            error={form.lastname.trim() ? undefined : errors.lastname}
            onChange={(e) => onChange({ ...form, lastname: e.currentTarget.value })}
          />
          <TextInput
            label={t('common.firstName')}
            required
            placeholder={t('clients.enterFirstName')}
            value={form.firstname}
            error={form.firstname.trim() ? undefined : errors.firstname}
            onChange={(e) => onChange({ ...form, firstname: e.currentTarget.value })}
          />
        </FormFieldGrid>
        <FormFieldGrid>
          <TextInput
            label={t('clients.middleName')}
            placeholder={t('clients.enterMiddleName')}
            value={form.middlename}
            onChange={(e) => onChange({ ...form, middlename: e.currentTarget.value })}
          />
          <DateInput
            label={t('clients.birthDate')}
            required
            placeholder={t('clients.selectDate')}
            value={form.birth_date || null}
            error={errors.birth_date}
            onChange={(value) => onChange({ ...form, birth_date: value ?? '' })}
          />
        </FormFieldGrid>
        <FormFieldGrid>
          <Select
            label={t('employees.specialization')}
            placeholder={t('employees.enterSpecialization')}
            data={specializationOptions}
            value={form.specialization_id}
            onChange={(v) => onChange({ ...form, specialization_id: v })}
            clearable
            searchable
            loading={specializationsLoading}
          />
          <TextInput
            label={t('common.phone')}
            placeholder={t('clients.enterPhone')}
            value={form.phone}
            onChange={(e) => onChange({ ...form, phone: e.currentTarget.value })}
          />
        </FormFieldGrid>
        <Switch
          label={t('form.staffActive')}
          color="sage"
          checked={form.active}
          onChange={(e) => onChange({ ...form, active: e.currentTarget.checked })}
        />
      </FormSection>

      <MultiSelect
        label={t('employees.services')}
        description={t('employees.servicesHint')}
        data={serviceOptions}
        value={form.services_ids}
        onChange={(v) => onChange({ ...form, services_ids: v })}
        searchable
        loading={servicesLoading}
        placeholder={t('employees.selectServices')}
      />
    </>
  );
};
