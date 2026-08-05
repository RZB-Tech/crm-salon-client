import React from 'react';
import { Box, Skeleton } from '@mantine/core';
import { listPageStyles } from '@/shared/ui';
import { AssignRolesModal } from './AssignRolesModal';
import { CreateStaffModal } from './CreateStaffModal';
import { ResetPasswordAlert } from './ResetPasswordAlert';
import { ResetPasswordModal } from './ResetPasswordModal';
import { StaffDetailDrawer } from './StaffDetailDrawer';
import { StaffPermissionsModal } from './StaffPermissionsModal';
import { StaffTable } from './StaffTable';
import { useStaffTab } from './useStaffTab';
import type { StaffTabHandle } from './types';

export const StaffTab = React.forwardRef<StaffTabHandle>(function StaffTab(_props, ref) {
  const tab = useStaffTab();

  React.useImperativeHandle(ref, () => ({ openCreate: tab.openCreate }), [tab.openCreate]);

  if (tab.isLoading) {
    return (
      <Box className={listPageStyles.panel} p="md">
        <Skeleton height={300} radius="md" />
      </Box>
    );
  }

  return (
    <>
      <StaffTable staffList={tab.staffList ?? []} onSelectStaff={tab.handleSelectStaff} />

      <StaffDetailDrawer
        opened={tab.drawerOpened}
        onClose={tab.closeDrawer}
        staff={tab.selectedStaff}
        getPermissionNames={tab.getPermissionNames}
        onOpenRoles={tab.handleOpenRoles}
        onOpenPerms={tab.handleOpenPerms}
        onOpenReset={tab.handleOpenReset}
      />

      {tab.resetResult && !tab.resetOpened && (
        <ResetPasswordAlert password={tab.resetResult} onClose={() => tab.setResetResult(null)} />
      )}

      <CreateStaffModal
        opened={tab.createOpened}
        onClose={tab.closeCreate}
        form={tab.form}
        onFormChange={tab.setForm}
        onCreate={tab.handleCreate}
        isPending={tab.createStaff.isPending}
        createdPassword={tab.createdPassword}
      />

      <AssignRolesModal
        opened={tab.rolesOpened}
        onClose={tab.closeRoles}
        staffLogin={tab.editingStaff?.login ?? ''}
        rolesOptions={tab.rolesOptions}
        selectedRoleIds={tab.selectedRoleIds}
        onSelectedRoleIdsChange={tab.setSelectedRoleIds}
        onSave={tab.handleSaveRoles}
        isPending={tab.assignRoles.isPending}
      />

      <StaffPermissionsModal
        opened={tab.permsOpened}
        onClose={tab.closePerms}
        staffLogin={tab.permsStaff?.login ?? ''}
        permissions={tab.permissions}
        selectedPerms={tab.selectedPerms}
        onSelectedPermsChange={tab.setSelectedPerms}
        expandedResources={tab.expandedResources}
        onExpandedResourcesChange={tab.setExpandedResources}
        onSave={tab.handleSavePerms}
        isPending={tab.updatePermissions.isPending}
      />

      <ResetPasswordModal
        opened={tab.resetOpened}
        onClose={tab.closeReset}
        staffLogin={tab.resetStaff?.login ?? ''}
        resetResult={tab.resetResult}
        customPassword={tab.customPassword}
        onCustomPasswordChange={tab.setCustomPassword}
        onResetRandom={tab.handleResetRandom}
        isPending={tab.resetPassword.isPending}
      />
    </>
  );
});

export type { StaffTabHandle } from './types';
