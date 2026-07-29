import React from 'react';
import {
  Badge,
  Button,
  Checkbox,
  Group,
  Modal,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
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

  const permissionsByResource = React.useMemo(() => {
    if (!permissions) return {};
    return permissions.reduce<Record<string, Permission[]>>((acc, p) => {
      if (!acc[p.resource]) acc[p.resource] = [];
      acc[p.resource].push(p);
      return acc;
    }, {});
  }, [permissions]);

  const handleOpen = React.useCallback((role?: Role) => {
    if (role) {
      setEditingRole(role);
      setForm({ name: role.name, description: role.description ?? '', permissions: role.permissions });
    } else {
      setEditingRole(null);
      setForm(INITIAL_FORM);
    }
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

  const columns = React.useMemo(
    () => [
      { key: 'name', label: 'Название' },
      { key: 'description', label: 'Описание' },
      { key: 'permissions_count', label: 'Разрешений' },
      { key: 'actions', label: '' },
    ],
    [],
  );

  if (isLoading) return <Skeleton height={300} radius="md" />;

  return (
    <Stack gap="md">
      <Group justify="flex-end">
        <Button onClick={() => handleOpen()}>Создать роль</Button>
      </Group>

      <DataTable columns={columns} isEmpty={(roles ?? []).length === 0} emptyMessage="Нет ролей">
        {(roles ?? []).map((r) => (
          <DataTableRow key={r.id}>
            <Table.Td><Text size="sm">{r.name}</Text></Table.Td>
            <Table.Td><Text size="sm" c="dimmed">{r.description || '—'}</Text></Table.Td>
            <Table.Td><Badge variant="light">{r.permissions.length}</Badge></Table.Td>
            <Table.Td>
              <Button variant="subtle" size="xs" onClick={() => handleOpen(r)}>
                Редактировать
              </Button>
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

          <Text fw={500} size="sm" mt="sm">
            Разрешения
          </Text>

          <Stack gap="xs">
            {Object.entries(permissionsByResource).map(([resource, perms]) => (
              <Paper key={resource} p="sm" withBorder>
                <Text size="xs" fw={600} c="dimmed" mb="xs" tt="uppercase">
                  {resource}
                </Text>
                <SimpleGrid cols={2} spacing="xs" verticalSpacing={4}>
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
              </Paper>
            ))}
          </Stack>

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
