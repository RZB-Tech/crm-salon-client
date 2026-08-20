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
    path: '/appointments',
    label: 'Посещения',
    Icon: CalendarCheckIcon,
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
    path: '/promotions',
    label: 'Акции',
    Icon: TagIcon,
    permissions: [PermissionCode.PROMOTION_GET, PermissionCode.PROMOTION_MANAGE],
  },
  {
    path: '/gift-cards',
    label: 'Купоны',
    Icon: TicketIcon,
    permissions: [PermissionCode.GIFT_CARD_GET, PermissionCode.GIFT_CARD_MANAGE],
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
        <span className={styles.bar} aria-hidden />
        <span className={styles.icon}>
          <item.Icon size="1em" weight="regular" />
        </span>
        {!collapsed && <span className={styles.label}>{item.label}</span>}
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
      <ScrollArea className={styles.scroll} offsetScrollbars>
        <Stack gap={2} className={styles.navGroup}>
          {visibleItems.map(renderItem)}
        </Stack>
      </ScrollArea>
    </aside>
  );
};
