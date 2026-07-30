import React from 'react';
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Checkbox,
  Collapse,
  CopyButton,
  Divider,
  Drawer,
  Group,
  Modal,
  MultiSelect,
  Paper,
  PasswordInput,
  ScrollArea,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
  Select,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  CaretDownIcon,
  CaretRightIcon,
  Check,
  Copy,
  DotsThreeVerticalIcon,
} from '@phosphor-icons/react';
import {
  useStaffList,
  useCreateStaff,
  useAssignStaffRoles,
  useUpdateStaffPermissions,
} from '@/shared/api/hooks/useStaff';
import { useRoles } from '@/shared/api/hooks/useRoles';
import { usePermissions } from '@/shared/api/hooks/usePermissions';
import { useResetPassword } from '@/shared/api/hooks/useAuth';
import { DataTable, DataTableRow } from '@/shared/ui';
import { formatDateTime } from '@/shared/lib/format';
import type { Permission, Staff, StaffCreatePayload, StaffType } from '@/shared/api/types';

interface CreateForm {
  login: string;
  firstname: string;
  lastname: string;
  staff_type: StaffType;
  employee_id: string;
  password: string;
}

const INITIAL_FORM: CreateForm = {
  login: '',
  firstname: '',
  lastname: '',
  staff_type: 'employee',
  employee_id: '',
  password: '',
};

export const StaffTab: React.FC = () => {
  const { data: staffList, isLoading } = useStaffList();
  const { data: roles } = useRoles();
  const { data: permissions } = usePermissions();
  const createStaff = useCreateStaff();
  const assignRoles = useAssignStaffRoles();
  const updatePermissions = useUpdateStaffPermissions();
  const resetPassword = useResetPassword();

  const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const [rolesOpened, { open: openRoles, close: closeRoles }] = useDisclosure(false);
  const [permsOpened, { open: openPerms, close: closePerms }] = useDisclosure(false);
  const [resetOpened, { open: openReset, close: closeReset }] = useDisclosure(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);

  const [form, setForm] = React.useState<CreateForm>(INITIAL_FORM);
  const [createdPassword, setCreatedPassword] = React.useState<string | null>(null);

  // Detail drawer state
  const [selectedStaff, setSelectedStaff] = React.useState<Staff | null>(null);

  // Roles modal state
  const [editingStaff, setEditingStaff] = React.useState<Staff | null>(null);
  const [selectedRoleIds, setSelectedRoleIds] = React.useState<string[]>([]);

  // Permissions modal state
  const [permsStaff, setPermsStaff] = React.useState<Staff | null>(null);
  const [selectedPerms, setSelectedPerms] = React.useState<number[]>([]);
  const [expandedResources, setExpandedResources] = React.useState<Set<string>>(new Set());

  // Reset password state
  const [resetStaff, setResetStaff] = React.useState<Staff | null>(null);
  const [resetResult, setResetResult] = React.useState<string | null>(null);
  const [customPassword, setCustomPassword] = React.useState('');

  // ─── Permissions helpers ──────────────────────────────────────────────────

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

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleSelectStaff = React.useCallback((staff: Staff) => {
    setSelectedStaff(staff);
    openDrawer();
  }, [openDrawer]);

  const handleCreate = React.useCallback(() => {
    const payload: StaffCreatePayload = {
      login: form.login,
      firstname: form.firstname || undefined,
      lastname: form.lastname || undefined,
      staff_type: form.staff_type,
      employee_id: form.employee_id ? Number(form.employee_id) : undefined,
      password: form.password || undefined,
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

  const handleOpenPerms = React.useCallback((staff: Staff) => {
    setPermsStaff(staff);
    setSelectedPerms([...staff.permissions]);
    setExpandedResources(new Set());
    openPerms();
  }, [openPerms]);

  const handleSavePerms = React.useCallback(() => {
    if (!permsStaff) return;
    updatePermissions.mutate(
      { id: permsStaff.id, permissions: selectedPerms },
      { onSuccess: closePerms },
    );
  }, [permsStaff, selectedPerms, updatePermissions, closePerms]);

  const handleTogglePermission = React.useCallback((code: number) => {
    setSelectedPerms((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  }, []);

  const handleToggleResource = React.useCallback((_resource: string, codes: number[]) => {
    setSelectedPerms((prev) => {
      const allSelected = codes.every((c) => prev.includes(c));
      if (allSelected) {
        const codesSet = new Set(codes);
        return prev.filter((c) => !codesSet.has(c));
      }
      return [...new Set([...prev, ...codes])];
    });
  }, []);

  const handleSelectAllPerms = React.useCallback(() => {
    setSelectedPerms((prev) => {
      const allSelected = allPermissionCodes.length > 0 && allPermissionCodes.every((c) => prev.includes(c));
      return allSelected ? [] : [...allPermissionCodes];
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

  const handleOpenReset = React.useCallback((staff: Staff) => {
    setResetStaff(staff);
    setResetResult(null);
    setCustomPassword('');
    openReset();
  }, [openReset]);

  const handleResetRandom = React.useCallback(() => {
    if (!resetStaff) return;
    resetPassword.mutate(resetStaff.id, {
      onSuccess: (result) => {
        setResetResult(result.new_password);
      },
    });
  }, [resetStaff, resetPassword]);

  // ─── Derived ──────────────────────────────────────────────────────────────

  const rolesOptions = React.useMemo(
    () => (roles ?? []).map((r) => ({ value: String(r.id), label: r.name })),
    [roles],
  );

  const isAllPermsSelected = allPermissionCodes.length > 0 && allPermissionCodes.every((c) => selectedPerms.includes(c));

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

  // Resolve permission names for display
  const getPermissionNames = React.useCallback((codes: number[]) => {
    if (!permissions) return [];
    return codes
      .map((code) => permissions.find((p) => p.code === code))
      .filter(Boolean) as Permission[];
  }, [permissions]);

  if (isLoading) return <Skeleton height={300} radius="md" />;

  return (
    <Stack gap="md">
      <Group justify="flex-end">
        <Button onClick={openCreate}>Создать пользователя</Button>
      </Group>

      <DataTable columns={columns} isEmpty={(staffList ?? []).length === 0} emptyMessage="Нет пользователей">
        {(staffList ?? []).map((s) => (
          <DataTableRow key={s.id} onClick={() => handleSelectStaff(s)} style={{ cursor: 'pointer' }}>
            <Table.Td><Text size="sm">{s.login}</Text></Table.Td>
            <Table.Td><Text size="sm">{[s.firstname, s.lastname].filter(Boolean).join(' ') || '—'}</Text></Table.Td>
            <Table.Td>
              <Badge
                color={s.roles.some((r) => r.name.toLowerCase().includes('admin')) ? 'violet' : 'blue'}
                variant="light"
                size="sm"
              >
                {s.roles.length > 0 ? s.roles.map((r) => r.name).join(', ') : '—'}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Badge color={s.active ? 'green' : 'gray'} variant="dot" size="sm">
                {s.active ? 'Активен' : 'Неактивен'}
              </Badge>
            </Table.Td>
            <Table.Td>
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={(e) => { e.stopPropagation(); handleOpenReset(s); }}
              >
                <DotsThreeVerticalIcon size={16} />
              </ActionIcon>
            </Table.Td>
          </DataTableRow>
        ))}
      </DataTable>

      {/* Staff Detail Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        title="Карточка пользователя"
        position="right"
        size="md"
      >
        {selectedStaff && (
          <Stack gap="md">
            {/* Header */}
            <Paper p="md" withBorder>
              <Group justify="space-between" align="flex-start">
                <Box>
                  <Text size="lg" fw={600}>
                    {[selectedStaff.firstname, selectedStaff.middlename, selectedStaff.lastname].filter(Boolean).join(' ') || '—'}
                  </Text>
                  <Text size="sm" c="dimmed">{selectedStaff.login}</Text>
                </Box>
                <Badge color={selectedStaff.active ? 'green' : 'gray'} variant="dot" size="lg">
                  {selectedStaff.active ? 'Активен' : 'Неактивен'}
                </Badge>
              </Group>
            </Paper>

            {/* Info */}
            <Paper p="md" withBorder>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">ID</Text>
                  <Text size="sm" fw={500}>{selectedStaff.id}</Text>
                </Group>
                <Divider />
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Логин</Text>
                  <Text size="sm" fw={500}>{selectedStaff.login}</Text>
                </Group>
                <Divider />
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Имя</Text>
                  <Text size="sm" fw={500}>{selectedStaff.firstname || '—'}</Text>
                </Group>
                <Divider />
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Фамилия</Text>
                  <Text size="sm" fw={500}>{selectedStaff.lastname || '—'}</Text>
                </Group>
                <Divider />
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Отчество</Text>
                  <Text size="sm" fw={500}>{selectedStaff.middlename || '—'}</Text>
                </Group>
                <Divider />
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Привязка к сотруднику</Text>
                  <Text size="sm" fw={500}>{selectedStaff.employee_id ? `#${selectedStaff.employee_id}` : '—'}</Text>
                </Group>
                <Divider />
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Создан</Text>
                  <Text size="sm" fw={500}>{formatDateTime(selectedStaff.created_at)}</Text>
                </Group>
                <Divider />
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Обновлён</Text>
                  <Text size="sm" fw={500}>{formatDateTime(selectedStaff.updated_at)}</Text>
                </Group>
              </Stack>
            </Paper>

            {/* Roles */}
            <Paper p="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={600}>Роли</Text>
                <Button variant="subtle" size="xs" onClick={() => handleOpenRoles(selectedStaff)}>
                  Изменить
                </Button>
              </Group>
              {selectedStaff.roles.length > 0 ? (
                <Group gap="xs">
                  {selectedStaff.roles.map((r) => (
                    <Badge key={r.id} variant="light" color="blue">{r.name}</Badge>
                  ))}
                </Group>
              ) : (
                <Text size="sm" c="dimmed">Нет назначенных ролей</Text>
              )}
            </Paper>

            {/* Permissions */}
            <Paper p="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Group gap="xs">
                  <Text size="sm" fw={600}>Индивидуальные разрешения</Text>
                  <Badge size="sm" variant="light" color={selectedStaff.permissions.length > 0 ? 'teal' : 'gray'}>
                    {selectedStaff.permissions.length}
                  </Badge>
                </Group>
                <Button variant="subtle" size="xs" onClick={() => handleOpenPerms(selectedStaff)}>
                  Изменить
                </Button>
              </Group>
              {selectedStaff.permissions.length > 0 ? (
                <ScrollArea.Autosize mah={150} type="auto">
                  <Stack gap={4}>
                    {getPermissionNames(selectedStaff.permissions).map((p) => (
                      <Text key={p.code} size="xs" c="dimmed">
                        {p.resource} → {p.name}
                      </Text>
                    ))}
                  </Stack>
                </ScrollArea.Autosize>
              ) : (
                <Text size="sm" c="dimmed">Нет прямых разрешений (только через роли)</Text>
              )}
            </Paper>

            {/* Actions */}
            <Divider />
            <Group>
              <Button variant="light" color="orange" size="sm" onClick={() => handleOpenReset(selectedStaff)}>
                Сбросить пароль
              </Button>
            </Group>
          </Stack>
        )}
      </Drawer>

      {/* Reset password result */}
      {resetResult && !resetOpened && (
        <Alert
          color="green"
          title="Пароль сброшен"
          withCloseButton
          onClose={() => setResetResult(null)}
        >
          <Group gap="xs">
            <Text size="sm">Новый пароль:</Text>
            <Text size="sm" fw={600} ff="monospace">{resetResult}</Text>
            <CopyButton value={resetResult}>
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
          <PasswordInput
            label="Пароль"
            description="Если не указан, будет сгенерирован автоматически"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.currentTarget.value })}
            placeholder="Мин. 6 символов"
          />
          <Button onClick={handleCreate} loading={createStaff.isPending} disabled={!form.login}>
            Создать
          </Button>

          {createdPassword && (
            <Alert color="green" title="Пользователь создан">
              <Group gap="xs">
                <Text size="sm">Пароль:</Text>
                <Text size="sm" fw={600} ff="monospace">{createdPassword}</Text>
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

      {/* Staff Permissions Modal */}
      <Modal
        opened={permsOpened}
        onClose={closePerms}
        title={`Разрешения — ${permsStaff?.login ?? ''}`}
        size="lg"
      >
        <Stack gap="sm">
          <Group justify="space-between">
            <Group gap="xs">
              <Text fw={500} size="sm">Индивидуальные разрешения</Text>
              <Badge size="sm" variant="light" color={isAllPermsSelected ? 'green' : 'gray'}>
                {selectedPerms.length} / {allPermissionCodes.length}
              </Badge>
            </Group>
            <Group gap="xs">
              <Button variant="subtle" size="xs" onClick={handleExpandAll}>
                {expandedResources.size === Object.keys(permissionsByResource).length ? 'Свернуть все' : 'Развернуть все'}
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

          <ScrollArea.Autosize mah={400} type="auto">
            <Stack gap="xs">
              {Object.entries(permissionsByResource).map(([resource, perms]) => {
                const codes = perms.map((p) => p.code);
                const selectedInGroup = codes.filter((c) => selectedPerms.includes(c)).length;
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
                            checked={selectedPerms.includes(p.code)}
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
            <Button onClick={handleSavePerms} loading={updatePermissions.isPending}>
              Сохранить
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        opened={resetOpened}
        onClose={closeReset}
        title={`Сброс пароля — ${resetStaff?.login ?? ''}`}
        size="sm"
      >
        <Stack gap="sm">
          {!resetResult ? (
            <>
              <PasswordInput
                label="Новый пароль"
                description="Оставьте пустым для генерации случайного"
                value={customPassword}
                onChange={(e) => setCustomPassword(e.currentTarget.value)}
                placeholder="Мин. 6 символов"
              />
              {customPassword && customPassword.length < 6 && (
                <Text size="xs" c="red">Минимум 6 символов</Text>
              )}
              <Button
                onClick={handleResetRandom}
                loading={resetPassword.isPending}
                disabled={customPassword.length > 0 && customPassword.length < 6}
              >
                {customPassword ? 'Задать пароль' : 'Сгенерировать случайный'}
              </Button>
              {customPassword && (
                <Paper p="xs" withBorder>
                  <Text size="xs" c="dimmed">
                    Пользовательский пароль пока не поддерживается бэкендом. Будет сгенерирован случайный.
                  </Text>
                </Paper>
              )}
            </>
          ) : (
            <Alert color="green" title="Пароль установлен">
              <Group gap="xs">
                <Text size="sm">Новый пароль:</Text>
                <Text size="sm" fw={600} ff="monospace">{resetResult}</Text>
                <CopyButton value={resetResult}>
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
    </Stack>
  );
};
