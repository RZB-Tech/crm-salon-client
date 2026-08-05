import React from 'react';
import { Box, Skeleton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRoles, useCreateRole, useUpdateRole } from '@/shared/api/hooks/useRoles';
import { usePermissions } from '@/shared/api/hooks/usePermissions';
import { ListPanelBody, ListPaginationFooter, listPageStyles } from '@/shared/ui';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { useResolvedById } from '@/shared/lib/hooks/useResolvedById';
import type { Role, RoleCreatePayload } from '@/shared/api/types';
import { RoleFormModal } from './RoleFormModal';
import { RolesTable } from './RolesTable';
import { INITIAL_FORM } from './types';
import type { RoleForm } from './types';

export type RolesTabHandle = {
  openCreate: () => void;
};

interface RolesTabProps {
  showArchived: boolean;
}

export const RolesTab = React.forwardRef<RolesTabHandle, RolesTabProps>(function RolesTab(
  { showArchived },
  ref,
) {
  const { data: roles, isLoading } = useRoles();
  const { data: permissions } = usePermissions();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();

  const [opened, { open, close }] = useDisclosure(false);
  const [editingRoleId, setEditingRoleId] = React.useState<number | null>(null);
  const [form, setForm] = React.useState<RoleForm>(INITIAL_FORM);

  const editingRole = useResolvedById(roles, editingRoleId);

  const filteredRoles = React.useMemo(
    () => (roles ?? []).filter((r) => showArchived || !r.archived),
    [roles, showArchived],
  );

  const handleOpen = React.useCallback((role?: Role) => {
    if (role) {
      setEditingRoleId(role.id);
      setForm({ name: role.name, description: role.description ?? '', permissions: [...role.permissions] });
    } else {
      setEditingRoleId(null);
      setForm(INITIAL_FORM);
    }
    open();
  }, [open]);

  React.useImperativeHandle(ref, () => ({ openCreate: () => handleOpen() }), [handleOpen]);

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

  const { page, pageSize, paginatedItems, total, setPage, setPageSize, resetPage } = usePagination(
    filteredRoles,
    { defaultPageSize: 20 },
  );

  React.useEffect(() => {
    resetPage();
  }, [showArchived, resetPage]);

  if (isLoading) {
    return (
      <Box className={listPageStyles.panel} p="md">
        <Skeleton height={300} radius="md" />
      </Box>
    );
  }

  return (
    <Box className={listPageStyles.panel}>
      <ListPanelBody>
        <RolesTable
          roles={paginatedItems}
          onEdit={handleOpen}
          onToggleArchive={handleToggleArchive}
        />
      </ListPanelBody>

      <ListPaginationFooter
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      <RoleFormModal
        opened={opened}
        onClose={close}
        editingRole={editingRole}
        form={form}
        onFormChange={setForm}
        permissions={permissions}
        onSave={handleSave}
        isSaving={createRole.isPending || updateRole.isPending}
      />
    </Box>
  );
});
