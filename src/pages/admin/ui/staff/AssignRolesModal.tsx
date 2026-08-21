import { MultiSelect } from '@mantine/core';
import { UsersThreeIcon } from '@phosphor-icons/react';
import { useI18n } from '@/shared/lib/i18n';
import { FormModal, FormModalFooter, FormSection } from '@/shared/ui';

interface AssignRolesModalProps {
  opened: boolean;
  onClose: () => void;
  staffLogin: string;
  rolesOptions: { value: string; label: string }[];
  selectedRoleIds: string[];
  onSelectedRoleIdsChange: (ids: string[]) => void;
  onSave: () => void;
  isPending: boolean;
}

export function AssignRolesModal({
  opened,
  onClose,
  staffLogin,
  rolesOptions,
  selectedRoleIds,
  onSelectedRoleIdsChange,
  onSave,
  isPending,
}: AssignRolesModalProps) {
  const { t } = useI18n();
  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title={t('admin.roles')}
      subtitle={staffLogin}
      icon={<UsersThreeIcon size={22} />}
      size={567}
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel={t('common.save')}
          onSubmit={onSave}
          loading={isPending}
        />
      }
    >
      <FormSection
        title={t('form.assignedRoles')}
        hint={t('form.rolesHint')}
      >
        <MultiSelect
          data={rolesOptions}
          value={selectedRoleIds}
          onChange={onSelectedRoleIdsChange}
          searchable
          placeholder={t('form.selectRoles')}
        />
      </FormSection>
    </FormModal>
  );
}
