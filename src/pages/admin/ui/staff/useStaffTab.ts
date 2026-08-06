import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  useStaffList,
  useCreateStaff,
  useAssignStaffRoles,
  useUpdateStaffPermissions,
} from '@/shared/api/hooks/useStaff';
import { useRoles } from '@/shared/api/hooks/useRoles';
import { usePermissions } from '@/shared/api/hooks/usePermissions';
import { useResetPassword } from '@/shared/api/hooks/useAuth';
import type { Permission, Staff, StaffCreatePayload } from '@/shared/api/types';
import { INITIAL_FORM, type CreateForm } from './types';

export function useStaffTab() {
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
  const [detailOpened, { open: openDetail, close: closeDetail }] = useDisclosure(false);

  const [form, setForm] = React.useState<CreateForm>(INITIAL_FORM);
  const [createdPassword, setCreatedPassword] = React.useState<string | null>(null);
  const [selectedStaffId, setSelectedStaffId] = React.useState<number | null>(null);
  const [editingStaffId, setEditingStaffId] = React.useState<number | null>(null);
  const [selectedRoleIds, setSelectedRoleIds] = React.useState<string[]>([]);
  const [permsStaffId, setPermsStaffId] = React.useState<number | null>(null);
  const [selectedPerms, setSelectedPerms] = React.useState<number[]>([]);
  const [expandedResources, setExpandedResources] = React.useState<Set<string>>(new Set());
  const [resetStaffId, setResetStaffId] = React.useState<number | null>(null);
  const [resetResult, setResetResult] = React.useState<string | null>(null);
  const [customPassword, setCustomPassword] = React.useState('');

  const resolveStaff = React.useCallback(
    (id: number | null) => (id == null ? null : (staffList ?? []).find((s) => s.id === id) ?? null),
    [staffList],
  );
  const selectedStaff = resolveStaff(selectedStaffId);
  const editingStaff = resolveStaff(editingStaffId);
  const permsStaff = resolveStaff(permsStaffId);
  const resetStaff = resolveStaff(resetStaffId);

  const handleSelectStaff = React.useCallback(
    (staff: Staff) => {
      setSelectedStaffId(staff.id);
      openDetail();
    },
    [openDetail],
  );

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

  const handleOpenRoles = React.useCallback(
    (staff: Staff) => {
      setEditingStaffId(staff.id);
      setSelectedRoleIds(staff.roles.map((r) => String(r.id)));
      openRoles();
    },
    [openRoles],
  );

  const handleSaveRoles = React.useCallback(() => {
    if (!editingStaff) return;
    assignRoles.mutate(
      { id: editingStaff.id, role_ids: selectedRoleIds.map(Number) },
      { onSuccess: () => closeRoles() },
    );
  }, [editingStaff, selectedRoleIds, assignRoles, closeRoles]);

  const handleOpenPerms = React.useCallback(
    (staff: Staff) => {
      setPermsStaffId(staff.id);
      setSelectedPerms([...staff.permissions]);
      setExpandedResources(new Set());
      openPerms();
    },
    [openPerms],
  );

  const handleSavePerms = React.useCallback(() => {
    if (!permsStaff) return;
    updatePermissions.mutate(
      { id: permsStaff.id, permissions: selectedPerms },
      { onSuccess: () => closePerms() },
    );
  }, [permsStaff, selectedPerms, updatePermissions, closePerms]);

  const handleOpenReset = React.useCallback(
    (staff: Staff) => {
      setResetStaffId(staff.id);
      setResetResult(null);
      setCustomPassword('');
      openReset();
    },
    [openReset],
  );

  const handleResetRandom = React.useCallback(() => {
    if (!resetStaff) return;
    resetPassword.mutate(resetStaff.id, {
      onSuccess: (result) => setResetResult(result.new_password),
    });
  }, [resetStaff, resetPassword]);

  const rolesOptions = React.useMemo(
    () => (roles ?? []).map((r) => ({ value: String(r.id), label: r.name })),
    [roles],
  );

  const getPermissionNames = React.useCallback(
    (codes: number[]) => {
      if (!permissions) return [];
      return codes
        .map((code) => permissions.find((p) => p.code === code))
        .filter(Boolean) as Permission[];
    },
    [permissions],
  );

  return {
    staffList,
    isLoading,
    permissions,
    createOpened,
    closeCreate,
    openCreate,
    rolesOpened,
    closeRoles,
    permsOpened,
    closePerms,
    resetOpened,
    closeReset,
    detailOpened,
    closeDetail,
    form,
    setForm,
    createdPassword,
    selectedStaff,
    editingStaff,
    permsStaff,
    resetStaff,
    selectedRoleIds,
    setSelectedRoleIds,
    selectedPerms,
    setSelectedPerms,
    expandedResources,
    setExpandedResources,
    resetResult,
    setResetResult,
    customPassword,
    setCustomPassword,
    handleSelectStaff,
    handleCreate,
    handleOpenRoles,
    handleSaveRoles,
    handleOpenPerms,
    handleSavePerms,
    handleOpenReset,
    handleResetRandom,
    rolesOptions,
    getPermissionNames,
    createStaff,
    assignRoles,
    updatePermissions,
    resetPassword,
  };
}
