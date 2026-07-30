import React from 'react';
import { Navigate } from 'react-router-dom';
import { Center, Loader } from '@mantine/core';
import { useAccess } from '@/shared/lib/permissions';
import type { PermissionCodeValue } from '@/shared/lib/permissions';

interface PermissionGuardProps {
  /** Хотя бы один из кодов должен быть у пользователя */
  permissions?: PermissionCodeValue[];
  /** Только для administrator */
  adminOnly?: boolean;
  children: React.ReactNode;
}

/**
 * Guard-обёртка для роутов с проверкой прав.
 * - admin всегда проходит
 * - employee проверяется по effective permissions
 * - При отсутствии доступа → redirect на "/" (SmartRedirect подберёт первую доступную)
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permissions,
  adminOnly,
  children,
}) => {
  const { ready, isAdmin, hasAnyPermission } = useAccess();

  if (!ready) {
    return (
      <Center h="100%">
        <Loader size="lg" />
      </Center>
    );
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (permissions && !isAdmin && !hasAnyPermission(permissions)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
