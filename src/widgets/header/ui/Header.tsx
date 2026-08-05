import React from 'react';
import { ActionIcon, Box, Group, Image, Text } from '@mantine/core';
import { ListIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { authStorage } from '@/shared/api/client';
import LogoSvg from '@/shared/assets/logo.svg?url';
import MiniLogoSvg from '@/shared/assets/miniLogo.svg?url';
import { HeaderNotifications } from './HeaderNotifications';
import { HeaderUserMenu } from './HeaderUserMenu';
import styles from './header.module.css';

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
  const tenantName = authStorage.getTenantName() ?? 'Salon CRM';

  return (
    <header className={styles.header}>
      <Box className={styles.left}>
        <Link to="/board" className={styles.logoLink} aria-label="На рабочий стол">
          <Image
            src={collapsed ? MiniLogoSvg : LogoSvg}
            alt="Logo"
            className={`${styles.logoIcon} ${collapsed ? styles.logoIconCollapsed : ''}`}
            w="auto"
            fit="contain"
          />
        </Link>
      </Box>

      <Box className={styles.main}>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className={styles.burger}
        >
          <ListIcon size={20} />
        </ActionIcon>

        <Text fw={700} size="sm" className={styles.tenantName}>
          {tenantName}
        </Text>

        <Group gap="sm" className={styles.right}>
          <HeaderNotifications />
          <HeaderUserMenu />
        </Group>
      </Box>
    </header>
  );
};
