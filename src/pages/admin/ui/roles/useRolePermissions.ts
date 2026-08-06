import React from 'react';
import type { Permission, Role } from '@/shared/api/types';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import {
  groupPermissionsByResource,
  toggleCodeInList,
  toggleExpandedResource,
  toggleResourceCodes,
} from '../../lib/groupPermissions';
import type { RoleForm } from './types';

interface UseRolePermissionsParams {
  opened: boolean;
  editingRole: Role | null;
  permissions: Permission[] | undefined;
  selectedPerms: number[];
  onFormChange: React.Dispatch<React.SetStateAction<RoleForm>>;
}

export function useRolePermissions({
  opened,
  editingRole,
  permissions,
  selectedPerms,
  onFormChange,
}: UseRolePermissionsParams) {
  const [expandedResources, setExpandedResources] = React.useState<Set<string>>(new Set());

  useResetOnOpen(opened ? (editingRole?.id ?? 'new') : false, () => setExpandedResources(new Set()));

  const permissionsByResource = React.useMemo(
    () => groupPermissionsByResource(permissions),
    [permissions],
  );

  const allPermissionCodes = React.useMemo(
    () => (permissions ?? []).map((p) => p.code),
    [permissions],
  );

  const isAllSelected =
    allPermissionCodes.length > 0 && allPermissionCodes.every((c) => selectedPerms.includes(c));

  const togglePermission = React.useCallback(
    (code: number) => {
      onFormChange((prev) => ({ ...prev, permissions: toggleCodeInList(prev.permissions, code) }));
    },
    [onFormChange],
  );

  const toggleResource = React.useCallback(
    (_resource: string, codes: number[]) => {
      onFormChange((prev) => ({
        ...prev,
        permissions: toggleResourceCodes(prev.permissions, codes),
      }));
    },
    [onFormChange],
  );

  const toggleSelectAll = React.useCallback(() => {
    onFormChange((prev) => ({
      ...prev,
      permissions:
        allPermissionCodes.length > 0 &&
        allPermissionCodes.every((c) => prev.permissions.includes(c))
          ? []
          : [...allPermissionCodes],
    }));
  }, [allPermissionCodes, onFormChange]);

  const toggleExpanded = React.useCallback((resource: string) => {
    setExpandedResources((prev) => toggleExpandedResource(prev, resource));
  }, []);

  const toggleExpandAll = React.useCallback(() => {
    setExpandedResources((prev) => {
      const allResources = Object.keys(permissionsByResource);
      return prev.size === allResources.length ? new Set() : new Set(allResources);
    });
  }, [permissionsByResource]);

  return {
    expandedResources,
    permissionsByResource,
    totalCount: allPermissionCodes.length,
    isAllSelected,
    isAllExpanded: expandedResources.size === Object.keys(permissionsByResource).length,
    togglePermission,
    toggleResource,
    toggleSelectAll,
    toggleExpanded,
    toggleExpandAll,
  };
}
