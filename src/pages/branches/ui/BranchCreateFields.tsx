import React from 'react';
import { PasswordInput, TextInput } from '@mantine/core';
import { useI18n } from '@/shared/lib/i18n';
import { FormFieldGrid, FormSection } from '@/shared/ui';
import type { BranchCreateFormState } from '../lib/branchForm';

interface BranchCreateFieldsProps {
  form: BranchCreateFormState;
  onChange: <K extends keyof BranchCreateFormState>(key: K, value: BranchCreateFormState[K]) => void;
}

export const BranchCreateFields: React.FC<BranchCreateFieldsProps> = ({ form, onChange }) => {
  const { t } = useI18n();
  return (
    <>
      <FormSection title={t('branches.organization')}>
        <FormFieldGrid>
          <TextInput
            label={t('common.name')}
            required
            value={form.company_name}
            onChange={(event) => onChange('company_name', event.currentTarget.value)}
          />
          <TextInput
            label={t('branches.tin')}
            value={form.company_tin}
            onChange={(event) => onChange('company_tin', event.currentTarget.value)}
          />
        </FormFieldGrid>
      </FormSection>
      <FormSection
        title={t('branches.branchAdmin')}
        hint={t('branches.adminHint')}
      >
        <FormFieldGrid>
          <TextInput
            label={t('common.login')}
            required
            value={form.admin_login}
            onChange={(event) => onChange('admin_login', event.currentTarget.value)}
          />
          <TextInput
            label={t('common.firstName')}
            required
            value={form.admin_firstname}
            onChange={(event) => onChange('admin_firstname', event.currentTarget.value)}
          />
        </FormFieldGrid>
        <PasswordInput
          label={t('common.password')}
          description={t('branches.passwordHint')}
          value={form.admin_password}
          onChange={(event) => onChange('admin_password', event.currentTarget.value)}
        />
      </FormSection>
    </>
  );
};
