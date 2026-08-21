import React from 'react';
import { PasswordInput, Stack } from '@mantine/core';
import { KeyIcon } from '@phosphor-icons/react';
import { useChangePassword } from '@/shared/api/hooks/useAuth';
import { useI18n } from '@/shared/lib/i18n';
import { addNotification } from '@/shared/lib/notifications';
import { FormModal, FormModalFooter, FormSection } from '@/shared/ui';

interface ChangePasswordModalProps {
  opened: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ opened, onClose }) => {
  const { t } = useI18n();
  const changePassword = useChangePassword();
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      addNotification.error({ message: t('header.passwordsMismatch') });
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
      title={t('header.changePasswordTitle')}
      subtitle={t('header.changePasswordSubtitle')}
      icon={<KeyIcon />}
      size={567}
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel={t('header.changePassword')}
          onSubmit={handleSubmit}
          submitDisabled={!isValid}
          loading={changePassword.isPending}
        />
      }
    >
      <FormSection title={t('common.password')} hint={t('header.passwordHint')}>
        <Stack gap="sm">
          <PasswordInput
            label={t('header.currentPassword')}
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.currentTarget.value)}
          />
          <PasswordInput
            label={t('header.newPassword')}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.currentTarget.value)}
            error={newPassword && newPassword.length < 6 ? t('header.passwordMinLength') : undefined}
          />
          <PasswordInput
            label={t('header.confirmPassword')}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.currentTarget.value)}
            error={
              confirmPassword && newPassword !== confirmPassword
                ? t('header.passwordsMismatch')
                : undefined
            }
          />
        </Stack>
      </FormSection>
    </FormModal>
  );
};
