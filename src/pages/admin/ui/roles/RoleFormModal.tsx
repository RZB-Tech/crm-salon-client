import React from 'react';
import { TextInput, Textarea } from '@mantine/core';
import { ShieldStarIcon } from '@phosphor-icons/react';
import type { Permission, Role } from '@/shared/api/types';
import { useI18n } from '@/shared/lib/i18n';
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
  const { t } = useI18n();
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
      title={editingRole ? t('form.editRole') : t('form.createRole')}
      icon={<ShieldStarIcon />}
      size={567}
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel={editingRole ? t('common.save') : t('form.createRole')}
          onSubmit={onSave}
          submitDisabled={!form.name}
          loading={isSaving}
        />
      }
    >
      <TextInput
        label={t('common.name')}
        required
        placeholder={t('form.enterRoleName')}
        value={form.name}
        onChange={(e) => onFormChange((prev) => ({ ...prev, name: e.currentTarget.value }))}
      />
      <Textarea
        label={t('form.description')}
        placeholder={t('form.enterRoleDescription')}
        autosize
        minRows={2}
        value={form.description}
        onChange={(e) =>
          onFormChange((prev) => ({ ...prev, description: e.currentTarget.value }))
        }
      />

      <FormSection title={t('form.permissions')} hint={t('form.permissionsHint')}>
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
