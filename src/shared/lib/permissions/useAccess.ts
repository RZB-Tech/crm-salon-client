import React from 'react';
import { useMe } from '@/shared/api/hooks/useMe';
import type { MeResponse } from '@/shared/api/types';
import type { PermissionCodeValue } from './codes';

interface MeWithPermissions extends MeResponse {
  permissions?: number[];
}

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
 * Логика:
 * - `staff_type === 'administrator'` → полный доступ (как на бэке).
 * - Для employee → проверка по `me.permissions` (effective permissions из бэкенда).
 */
export const useAccess = (): AccessResult => {
  const { data: me, isSuccess } = useMe();

  const isAdmin = me?.staff_type === 'administrator';

  const effectivePermissions: number[] = (me as MeWithPermissions)?.permissions ?? [];

  const hasPermission = React.useCallback(
    (code: PermissionCodeValue): boolean => {
      if (!isSuccess) return false;
      if (isAdmin) return true;
      return effectivePermissions.includes(code);
    },
    [isSuccess, isAdmin, effectivePermissions],
  );

  const hasAnyPermission = React.useCallback(
    (codes: PermissionCodeValue[]): boolean => {
      if (!isSuccess) return false;
      if (isAdmin) return true;
      return codes.some((c) => effectivePermissions.includes(c));
    },
    [isSuccess, isAdmin, effectivePermissions],
  );

  const hasAllPermissions = React.useCallback(
    (codes: PermissionCodeValue[]): boolean => {
      if (!isSuccess) return false;
      if (isAdmin) return true;
      return codes.every((c) => effectivePermissions.includes(c));
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
