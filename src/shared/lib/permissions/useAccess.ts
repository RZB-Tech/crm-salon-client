import React from 'react';
import { useMe } from '@/shared/api/hooks/useMe';
import type { MeResponse } from '@/shared/api/types';
import type { PermissionCodeValue } from './codes';
import { hasEffectivePermission } from './domainManage';

interface AccessResult {
  /** Данные загружены и можно проверять */
  ready: boolean;
  /** Администратор — полный доступ ко всему */
  isAdmin: boolean;
  /** Проверка одного permission-кода (admin всегда true) */
  hasPermission: (code: PermissionCodeValue) => boolean;
  /** Проверка: хотя бы один из кодов (admin всегда true) */
  hasAnyPermission: (codes: PermissionCodeValue[]) => boolean;
  /** Проверка: все коды (admin всегда true) */
  hasAllPermissions: (codes: PermissionCodeValue[]) => boolean;
  /** Текущий пользователь */
  me: MeResponse | undefined;
}

/**
 * Хук проверки доступа текущего пользователя.
 *
 * Логика как на бэке `require_permission`:
 * - `staff_type === 'administrator'` → полный доступ;
 * - employee → код из `me.permissions` или парный `*_MANAGE` домена.
 */
export const useAccess = (): AccessResult => {
  const { data: me, isSuccess } = useMe();

  const isAdmin = me?.staff_type === 'administrator';
  const effectivePermissions: number[] = me?.permissions ?? [];

  const hasPermission = React.useCallback(
    (code: PermissionCodeValue): boolean => {
      if (!isSuccess) return false;
      if (isAdmin) return true;
      return hasEffectivePermission(effectivePermissions, code);
    },
    [isSuccess, isAdmin, effectivePermissions],
  );

  const hasAnyPermission = React.useCallback(
    (codes: PermissionCodeValue[]): boolean => {
      if (!isSuccess) return false;
      if (isAdmin) return true;
      return codes.some((code) => hasEffectivePermission(effectivePermissions, code));
    },
    [isSuccess, isAdmin, effectivePermissions],
  );

  const hasAllPermissions = React.useCallback(
    (codes: PermissionCodeValue[]): boolean => {
      if (!isSuccess) return false;
      if (isAdmin) return true;
      return codes.every((code) => hasEffectivePermission(effectivePermissions, code));
    },
    [isSuccess, isAdmin, effectivePermissions],
  );

  return {
    ready: isSuccess,
    isAdmin,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    me,
  };
};
