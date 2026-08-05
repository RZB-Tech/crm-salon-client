import { Badge, Button, Group, Modal, Paper, Stack, Text } from '@mantine/core';
import type { Permission } from '@/shared/api/types';
import {
  groupPermissionsByResource,
  toggleCodeInList,
  toggleExpandedResource,
  toggleResourceCodes,
} from '../../lib/groupPermissions';
import { PermissionsResourceTree } from '../PermissionsResourceTree';

interface StaffPermissionsModalProps {
  opened: boolean;
  onClose: () => void;
  staffLogin: string;
  permissions: Permission[] | undefined;
  selectedPerms: number[];
  onSelectedPermsChange: (perms: number[]) => void;
  expandedResources: Set<string>;
  onExpandedResourcesChange: (resources: Set<string>) => void;
  onSave: () => void;
  isPending: boolean;
}

export function StaffPermissionsModal({
  opened,
  onClose,
  staffLogin,
  permissions,
  selectedPerms,
  onSelectedPermsChange,
  expandedResources,
  onExpandedResourcesChange,
  onSave,
  isPending,
}: StaffPermissionsModalProps) {
  const permissionsByResource = groupPermissionsByResource(permissions);
  const allPermissionCodes = (permissions ?? []).map((p) => p.code);
  const isAllPermsSelected =
    allPermissionCodes.length > 0 && allPermissionCodes.every((c) => selectedPerms.includes(c));
  const allResources = Object.keys(permissionsByResource);

  const handleTogglePermission = (code: number) => {
    onSelectedPermsChange(toggleCodeInList(selectedPerms, code));
  };

  const handleToggleResource = (_resource: string, codes: number[]) => {
    onSelectedPermsChange(toggleResourceCodes(selectedPerms, codes));
  };

  const handleToggleExpanded = (resource: string) => {
    onExpandedResourcesChange(toggleExpandedResource(expandedResources, resource));
  };

  const handleExpandAll = () => {
    onExpandedResourcesChange(
      expandedResources.size === allResources.length ? new Set() : new Set(allResources),
    );
  };

  const handleSelectAllPerms = () => {
    const allSelected =
      allPermissionCodes.length > 0 && allPermissionCodes.every((c) => selectedPerms.includes(c));
    onSelectedPermsChange(allSelected ? [] : [...allPermissionCodes]);
  };

  return (
    <Modal opened={opened} onClose={onClose} title={`Разрешения — ${staffLogin}`} size="lg">
      <Stack gap="sm">
        <Group justify="space-between">
          <Group gap="xs">
            <Text fw={500} size="sm">
              Индивидуальные разрешения
            </Text>
            <Badge size="sm" variant="light" color={isAllPermsSelected ? 'green' : 'gray'}>
              {selectedPerms.length} / {allPermissionCodes.length}
            </Badge>
          </Group>
          <Group gap="xs">
            <Button variant="subtle" size="xs" onClick={handleExpandAll}>
              {expandedResources.size === allResources.length ? 'Свернуть все' : 'Развернуть все'}
            </Button>
            <Button
              variant="light"
              size="xs"
              color={isAllPermsSelected ? 'red' : 'green'}
              onClick={handleSelectAllPerms}
            >
              {isAllPermsSelected ? 'Снять все' : 'Выбрать все'}
            </Button>
          </Group>
        </Group>

        <Paper p="xs" withBorder>
          <Text size="xs" c="dimmed">
            Эти разрешения добавляются к правам, полученным через роли
          </Text>
        </Paper>

        <PermissionsResourceTree
          permissionsByResource={permissionsByResource}
          selectedPerms={selectedPerms}
          expandedResources={expandedResources}
          onTogglePermission={handleTogglePermission}
          onToggleResource={handleToggleResource}
          onToggleExpanded={handleToggleExpanded}
        />

        <Group justify="flex-end" mt="md">
          <Button onClick={onSave} loading={isPending}>
            Сохранить
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
