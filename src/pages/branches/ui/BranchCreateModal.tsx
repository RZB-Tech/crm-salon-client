import React from 'react';
import { BuildingsIcon } from '@phosphor-icons/react';
import { useCreateTenantBranch } from '@/shared/api/hooks/useTenantBranches';
import type { BranchCredentials } from '@/shared/api/types';
import { FormModal, FormModalFooter } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import {
  emptyCreateForm,
  isCreateFormValid,
  type BranchCreateFormState,
} from '../lib/branchForm';
import { BranchCreateFields } from './BranchCreateFields';

interface BranchCreateModalProps {
  opened: boolean;
  onClose: () => void;
  onCreated: (credentials: BranchCredentials) => void;
}

export const BranchCreateModal: React.FC<BranchCreateModalProps> = ({
  opened,
  onClose,
  onCreated,
}) => {
  const { t } = useI18n();
  const [form, setForm] = React.useState<BranchCreateFormState>(emptyCreateForm);
  const createBranch = useCreateTenantBranch();

  useResetOnOpen(opened, () => setForm(emptyCreateForm()));

  const setField = <K extends keyof BranchCreateFormState>(
    key: K,
    value: BranchCreateFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!isCreateFormValid(form)) return;
    createBranch.mutate(
      {
        company_name: form.company_name.trim(),
        company_tin: form.company_tin.trim() || null,
        admin_login: form.admin_login.trim(),
        admin_firstname: form.admin_firstname.trim(),
        admin_password: form.admin_password.trim() || null,
      },
      {
        onSuccess: (result) => {
          onClose();
          onCreated({ login: result.login, password: result.password });
        },
      },
    );
  };

  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title={t('branches.newBranch')}
      icon={<BuildingsIcon />}
      size={567}
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel={t('branches.createBranch')}
          onSubmit={handleSubmit}
          submitDisabled={!isCreateFormValid(form)}
          loading={createBranch.isPending}
        />
      }
    >
      <BranchCreateFields form={form} onChange={setField} />
    </FormModal>
  );
};
