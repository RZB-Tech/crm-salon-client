import React from 'react';
import { Box, Stack, Text, Tooltip } from '@mantine/core';
import { NavLink, useLocation } from 'react-router-dom';
import { ScissorsIcon, UserListIcon, SquaresFourIcon, UsersIcon, PackageIcon, CurrencyCircleDollarIcon, BellIcon, GearSixIcon } from '@phosphor-icons/react';
import styles from './sidebar.module.css';

interface SidebarProps {
  collapsed: boolean;
}

interface NavItem {
  path: string;
  label: string;
  Icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/board', label: 'Рабочий стол', Icon: SquaresFourIcon },
  { path: '/clients', label: 'Клиенты', Icon: UsersIcon },
  { path: '/services', label: 'Услуги', Icon: ScissorsIcon },
  { path: '/employees', label: 'Сотрудники', Icon: UserListIcon },
  { path: '/materials', label: 'Склад', Icon: PackageIcon },
  { path: '/finance', label: 'Финансы', Icon: CurrencyCircleDollarIcon },
  { path: '/notifications', label: 'Уведомления', Icon: BellIcon },
  { path: '/settings', label: 'Настройки', Icon: GearSixIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();

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
        {NAV_ITEMS.map(renderItem)}
      </Stack>
    </aside>
  );
};
