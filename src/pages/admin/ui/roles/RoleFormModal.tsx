import React from 'react';
import { Stack, TextInput, Textarea } from '@mantine/core';
import { ShieldStarIcon } from '@phosphor-icons/react';
import type { Permission, Role } from '@/shared/api/types';
import { FormModal, FormModalFooter, FormSection } from '@/shared/ui';
import { PermissionsResourceTree } from '../PermissionsResourceTree';
import { PermissionsTreeToolbar } from '../PermissionsTreeToolbar';
import { useRolePermissions } from './useRolePermissions';
import type { RoleForm } from './types';

interface RoleFormModalProps {
  opened: boolean;
  onClose: () => void;
  editingRole: Role | null;
  form: RoleForm;
  onFormChange: React.Dispatch<React.SetStateAction<RoleForm>>;
  permissions: Permission[] | undefined;
  onSave: () => void;
  isSaving: boolean;
}

export function RoleFormModal({
  opened,
  onClose,
  editingRole,
  form,
  onFormChange,
  permissions,
  onSave,
  isSaving,
}: RoleFormModalProps) {
  const perms = useRolePermissions({
    opened,
    editingRole,
    permissions,
    selectedPerms: form.permissions,
    onFormChange,
  });

  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title={editingRole ? 'Редактирование роли' : 'Новая роль'}
      subtitle={editingRole ? editingRole.name : 'Название, описание и права доступа'}
      icon={<ShieldStarIcon size={22} />}
      size="lg"
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel={editingRole ? 'Сохранить' : 'Создать'}
          onSubmit={onSave}
          submitDisabled={!form.name}
          loading={isSaving}
        />
      }
    >
      <FormSection title="Основное">
        <Stack gap="sm">
          <TextInput
            label="Название"
            required
            value={form.name}
            onChange={(e) => onFormChange((prev) => ({ ...prev, name: e.currentTarget.value }))}
          />
          <Textarea
            label="Описание"
            autosize
            minRows={2}
            value={form.description}
            onChange={(e) =>
              onFormChange((prev) => ({ ...prev, description: e.currentTarget.value }))
            }
          />
        </Stack>
      </FormSection>

      <FormSection title="Разрешения" hint="Отметьте доступы, которые получит роль">
        <PermissionsTreeToolbar
          selectedCount={form.permissions.length}
          totalCount={perms.totalCount}
          allSelected={perms.isAllSelected}
          allExpanded={perms.isAllExpanded}
          onToggleExpandAll={perms.toggleExpandAll}
          onToggleSelectAll={perms.toggleSelectAll}
        />
        <PermissionsResourceTree
          permissionsByResource={perms.permissionsByResource}
          selectedPerms={form.permissions}
          expandedResources={perms.expandedResources}
          onTogglePermission={perms.togglePermission}
          onToggleResource={perms.toggleResource}
          onToggleExpanded={perms.toggleExpanded}
        />
      </FormSection>
    </FormModal>
  );
}
