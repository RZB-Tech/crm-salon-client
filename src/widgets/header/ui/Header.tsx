import React from 'react';
import { ActionIcon, Box, Group, Image, Text } from '@mantine/core';
import { ListIcon, SidebarSimpleIcon } from '@phosphor-icons/react';
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
  mobileOpened: boolean;
  onMobileToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  collapsed,
  onToggle,
  mobileOpened,
  onMobileToggle,
}) => {
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
      <ActionIcon
        variant="subtle"
        color="gray"
        size="lg"
        hiddenFrom="sm"
        onClick={onMobileToggle}
        aria-label={mobileOpened ? t('header.collapseMenu') : t('header.expandMenu')}
        aria-expanded={mobileOpened}
        className={styles.mobileMenu}
      >
        <ListIcon size={24} />
      </ActionIcon>

      <Box className={`${styles.left} ${collapsed ? styles.leftCollapsed : ''}`} visibleFrom="sm">
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
        {collapsed && (
          <Box visibleFrom="sm">{toggleButton}</Box>
        )}
        <Box hiddenFrom="sm">
          <Link to="/board" className={styles.mobileLogo} aria-label={t('header.toBoard')}>
            <Image src={LogoSvg} alt="Logo" className={styles.mobileLogoImage} w="auto" fit="contain" />
          </Link>
        </Box>
        <Text fw={700} size="sm" className={styles.tenantName} visibleFrom="sm">
          {tenantName}
        </Text>

        <Group gap="sm" className={styles.right}>
          <Box visibleFrom="sm">
            <LanguageSwitch />
          </Box>
          <HeaderNotifications />
          <HeaderUserMenu />
        </Group>
      </Box>
    </header>
  );
};
