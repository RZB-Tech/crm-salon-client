import React from 'react';
import { ScrollArea, Stack, Tooltip } from '@mantine/core';
import { NavLink, useLocation } from 'react-router-dom';
import {
  ScissorsIcon,
  TagIcon,
  TicketIcon,
  UserListIcon,
  SquaresFourIcon,
  UsersIcon,
  PackageIcon,
  CurrencyCircleDollarIcon,
  BellIcon,
  GearSixIcon,
  ShieldCheckIcon,
  CalendarCheckIcon,
  BuildingsIcon,
} from '@phosphor-icons/react';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import type { PermissionCodeValue } from '@/shared/lib/permissions';
import { useI18n } from '@/shared/lib/i18n';
import { useTenantBranches } from '@/shared/api/hooks/useTenantBranches';
import styles from './sidebar.module.css';

interface SidebarProps {
  collapsed: boolean;
}

interface NavItem {
  path: string;
  labelKey: string;
  Icon: React.ElementType;
  /** Коды разрешений — достаточно хотя бы одного. undefined = доступно всем */
  permissions?: PermissionCodeValue[];
  /** Только для admin */
  adminOnly?: boolean;
  /** Только головная организация (не филиал) */
  parentTenantOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    path: '/board',
    labelKey: 'nav.board',
    Icon: SquaresFourIcon,
    permissions: [PermissionCode.APPOINTMENT_READ, PermissionCode.APPOINTMENT_MANAGE],
  },
  {
    path: '/appointments',
    labelKey: 'nav.appointments',
    Icon: CalendarCheckIcon,
    permissions: [PermissionCode.APPOINTMENT_READ, PermissionCode.APPOINTMENT_MANAGE],
  },
  {
    path: '/clients',
    labelKey: 'nav.clients',
    Icon: UsersIcon,
    permissions: [PermissionCode.CLIENT_READ, PermissionCode.CLIENT_MANAGE],
  },
  {
    path: '/services',
    labelKey: 'nav.services',
    Icon: ScissorsIcon,
    permissions: [PermissionCode.SERVICE_READ, PermissionCode.SERVICE_MANAGE],
  },
  {
    path: '/promotions',
    labelKey: 'nav.promotions',
    Icon: TagIcon,
    permissions: [PermissionCode.PROMOTION_GET, PermissionCode.PROMOTION_MANAGE],
  },
  {
    path: '/gift-cards',
    labelKey: 'nav.giftCards',
    Icon: TicketIcon,
    permissions: [PermissionCode.GIFT_CARD_GET, PermissionCode.GIFT_CARD_MANAGE],
  },
  {
    path: '/employees',
    labelKey: 'nav.employees',
    Icon: UserListIcon,
    permissions: [PermissionCode.EMPLOYEE_READ, PermissionCode.EMPLOYEE_MANAGE],
  },
  {
    path: '/materials',
    labelKey: 'nav.materials',
    Icon: PackageIcon,
    permissions: [PermissionCode.MATERIAL_READ, PermissionCode.MATERIAL_MANAGE],
  },
  {
    path: '/finance',
    labelKey: 'nav.finance',
    Icon: CurrencyCircleDollarIcon,
    permissions: [
      PermissionCode.RECEIPT_READ,
      PermissionCode.RECEIPT_MANAGE,
      PermissionCode.PAYROLL_READ,
      PermissionCode.PAYROLL_MANAGE,
      PermissionCode.TRANSACTION_READ,
      PermissionCode.TRANSACTION_MANAGE,
    ],
  },
  {
    path: '/notifications',
    labelKey: 'nav.notifications',
    Icon: BellIcon,
    permissions: [PermissionCode.NOTIFICATION_READ, PermissionCode.NOTIFICATION_MANAGE],
  },
  {
    path: '/settings',
    labelKey: 'nav.settings',
    Icon: GearSixIcon,
    permissions: [PermissionCode.TENANT_PREFERENCES_READ, PermissionCode.TENANT_MANAGE],
  },
  {
    path: '/branches',
    labelKey: 'nav.branches',
    Icon: BuildingsIcon,
    permissions: [
      PermissionCode.TENANT_BRANCH_READ,
      PermissionCode.TENANT_BRANCH_MANAGE,
      PermissionCode.TENANT_MANAGE,
    ],
    parentTenantOnly: true,
  },
  { path: '/admin', labelKey: 'nav.admin', Icon: ShieldCheckIcon, adminOnly: true },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const { t } = useI18n();
  const { isAdmin, hasAnyPermission, ready } = useAccess();
  const { data: branchesData } = useTenantBranches(ready && (isAdmin || hasAnyPermission([
    PermissionCode.TENANT_BRANCH_READ,
    PermissionCode.TENANT_BRANCH_MANAGE,
    PermissionCode.TENANT_MANAGE,
  ])));
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

  const renderItem = (item: NavItem) => {
    const isActive = location.pathname.startsWith(item.path);

    const button = (
      <NavLink
        key={item.path}
        to={item.path}
        className={[
          styles.navItem,
          isActive ? styles.active : '',
          collapsed ? styles.collapsed : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className={styles.bar} aria-hidden />
        <span className={styles.icon}>
          <item.Icon size="1em" weight="regular" />
        </span>
        {!collapsed && <span className={styles.label}>{t(item.labelKey)}</span>}
      </NavLink>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.path} label={t(item.labelKey)} position="right" withArrow>
          {button}
        </Tooltip>
      );
    }

    return button;
  };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
      <ScrollArea className={styles.scroll} offsetScrollbars>
        <Stack gap={2} className={styles.navGroup}>
          {visibleItems.map(renderItem)}
        </Stack>
      </ScrollArea>
    </aside>
  );
};
