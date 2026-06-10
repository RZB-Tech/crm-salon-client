import React from 'react';
import { Stack, Text, Tooltip } from '@mantine/core';
import { NavLink, useLocation } from 'react-router-dom';
import { Scissors, UserList, SquaresFour, Users } from '@phosphor-icons/react';
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
  { path: '/board', label: 'Рабочий стол', Icon: SquaresFour },
  { path: '/clients', label: 'Клиенты', Icon: Users },
  { path: '/services', label: 'Услуги', Icon: Scissors },
  { path: '/employees', label: 'Сотрудники', Icon: UserList },
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
        <span className={styles.icon}>
          <item.Icon size={20} weight={isActive ? 'fill' : 'regular'} />
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
      <Stack gap={2} className={styles.navGroup}>
        {!collapsed && (
          <Text size="xs" fw={600} className={styles.groupLabel} tt="uppercase">
            CRM
          </Text>
        )}
        {NAV_ITEMS.map(renderItem)}
      </Stack>
    </aside>
  );
};
