import { NavLink } from 'react-router-dom';
import { Tooltip } from '@mantine/core';
import type { NavItem } from '../lib/navItems';
import styles from './sidebar.module.css';

interface SidebarNavItemProps {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
  label: string;
}

export function SidebarNavItem({ item, collapsed, active, label }: SidebarNavItemProps) {
  const link = (
    <NavLink
      to={item.path}
      className={[
        styles.navItem,
        active ? styles.active : '',
        collapsed ? styles.collapsed : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={styles.bar} aria-hidden />
      <span className={styles.icon}>
        <item.Icon size="1em" weight="regular" />
      </span>
      {!collapsed && <span className={styles.label}>{label}</span>}
    </NavLink>
  );

  if (!collapsed) return link;

  return (
    <Tooltip label={label} position="right" withArrow>
      {link}
    </Tooltip>
  );
}
