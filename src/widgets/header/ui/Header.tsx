import React from 'react';
import { ActionIcon, Box, Group, Image, Text } from '@mantine/core';
import { SidebarSimpleIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { authStorage } from '@/shared/api/client';
import LogoSvg from '@/shared/assets/logo.svg?url';
import MiniLogoSvg from '@/shared/assets/miniLogo.svg?url';
import { useI18n } from '@/shared/lib/i18n';
import { HeaderNotifications } from './HeaderNotifications';
import { HeaderUserMenu } from './HeaderUserMenu';
import { LanguageSwitch } from './LanguageSwitch';
import styles from './header.module.css';

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
  const tenantName = authStorage.getTenantName() ?? 'Salon CRM';
  const { t } = useI18n();

  const toggleButton = (
    <ActionIcon
      variant="subtle"
      color="gray"
      size="lg"
      onClick={onToggle}
      aria-label={collapsed ? t('header.expandMenu') : t('header.collapseMenu')}
      aria-expanded={!collapsed}
      className={styles.toggle}
    >
      <SidebarSimpleIcon size={20} />
    </ActionIcon>
  );

  return (
    <header className={styles.header}>
      <Box className={`${styles.left} ${collapsed ? styles.leftCollapsed : ''}`}>
        <Link to="/board" className={styles.logoLink} aria-label={t('header.toBoard')}>
          <Image
            src={collapsed ? MiniLogoSvg : LogoSvg}
            alt="Logo"
            className={`${styles.logoIcon} ${collapsed ? styles.logoIconCollapsed : ''}`}
            w="auto"
            fit="contain"
          />
        </Link>
        {!collapsed && toggleButton}
      </Box>

      <Box className={styles.main}>
        {collapsed && toggleButton}
        <Text fw={700} size="sm" className={styles.tenantName}>
          {tenantName}
        </Text>

        <Group gap="sm" className={styles.right}>
          <LanguageSwitch />
          <HeaderNotifications />
          <HeaderUserMenu />
        </Group>
      </Box>
    </header>
  );
};
