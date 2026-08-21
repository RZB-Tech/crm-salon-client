import React from 'react';
import { ScrollArea, Stack } from '@mantine/core';
import { useLocation } from 'react-router-dom';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { useI18n } from '@/shared/lib/i18n';
import { useTenantBranches } from '@/shared/api/hooks/useTenantBranches';
import { NAV_ITEMS } from '../lib/navItems';
import { SidebarNavItem } from './SidebarNavItem';
import styles from './sidebar.module.css';

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const { t } = useI18n();
  const { isAdmin, hasAnyPermission, ready } = useAccess();
  const { data: branchesData } = useTenantBranches(
    ready &&
      (isAdmin ||
        hasAnyPermission([
          PermissionCode.TENANT_BRANCH_READ,
          PermissionCode.TENANT_BRANCH_MANAGE,
          PermissionCode.TENANT_MANAGE,
        ])),
  );
  const isParentTenant = branchesData?.isParent === true;

  const visibleItems = React.useMemo(() => {
    if (!ready) return [];
    return NAV_ITEMS.filter((item) => {
      if (item.adminOnly) return isAdmin;
      if (item.parentTenantOnly && !isParentTenant) return false;
      if (item.permissions) return isAdmin || hasAnyPermission(item.permissions);
      return true;
    });
  }, [ready, isAdmin, hasAnyPermission, isParentTenant]);

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
      <ScrollArea className={styles.scroll} offsetScrollbars>
        <Stack gap={2} className={styles.navGroup}>
          {visibleItems.map((item) => (
            <SidebarNavItem
              key={item.path}
              item={item}
              collapsed={collapsed}
              active={location.pathname.startsWith(item.path)}
              label={t(item.labelKey)}
            />
          ))}
        </Stack>
      </ScrollArea>
    </aside>
  );
};
