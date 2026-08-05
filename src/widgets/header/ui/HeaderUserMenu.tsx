import React from 'react';
import {
  Avatar,
  Button,
  Group,
  Menu,
  Modal,
  PasswordInput,
  Stack,
  UnstyledButton,
} from '@mantine/core';
import { KeyIcon, SignOutIcon } from '@phosphor-icons/react';
import { useLogout, useChangePassword } from '@/shared/api/hooks/useAuth';
import { useMe } from '@/shared/api/hooks/useMe';
import { addNotification } from '@/shared/lib/notifications';
import { AUTH_ENABLED } from '@/shared/config/env';
import styles from './header.module.css';

export const HeaderUserMenu: React.FC = () => {
  const { data: me } = useMe();
  const logout = useLogout();
  const changePassword = useChangePassword();

  const meInitials = React.useMemo(() => {
    if (!me) return 'A';
    return [me.firstname?.[0], me.lastname?.[0]].filter(Boolean).join('').toUpperCase() || me.login[0]?.toUpperCase() || 'A';
  }, [me]);

  const meDisplayName = React.useMemo(() => {
    if (!me) return '';
    return [me.firstname, me.lastname].filter(Boolean).join(' ') || me.login;
  }, [me]);

  const [changePasswordOpen, setChangePasswordOpen] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleLogout = () => {
    logout.mutate();
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      addNotification.error({ message: 'Пароли не совпадают' });
      return;
    }
    changePassword.mutate(
      { old_password: oldPassword, new_password: newPassword },
      {
        onSuccess: () => {
          setChangePasswordOpen(false);
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
        },
      },
    );
  };

  const isPasswordValid = oldPassword && newPassword && newPassword === confirmPassword && newPassword.length >= 6;

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

      <Modal
        opened={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        title="Смена пароля"
        radius="md"
      >
        <Stack gap="md">
          <PasswordInput
            label="Текущий пароль"
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.currentTarget.value)}
          />
          <PasswordInput
            label="Новый пароль"
            required
            description="Минимум 6 символов"
            value={newPassword}
            onChange={(e) => setNewPassword(e.currentTarget.value)}
            error={newPassword && newPassword.length < 6 ? 'Минимум 6 символов' : undefined}
          />
          <PasswordInput
            label="Подтверждение пароля"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.currentTarget.value)}
            error={
              confirmPassword && newPassword !== confirmPassword
                ? 'Пароли не совпадают'
                : undefined
            }
          />
          <Group justify="flex-end" mt="md">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => setChangePasswordOpen(false)}
            >
              Отмена
            </Button>
            <Button
              onClick={handleChangePassword}
              loading={changePassword.isPending}
              disabled={!isPasswordValid}
            >
              Сменить пароль
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};
