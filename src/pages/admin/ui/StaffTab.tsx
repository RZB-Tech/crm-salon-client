import React from 'react';
import {
  Badge,
  Button,
  Group,
  Modal,
  MultiSelect,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Select,
  CopyButton,
  ActionIcon,
  Tooltip,
  Alert,
  Paper,
  Table,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Copy, Check } from '@phosphor-icons/react';
import { useStaffList, useCreateStaff, useAssignStaffRoles } from '@/shared/api/hooks/useStaff';
import { useRoles } from '@/shared/api/hooks/useRoles';
import { DataTable, DataTableRow } from '@/shared/ui';
import type { Staff, StaffCreatePayload, StaffType } from '@/shared/api/types';

interface CreateForm {
  login: string;
  firstname: string;
  lastname: string;
  staff_type: StaffType;
  employee_id: string;
}

const INITIAL_FORM: CreateForm = {
  login: '',
  firstname: '',
  lastname: '',
  staff_type: 'employee',
  employee_id: '',
};

export const StaffTab: React.FC = () => {
  const { data: staffList, isLoading } = useStaffList();
  const { data: roles } = useRoles();
  const createStaff = useCreateStaff();
  const assignRoles = useAssignStaffRoles();

  const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const [rolesOpened, { open: openRoles, close: closeRoles }] = useDisclosure(false);
  const [form, setForm] = React.useState<CreateForm>(INITIAL_FORM);
  const [createdPassword, setCreatedPassword] = React.useState<string | null>(null);
  const [editingStaff, setEditingStaff] = React.useState<Staff | null>(null);
  const [selectedRoleIds, setSelectedRoleIds] = React.useState<string[]>([]);

  const handleCreate = React.useCallback(() => {
    const payload: StaffCreatePayload = {
      login: form.login,
      firstname: form.firstname || undefined,
      lastname: form.lastname || undefined,
      staff_type: form.staff_type,
      employee_id: form.employee_id ? Number(form.employee_id) : undefined,
    };
    createStaff.mutate(payload, {
      onSuccess: (result) => {
        setCreatedPassword(result.password);
        setForm(INITIAL_FORM);
      },
    });
  }, [form, createStaff]);

  const handleOpenRoles = React.useCallback((staff: Staff) => {
    setEditingStaff(staff);
    setSelectedRoleIds(staff.roles.map((r) => String(r.id)));
    openRoles();
  }, [openRoles]);

  const handleSaveRoles = React.useCallback(() => {
    if (!editingStaff) return;
    assignRoles.mutate(
      { id: editingStaff.id, role_ids: selectedRoleIds.map(Number) },
      { onSuccess: closeRoles },
    );
  }, [editingStaff, selectedRoleIds, assignRoles, closeRoles]);

  const rolesOptions = React.useMemo(
    () => (roles ?? []).map((r) => ({ value: String(r.id), label: r.name })),
    [roles],
  );

  const columns = React.useMemo(
    () => [
      { key: 'login', label: 'Логин' },
      { key: 'name', label: 'Имя' },
      { key: 'roles', label: 'Роли' },
      { key: 'status', label: 'Статус' },
      { key: 'actions', label: '' },
    ],
    [],
  );

  if (isLoading) return <Skeleton height={300} radius="md" />;

  return (
    <Stack gap="md">
      <Group justify="flex-end">
        <Button onClick={openCreate}>Создать пользователя</Button>
      </Group>

      <DataTable columns={columns} isEmpty={(staffList ?? []).length === 0} emptyMessage="Нет пользователей">
        {(staffList ?? []).map((s) => (
          <DataTableRow key={s.id}>
            <Table.Td><Text size="sm">{s.login}</Text></Table.Td>
            <Table.Td><Text size="sm">{[s.firstname, s.lastname].filter(Boolean).join(' ') || '—'}</Text></Table.Td>
            <Table.Td>
              <Badge color={s.roles.some((r) => r.name.toLowerCase().includes('admin')) ? 'violet' : 'blue'} variant="light" size="sm">
                {s.roles.length > 0 ? s.roles.map((r) => r.name).join(', ') : '—'}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Badge color={s.active ? 'green' : 'gray'} variant="dot" size="sm">
                {s.active ? 'Активен' : 'Неактивен'}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Button variant="subtle" size="xs" onClick={() => handleOpenRoles(s)}>
                Роли
              </Button>
            </Table.Td>
          </DataTableRow>
        ))}
      </DataTable>

      {/* Create Staff Modal */}
      <Modal opened={createOpened} onClose={closeCreate} title="Новый пользователь" size="md">
        <Stack gap="sm">
          <TextInput
            label="Логин"
            required
            value={form.login}
            onChange={(e) => setForm({ ...form, login: e.currentTarget.value })}
          />
          <Group grow>
            <TextInput
              label="Имя"
              value={form.firstname}
              onChange={(e) => setForm({ ...form, firstname: e.currentTarget.value })}
            />
            <TextInput
              label="Фамилия"
              value={form.lastname}
              onChange={(e) => setForm({ ...form, lastname: e.currentTarget.value })}
            />
          </Group>
          <Select
            label="Тип"
            data={[
              { value: 'employee', label: 'Сотрудник' },
              { value: 'administrator', label: 'Администратор' },
            ]}
            value={form.staff_type}
            onChange={(v) => setForm({ ...form, staff_type: (v as StaffType) ?? 'employee' })}
          />
          <Button onClick={handleCreate} loading={createStaff.isPending} disabled={!form.login}>
            Создать
          </Button>

          {createdPassword && (
            <Alert color="green" title="Пользователь создан">
              <Group gap="xs">
                <Text size="sm">Пароль:</Text>
                <Text size="sm" fw={600} ff="monospace">
                  {createdPassword}
                </Text>
                <CopyButton value={createdPassword}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? 'Скопировано' : 'Копировать'}>
                      <ActionIcon variant="subtle" size="sm" onClick={copy}>
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              </Group>
            </Alert>
          )}
        </Stack>
      </Modal>

      {/* Assign Roles Modal */}
      <Modal opened={rolesOpened} onClose={closeRoles} title={`Роли — ${editingStaff?.login ?? ''}`} size="sm">
        <Stack gap="sm">
          <MultiSelect
            label="Назначенные роли"
            data={rolesOptions}
            value={selectedRoleIds}
            onChange={setSelectedRoleIds}
            searchable
            placeholder="Выберите роли"
          />
          <Paper p="xs" withBorder>
            <Text size="xs" c="dimmed">
              Текущие права через роли будут применены после сохранения
            </Text>
          </Paper>
          <Button onClick={handleSaveRoles} loading={assignRoles.isPending}>
            Сохранить
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
};
