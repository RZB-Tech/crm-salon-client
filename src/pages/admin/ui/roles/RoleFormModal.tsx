import React from 'react';
import {
  Badge,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import type { Permission, Role } from '@/shared/api/types';
import {
  groupPermissionsByResource,
  toggleCodeInList,
  toggleExpandedResource,
  toggleResourceCodes,
} from '../../lib/groupPermissions';
import { PermissionsResourceTree } from '../PermissionsResourceTree';
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
  const [expandedResources, setExpandedResources] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (opened) setExpandedResources(new Set());
  }, [opened, editingRole?.id]);

  const permissionsByResource = React.useMemo(
    () => groupPermissionsByResource(permissions),
    [permissions],
  );

  const allPermissionCodes = React.useMemo(
    () => (permissions ?? []).map((p) => p.code),
    [permissions],
  );

  const isAllSelected =
    allPermissionCodes.length > 0 && allPermissionCodes.every((c) => form.permissions.includes(c));

  const handleTogglePermission = React.useCallback(
    (code: number) => {
      onFormChange((prev) => ({
        ...prev,
        permissions: toggleCodeInList(prev.permissions, code),
      }));
    },
    [onFormChange],
  );

  const handleToggleResource = React.useCallback(
    (_resource: string, codes: number[]) => {
      onFormChange((prev) => ({
        ...prev,
        permissions: toggleResourceCodes(prev.permissions, codes),
      }));
    },
    [onFormChange],
  );

  const handleSelectAll = React.useCallback(() => {
    onFormChange((prev) => ({
      ...prev,
      permissions:
        allPermissionCodes.length > 0 && allPermissionCodes.every((c) => prev.permissions.includes(c))
          ? []
          : [...allPermissionCodes],
    }));
  }, [allPermissionCodes, onFormChange]);

  const handleToggleExpanded = React.useCallback((resource: string) => {
    setExpandedResources((prev) => toggleExpandedResource(prev, resource));
  }, []);

  const handleExpandAll = React.useCallback(() => {
    setExpandedResources((prev) => {
      const allResources = Object.keys(permissionsByResource);
      if (prev.size === allResources.length) return new Set();
      return new Set(allResources);
    });
  }, [permissionsByResource]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={editingRole ? 'Редактирование роли' : 'Новая роль'}
      size="lg"
    >
      <Stack gap="sm">
        <TextInput
          label="Название"
          required
          value={form.name}
          onChange={(e) => onFormChange((prev) => ({ ...prev, name: e.currentTarget.value }))}
        />
        <Textarea
          label="Описание"
          value={form.description}
          onChange={(e) => onFormChange((prev) => ({ ...prev, description: e.currentTarget.value }))}
          autosize
          minRows={2}
        />

        <Group justify="space-between" mt="sm">
          <Group gap="xs">
            <Text fw={500} size="sm">Разрешения</Text>
            <Badge size="sm" variant="light" color={isAllSelected ? 'green' : 'gray'}>
              {form.permissions.length} / {allPermissionCodes.length}
            </Badge>
          </Group>
          <Group gap="xs">
            <Button variant="subtle" size="xs" onClick={handleExpandAll}>
              {expandedResources.size === Object.keys(permissionsByResource).length ? 'Свернуть все' : 'Развернуть все'}
            </Button>
            <Button
              variant="light"
              size="xs"
              color={isAllSelected ? 'red' : 'green'}
              onClick={handleSelectAll}
            >
              {isAllSelected ? 'Снять все' : 'Выбрать все'}
            </Button>
          </Group>
        </Group>

        <PermissionsResourceTree
          permissionsByResource={permissionsByResource}
          selectedPerms={form.permissions}
          expandedResources={expandedResources}
          onTogglePermission={handleTogglePermission}
          onToggleResource={handleToggleResource}
          onToggleExpanded={handleToggleExpanded}
        />

        <Group justify="flex-end" mt="md">
          <Button onClick={onSave} loading={isSaving} disabled={!form.name}>
            {editingRole ? 'Сохранить' : 'Создать'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
