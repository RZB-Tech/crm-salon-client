import React from 'react';
import { Switch, TextInput } from '@mantine/core';
import { BuildingsIcon } from '@phosphor-icons/react';
import { useUpdateTenantBranch } from '@/shared/api/hooks/useTenantBranches';
import type { TenantBranch } from '@/shared/api/types';
import { FormFieldGrid, FormModal, FormModalFooter, FormSection } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';

interface BranchEditModalProps {
  branch: TenantBranch | null;
  onClose: () => void;
}

export const BranchEditModal: React.FC<BranchEditModalProps> = ({ branch, onClose }) => {
  const { t } = useI18n();
  const [name, setName] = React.useState('');
  const [tin, setTin] = React.useState('');
  const [active, setActive] = React.useState(true);
  const updateBranch = useUpdateTenantBranch();

  useResetOnOpen(branch, () => {
    setName(branch?.name ?? '');
    setTin(branch?.TIN ?? '');
    setActive(branch?.active ?? true);
  });

  const handleSubmit = () => {
    if (!branch || !name.trim()) return;
    updateBranch.mutate(
      {
        branch_id: branch.id,
        name: name.trim(),
        TIN: tin.trim() || null,
        active,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <FormModal
      opened={Boolean(branch)}
      onClose={onClose}
      title={branch ? t('branches.branchNamed', { name: branch.name }) : t('form.branch')}
      icon={<BuildingsIcon />}
      size={567}
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel={t('common.save')}
          onSubmit={handleSubmit}
          submitDisabled={!name.trim()}
          loading={updateBranch.isPending}
        />
      }
    >
      <FormSection title={t('branches.data')}>
        <FormFieldGrid>
          <TextInput
            label={t('common.name')}
            required
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
          />
          <TextInput
            label={t('branches.tin')}
            value={tin}
            onChange={(event) => setTin(event.currentTarget.value)}
          />
        </FormFieldGrid>
        <Switch
          label={t('branches.branchActive')}
          checked={active}
          onChange={(event) => setActive(event.currentTarget.checked)}
        />
      </FormSection>
    </FormModal>
  );
};
