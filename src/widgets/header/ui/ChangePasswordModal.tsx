import React from 'react';
import { PasswordInput, Stack } from '@mantine/core';
import { KeyIcon } from '@phosphor-icons/react';
import { useChangePassword } from '@/shared/api/hooks/useAuth';
import { addNotification } from '@/shared/lib/notifications';
import { FormModal, FormModalFooter, FormSection } from '@/shared/ui';

interface ChangePasswordModalProps {
  opened: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ opened, onClose }) => {
  const changePassword = useChangePassword();
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      addNotification.error({ message: 'Пароли не совпадают' });
      return;
    }
    changePassword.mutate(
      { old_password: oldPassword, new_password: newPassword },
      {
        onSuccess: () => {
          onClose();
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
        },
      },
    );
  };

  const isValid = Boolean(
    oldPassword && newPassword && newPassword === confirmPassword && newPassword.length >= 6,
  );

  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title="Смена пароля"
      subtitle="Обновите пароль от учётной записи"
      icon={<KeyIcon size={22} />}
      size="md"
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel="Сменить пароль"
          onSubmit={handleSubmit}
          submitDisabled={!isValid}
          loading={changePassword.isPending}
        />
      }
    >
      <FormSection title="Пароль" hint="Новый пароль должен содержать минимум 6 символов">
        <Stack gap="sm">
          <PasswordInput
            label="Текущий пароль"
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.currentTarget.value)}
          />
          <PasswordInput
            label="Новый пароль"
            required
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
              confirmPassword && newPassword !== confirmPassword ? 'Пароли не совпадают' : undefined
            }
          />
        </Stack>
      </FormSection>
    </FormModal>
  );
};
