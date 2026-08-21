import React from 'react';
import { Select, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import type { Sex } from '@/shared/api/types';
import { SEX_OPTIONS } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { FormFieldGrid, FormSection } from '@/shared/ui';
import type { ClientFormState } from '../lib/clientForm';

interface ClientPersonalFieldsProps {
  form: ClientFormState;
  onChange: (form: ClientFormState) => void;
}

export const ClientPersonalFields: React.FC<ClientPersonalFieldsProps> = ({ form, onChange }) => {
  const { t } = useI18n();
  return (
  <FormSection title={t('clients.personalData')}>
    <FormFieldGrid>
      <TextInput
        label={t('common.lastName')}
        required
        placeholder={t('clients.enterLastName')}
        value={form.lastname}
        onChange={(e) => onChange({ ...form, lastname: e.currentTarget.value })}
      />
      <TextInput
        label={t('common.firstName')}
        required
        placeholder={t('clients.enterFirstName')}
        value={form.firstname}
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
      <Select
        label={t('clients.sex')}
        required
        placeholder={t('clients.selectSex')}
        data={[...SEX_OPTIONS()]}
        value={form.sex}
        onChange={(v) => onChange({ ...form, sex: (v as Sex) ?? 'female' })}
      />
    </FormFieldGrid>
    <FormFieldGrid>
      <TextInput
        label={t('common.phone')}
        required
        placeholder={t('clients.enterPhone')}
        value={form.phone}
        onChange={(e) => onChange({ ...form, phone: e.currentTarget.value })}
      />
      <DateInput
        label={t('clients.birthDate')}
        required
        placeholder={t('clients.selectDate')}
        value={form.birth_date || null}
        onChange={(value) => onChange({ ...form, birth_date: value ?? '' })}
      />
    </FormFieldGrid>
  </FormSection>
  );
};
