import { ShieldCheckIcon } from '@phosphor-icons/react';
import type { Permission } from '@/shared/api/types';
import { FormModal, FormModalFooter, FormSection } from '@/shared/ui';
import {
  groupPermissionsByResource,
  toggleCodeInList,
  toggleExpandedResource,
  toggleResourceCodes,
} from '../../lib/groupPermissions';
import { PermissionsResourceTree } from '../PermissionsResourceTree';
import { PermissionsTreeToolbar } from '../PermissionsTreeToolbar';

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

  const handleToggleExpanded = (resource: string) => {
    onExpandedResourcesChange(toggleExpandedResource(expandedResources, resource));
  };

  const handleExpandAll = () => {
    onExpandedResourcesChange(
      expandedResources.size === allResources.length ? new Set() : new Set(allResources),
    );
  };

  const handleSelectAllPerms = () => {
    onSelectedPermsChange(isAllPermsSelected ? [] : [...allPermissionCodes]);
  };

  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title="Разрешения"
      subtitle={staffLogin}
      icon={<ShieldCheckIcon size={22} />}
      size="lg"
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel="Сохранить"
          onSubmit={onSave}
          loading={isPending}
        />
      }
    >
      <FormSection
        title="Индивидуальные разрешения"
        hint="Эти разрешения добавляются к правам, полученным через роли"
      >
        <PermissionsTreeToolbar
          selectedCount={selectedPerms.length}
          totalCount={allPermissionCodes.length}
          allSelected={isAllPermsSelected}
          allExpanded={expandedResources.size === allResources.length}
          onToggleExpandAll={handleExpandAll}
          onToggleSelectAll={handleSelectAllPerms}
        />
        <PermissionsResourceTree
          permissionsByResource={permissionsByResource}
          selectedPerms={selectedPerms}
          expandedResources={expandedResources}
          onTogglePermission={(code) => onSelectedPermsChange(toggleCodeInList(selectedPerms, code))}
          onToggleResource={(_resource, codes) =>
            onSelectedPermsChange(toggleResourceCodes(selectedPerms, codes))
          }
          onToggleExpanded={handleToggleExpanded}
        />
      </FormSection>
    </FormModal>
  );
}
