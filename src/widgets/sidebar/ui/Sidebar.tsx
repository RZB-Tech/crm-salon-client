import React from 'react';
import { Box, Stack, Text, Tooltip } from '@mantine/core';
import { NavLink, useLocation } from 'react-router-dom';
import {
  ScissorsIcon,
  UserListIcon,
  SquaresFourIcon,
  UsersIcon,
  PackageIcon,
  CurrencyCircleDollarIcon,
  BellIcon,
  GearSixIcon,
  ShieldCheckIcon,
} from '@phosphor-icons/react';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import type { PermissionCodeValue } from '@/shared/lib/permissions';
import styles from './sidebar.module.css';

interface SidebarProps {
  collapsed: boolean;
}

interface NavItem {
  path: string;
  label: string;
  Icon: React.ElementType;
  /** Коды разрешений — достаточно хотя бы одного. undefined = доступно всем */
  permissions?: PermissionCodeValue[];
  /** Только для admin */
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    path: '/board',
    label: 'Рабочий стол',
    Icon: SquaresFourIcon,
    permissions: [PermissionCode.APPOINTMENT_READ, PermissionCode.APPOINTMENT_MANAGE],
  },
  {
    path: '/clients',
    label: 'Клиенты',
    Icon: UsersIcon,
    permissions: [PermissionCode.CLIENT_READ, PermissionCode.CLIENT_MANAGE],
  },
  {
    path: '/services',
    label: 'Услуги',
    Icon: ScissorsIcon,
    permissions: [PermissionCode.SERVICE_READ, PermissionCode.SERVICE_MANAGE],
  },
  {
    path: '/employees',
    label: 'Сотрудники',
    Icon: UserListIcon,
    permissions: [PermissionCode.EMPLOYEE_READ, PermissionCode.EMPLOYEE_MANAGE],
  },
  {
    path: '/materials',
    label: 'Склад',
    Icon: PackageIcon,
    permissions: [PermissionCode.MATERIAL_READ, PermissionCode.MATERIAL_MANAGE],
  },
  {
    path: '/finance',
    label: 'Финансы',
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
    label: 'Уведомления',
    Icon: BellIcon,
    permissions: [PermissionCode.NOTIFICATION_READ, PermissionCode.NOTIFICATION_MANAGE],
  },
  {
    path: '/settings',
    label: 'Настройки',
    Icon: GearSixIcon,
    permissions: [PermissionCode.TENANT_PREFERENCES_READ, PermissionCode.TENANT_MANAGE],
  },
  { path: '/admin', label: 'Админ', Icon: ShieldCheckIcon, adminOnly: true },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const { isAdmin, hasAnyPermission, ready } = useAccess();

  const visibleItems = React.useMemo(() => {
    if (!ready) return [];
    return NAV_ITEMS.filter((item) => {
      if (item.adminOnly) return isAdmin;
      if (item.permissions) return isAdmin || hasAnyPermission(item.permissions);
      return true;
    });
  }, [ready, isAdmin, hasAnyPermission]);

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
        <Box component="span" className={styles.icon}>
          <item.Icon size={20} weight={isActive ? 'fill' : 'regular'} />
        </Box>
        {!collapsed && <Text span className={styles.label}>{item.label}</Text>}
      </NavLink>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.path} label={item.label} position="right" withArrow>
          {button}
        </Tooltip>
      );
    }

    return button;
  };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
      <Stack gap={2} className={styles.navGroup}>
        {visibleItems.map(renderItem)}
      </Stack>
    </aside>
  );
};
