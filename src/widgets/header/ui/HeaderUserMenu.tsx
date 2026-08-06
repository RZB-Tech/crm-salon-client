import React from 'react';
import { Avatar, Menu, UnstyledButton } from '@mantine/core';
import { KeyIcon, SignOutIcon } from '@phosphor-icons/react';
import { useLogout } from '@/shared/api/hooks/useAuth';
import { useMe } from '@/shared/api/hooks/useMe';
import { AUTH_ENABLED } from '@/shared/config/env';
import { ChangePasswordModal } from './ChangePasswordModal';
import styles from './header.module.css';

export const HeaderUserMenu: React.FC = () => {
  const { data: me } = useMe();
  const logout = useLogout();

  const meInitials = React.useMemo(() => {
    if (!me) return 'A';
    return [me.firstname?.[0], me.lastname?.[0]].filter(Boolean).join('').toUpperCase() || me.login[0]?.toUpperCase() || 'A';
  }, [me]);

  const meDisplayName = React.useMemo(() => {
    if (!me) return '';
    return [me.firstname, me.lastname].filter(Boolean).join(' ') || me.login;
  }, [me]);

  const [changePasswordOpen, setChangePasswordOpen] = React.useState(false);

  const handleLogout = () => {
    logout.mutate();
  };

  if (!AUTH_ENABLED) {
    return (
      <Avatar size="sm" radius="md" color="sage">
        CRM
      </Avatar>
    );
  }

  return (
    <>
      <Menu shadow="md" width={200} position="bottom-end" radius="md">
        <Menu.Target>
          <UnstyledButton className={styles.avatarTarget} aria-label="Аккаунт">
            <Avatar radius="md" size="md" color="sage">{meInitials}</Avatar>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>{meDisplayName || 'Аккаунт'}</Menu.Label>
          <Menu.Item
            leftSection={<KeyIcon size={14} />}
            onClick={() => setChangePasswordOpen(true)}
          >
            Сменить пароль
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            leftSection={<SignOutIcon size={14} />}
            color="red"
            onClick={handleLogout}
            disabled={logout.isPending}
          >
            {logout.isPending ? 'Выход...' : 'Выйти'}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <ChangePasswordModal
        opened={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </>
  );
};
