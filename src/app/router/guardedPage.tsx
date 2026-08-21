import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { PermissionGuard } from '@/app/router/PermissionGuard';
import type { PermissionCodeValue } from '@/shared/lib/permissions';
import { PageLoader } from './PageLoader';

export function guardedPage(
  page: ReactNode,
  permissions?: PermissionCodeValue[],
  adminOnly?: boolean,
) {
  return (
    <Suspense fallback={<PageLoader />}>
      <PermissionGuard permissions={permissions} adminOnly={adminOnly}>
        {page}
      </PermissionGuard>
    </Suspense>
  );
}
