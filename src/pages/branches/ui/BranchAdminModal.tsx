import React from 'react';
import { PasswordInput, TextInput } from '@mantine/core';
import { UserPlusIcon } from '@phosphor-icons/react';
import { useCreateBranchAdmin } from '@/shared/api/hooks/useTenantBranches';
import type { BranchCredentials, TenantBranch } from '@/shared/api/types';
import { FormFieldGrid, FormModal, FormModalFooter, FormSection } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { emptyAdminForm, isAdminFormValid, type BranchAdminFormState } from '../lib/branchForm';

interface BranchAdminModalProps {
  branch: TenantBranch | null;
  onClose: () => void;
  onCreated: (credentials: BranchCredentials) => void;
}

export const BranchAdminModal: React.FC<BranchAdminModalProps> = ({
  branch,
  onClose,
  onCreated,
}) => {
  const { t } = useI18n();
  const [form, setForm] = React.useState<BranchAdminFormState>(emptyAdminForm);
  const createAdmin = useCreateBranchAdmin();

  useResetOnOpen(branch, () => setForm(emptyAdminForm()));

  const setField = <K extends keyof BranchAdminFormState>(
    key: K,
    value: BranchAdminFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!branch || !isAdminFormValid(form)) return;
    createAdmin.mutate(
      {
        branch_id: branch.id,
        admin_login: form.admin_login.trim(),
        admin_firstname: form.admin_firstname.trim(),
        admin_password: form.admin_password.trim() || null,
      },
      {
        onSuccess: (result) => {
          onClose();
          onCreated(result);
        },
      },
    );
  };

  return (
    <FormModal
      opened={Boolean(branch)}
      onClose={onClose}
      title={branch ? t('branches.adminFor', { name: branch.name }) : t('branches.branchAdmin')}
      icon={<UserPlusIcon />}
      size={567}
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel={t('branches.createAdmin')}
          onSubmit={handleSubmit}
          submitDisabled={!isAdminFormValid(form)}
          loading={createAdmin.isPending}
        />
      }
    >
      <FormSection hint={t('form.adminHintEmpty')}>
        <FormFieldGrid>
          <TextInput
            label={t('common.login')}
            required
            value={form.admin_login}
            onChange={(event) => setField('admin_login', event.currentTarget.value)}
          />
          <TextInput
            label={t('common.firstName')}
            required
            value={form.admin_firstname}
            onChange={(event) => setField('admin_firstname', event.currentTarget.value)}
          />
        </FormFieldGrid>
        <PasswordInput
          label={t('common.password')}
          value={form.admin_password}
          onChange={(event) => setField('admin_password', event.currentTarget.value)}
        />
      </FormSection>
    </FormModal>
  );
};
