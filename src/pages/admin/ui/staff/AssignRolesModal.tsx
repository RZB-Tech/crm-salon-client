import { MultiSelect } from '@mantine/core';
import { UsersThreeIcon } from '@phosphor-icons/react';
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
  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title="Роли"
      subtitle={staffLogin}
      icon={<UsersThreeIcon size={22} />}
      size="md"
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel="Сохранить"
          onSubmit={onSave}
          loading={isPending}
        />
      }
    >
      <FormSection
        title="Назначенные роли"
        hint="Права ролей будут применены после сохранения"
      >
        <MultiSelect
          data={rolesOptions}
          value={selectedRoleIds}
          onChange={onSelectedRoleIdsChange}
          searchable
          placeholder="Выберите роли"
        />
      </FormSection>
    </FormModal>
  );
}
