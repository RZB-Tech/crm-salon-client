import React from 'react';
import {
  Badge,
  Button,
  Checkbox,
  Collapse,
  Group,
  Menu,
  Modal,
  Paper,
  ScrollArea,
  SimpleGrid,
  Skeleton,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
  Textarea,
  UnstyledButton,
  ActionIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { CaretDownIcon, CaretRightIcon, DotsThreeVerticalIcon } from '@phosphor-icons/react';
import { useRoles, useCreateRole, useUpdateRole } from '@/shared/api/hooks/useRoles';
import { usePermissions } from '@/shared/api/hooks/usePermissions';
import { DataTable, DataTableRow } from '@/shared/ui';
import type { Permission, Role, RoleCreatePayload } from '@/shared/api/types';

interface RoleForm {
  name: string;
  description: string;
  permissions: number[];
}

const INITIAL_FORM: RoleForm = { name: '', description: '', permissions: [] };

export const RolesTab: React.FC = () => {
  const { data: roles, isLoading } = useRoles();
  const { data: permissions } = usePermissions();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();

  const [opened, { open, close }] = useDisclosure(false);
  const [editingRole, setEditingRole] = React.useState<Role | null>(null);
  const [form, setForm] = React.useState<RoleForm>(INITIAL_FORM);
  const [expandedResources, setExpandedResources] = React.useState<Set<string>>(new Set());
  const [showArchived, setShowArchived] = React.useState(false);

  const permissionsByResource = React.useMemo(() => {
    if (!permissions) return {};
    return permissions.reduce<Record<string, Permission[]>>((acc, p) => {
      if (!acc[p.resource]) acc[p.resource] = [];
      acc[p.resource].push(p);
      return acc;
    }, {});
  }, [permissions]);

  const allPermissionCodes = React.useMemo(
    () => (permissions ?? []).map((p) => p.code),
    [permissions],
  );

  const filteredRoles = React.useMemo(
    () => (roles ?? []).filter((r) => showArchived || !r.archived),
    [roles, showArchived],
  );

  const handleOpen = React.useCallback((role?: Role) => {
    if (role) {
      setEditingRole(role);
      setForm({ name: role.name, description: role.description ?? '', permissions: role.permissions });
    } else {
      setEditingRole(null);
      setForm(INITIAL_FORM);
    }
    setExpandedResources(new Set());
    open();
  }, [open]);

  const handleTogglePermission = React.useCallback((code: number) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(code)
        ? prev.permissions.filter((c) => c !== code)
        : [...prev.permissions, code],
    }));
  }, []);

  const handleToggleResource = React.useCallback((_resource: string, codes: number[]) => {
    setForm((prev) => {
      const allSelected = codes.every((c) => prev.permissions.includes(c));
      if (allSelected) {
        const codesSet = new Set(codes);
        return { ...prev, permissions: prev.permissions.filter((c) => !codesSet.has(c)) };
      }
      return { ...prev, permissions: [...new Set([...prev.permissions, ...codes])] };
    });
  }, []);

  const handleSelectAll = React.useCallback(() => {
    setForm((prev) => {
      const allSelected = allPermissionCodes.length > 0 && allPermissionCodes.every((c) => prev.permissions.includes(c));
      return { ...prev, permissions: allSelected ? [] : [...allPermissionCodes] };
    });
  }, [allPermissionCodes]);

  const handleToggleExpanded = React.useCallback((resource: string) => {
    setExpandedResources((prev) => {
      const next = new Set(prev);
      if (next.has(resource)) next.delete(resource);
      else next.add(resource);
      return next;
    });
  }, []);

  const handleExpandAll = React.useCallback(() => {
    setExpandedResources((prev) => {
      const allResources = Object.keys(permissionsByResource);
      if (prev.size === allResources.length) return new Set();
      return new Set(allResources);
    });
  }, [permissionsByResource]);

  const handleSave = React.useCallback(() => {
    if (editingRole) {
      updateRole.mutate(
        { id: editingRole.id, name: form.name, description: form.description || null, permissions: form.permissions },
        { onSuccess: close },
      );
    } else {
      const payload: RoleCreatePayload = {
        name: form.name,
        description: form.description || null,
        permissions: form.permissions,
      };
      createRole.mutate(payload, { onSuccess: close });
    }
  }, [editingRole, form, createRole, updateRole, close]);

  const handleToggleArchive = React.useCallback((role: Role) => {
    updateRole.mutate({ id: role.id, archived: !role.archived });
  }, [updateRole]);

  const isAllSelected = allPermissionCodes.length > 0 && allPermissionCodes.every((c) => form.permissions.includes(c));

  const columns = React.useMemo(
    () => [
      { key: 'name', label: 'Название' },
      { key: 'description', label: 'Описание' },
      { key: 'permissions_count', label: 'Разрешений' },
      { key: 'status', label: 'Статус' },
      { key: 'actions', label: '' },
    ],
    [],
  );

  if (isLoading) return <Skeleton height={300} radius="md" />;

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Switch
          label="Показать архивные"
          checked={showArchived}
          onChange={(e) => setShowArchived(e.currentTarget.checked)}
          size="sm"
        />
        <Button onClick={() => handleOpen()}>Создать роль</Button>
      </Group>

      <DataTable columns={columns} isEmpty={filteredRoles.length === 0} emptyMessage="Нет ролей">
        {filteredRoles.map((r) => (
          <DataTableRow key={r.id}>
            <Table.Td>
              <Text size="sm" c={r.archived ? 'dimmed' : undefined}>{r.name}</Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm" c="dimmed">{r.description || '—'}</Text>
            </Table.Td>
            <Table.Td><Badge variant="light">{r.permissions.length}</Badge></Table.Td>
            <Table.Td>
              {r.archived ? (
                <Badge color="gray" variant="light" size="sm">Архив</Badge>
              ) : (
                <Badge color="green" variant="light" size="sm">Активна</Badge>
              )}
            </Table.Td>
            <Table.Td>
              <Menu position="bottom-end" withinPortal>
                <Menu.Target>
                  <ActionIcon variant="subtle" size="sm">
                    <DotsThreeVerticalIcon size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item onClick={() => handleOpen(r)}>Редактировать</Menu.Item>
                  <Menu.Item
                    color={r.archived ? 'green' : 'orange'}
                    onClick={() => handleToggleArchive(r)}
                  >
                    {r.archived ? 'Восстановить' : 'Архивировать'}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Table.Td>
          </DataTableRow>
        ))}
      </DataTable>

      <Modal
        opened={opened}
        onClose={close}
        title={editingRole ? 'Редактирование роли' : 'Новая роль'}
        size="lg"
      >
        <Stack gap="sm">
          <TextInput
            label="Название"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.currentTarget.value })}
          />
          <Textarea
            label="Описание"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.currentTarget.value })}
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

          <ScrollArea.Autosize mah={400} type="auto">
            <Stack gap="xs">
              {Object.entries(permissionsByResource).map(([resource, perms]) => {
                const codes = perms.map((p) => p.code);
                const selectedInGroup = codes.filter((c) => form.permissions.includes(c)).length;
                const allInGroupSelected = selectedInGroup === codes.length;
                const partialInGroup = selectedInGroup > 0 && !allInGroupSelected;
                const isExpanded = expandedResources.has(resource);

                return (
                  <Paper key={resource} p="xs" withBorder>
                    <Group justify="space-between" wrap="nowrap">
                      <UnstyledButton onClick={() => handleToggleExpanded(resource)} style={{ flex: 1 }}>
                        <Group gap="xs">
                          {isExpanded ? <CaretDownIcon size={14} /> : <CaretRightIcon size={14} />}
                          <Text size="xs" fw={600} tt="uppercase">{resource}</Text>
                          <Badge size="xs" variant="light" color={allInGroupSelected ? 'green' : partialInGroup ? 'yellow' : 'gray'}>
                            {selectedInGroup}/{codes.length}
                          </Badge>
                        </Group>
                      </UnstyledButton>
                      <Checkbox
                        size="xs"
                        checked={allInGroupSelected}
                        indeterminate={partialInGroup}
                        onChange={() => handleToggleResource(resource, codes)}
                        aria-label={`Выбрать все в ${resource}`}
                      />
                    </Group>
                    <Collapse expanded={isExpanded}>
                      <SimpleGrid cols={2} spacing="xs" verticalSpacing={4} mt="xs">
                        {perms.map((p) => (
                          <Checkbox
                            key={p.code}
                            label={p.name}
                            size="xs"
                            checked={form.permissions.includes(p.code)}
                            onChange={() => handleTogglePermission(p.code)}
                          />
                        ))}
                      </SimpleGrid>
                    </Collapse>
                  </Paper>
                );
              })}
            </Stack>
          </ScrollArea.Autosize>

          <Group justify="flex-end" mt="md">
            <Button
              onClick={handleSave}
              loading={createRole.isPending || updateRole.isPending}
              disabled={!form.name}
            >
              {editingRole ? 'Сохранить' : 'Создать'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
};
