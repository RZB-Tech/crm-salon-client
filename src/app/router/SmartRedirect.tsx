import React from 'react';
import { Navigate } from 'react-router-dom';
import { Center, Loader } from '@mantine/core';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import type { PermissionCodeValue } from '@/shared/lib/permissions';

interface RouteEntry {
  path: string;
  permissions?: PermissionCodeValue[];
  adminOnly?: boolean;
}

const ROUTE_PRIORITY: RouteEntry[] = [
  { path: '/board', permissions: [PermissionCode.APPOINTMENT_READ, PermissionCode.APPOINTMENT_MANAGE] },
  { path: '/appointments', permissions: [PermissionCode.APPOINTMENT_READ, PermissionCode.APPOINTMENT_MANAGE] },
  { path: '/clients', permissions: [PermissionCode.CLIENT_READ, PermissionCode.CLIENT_MANAGE] },
  { path: '/services', permissions: [PermissionCode.SERVICE_READ, PermissionCode.SERVICE_MANAGE] },
  { path: '/employees', permissions: [PermissionCode.EMPLOYEE_READ, PermissionCode.EMPLOYEE_MANAGE] },
  { path: '/materials', permissions: [PermissionCode.MATERIAL_READ, PermissionCode.MATERIAL_MANAGE] },
  { path: '/finance', permissions: [PermissionCode.RECEIPT_READ, PermissionCode.RECEIPT_MANAGE, PermissionCode.PAYROLL_READ, PermissionCode.TRANSACTION_READ] },
  { path: '/notifications', permissions: [PermissionCode.NOTIFICATION_READ, PermissionCode.NOTIFICATION_MANAGE] },
  { path: '/settings', permissions: [PermissionCode.TENANT_PREFERENCES_READ, PermissionCode.TENANT_MANAGE] },
  { path: '/admin', adminOnly: true },
];

/**
 * Редирект на первую доступную страницу (по permissions текущего пользователя).
 */
export const SmartRedirect: React.FC = () => {
  const { ready, isAdmin, hasAnyPermission } = useAccess();

  if (!ready) {
    return (
      <Center h="100%">
        <Loader size="lg" />
      </Center>
    );
  }

  for (const route of ROUTE_PRIORITY) {
    if (route.adminOnly) {
      if (isAdmin) return <Navigate to={route.path} replace />;
      continue;
    }
    if (!route.permissions || isAdmin || hasAnyPermission(route.permissions)) {
      return <Navigate to={route.path} replace />;
    }
  }

  // Fallback — если вообще ничего не доступно
  return <Navigate to="/board" replace />;
};
