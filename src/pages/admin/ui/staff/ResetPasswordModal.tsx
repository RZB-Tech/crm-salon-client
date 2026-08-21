import { PasswordInput, Stack, Text } from '@mantine/core';
import { KeyIcon } from '@phosphor-icons/react';
import { useI18n } from '@/shared/lib/i18n';
import { FormModal, FormModalFooter, FormSection } from '@/shared/ui';
import { PasswordResultAlert } from './PasswordResultAlert';

interface ResetPasswordModalProps {
  opened: boolean;
  onClose: () => void;
  staffLogin: string;
  resetResult: string | null;
  customPassword: string;
  onCustomPasswordChange: (value: string) => void;
  onResetRandom: () => void;
  isPending: boolean;
}

export function ResetPasswordModal({
  opened,
  onClose,
  staffLogin,
  resetResult,
  customPassword,
  onCustomPasswordChange,
  onResetRandom,
  isPending,
}: ResetPasswordModalProps) {
  const { t } = useI18n();
  const tooShort = customPassword.length > 0 && customPassword.length < 6;

  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title={t('form.resetPassword')}
      subtitle={staffLogin}
      icon={<KeyIcon size={22} />}
      tone="warning"
      size={567}
      footer={
        <FormModalFooter
          cancelLabel={resetResult ? t('common.close') : t('common.cancel')}
          onCancel={onClose}
          submitLabel={
            resetResult
              ? undefined
              : customPassword
                ? t('form.setPassword')
                : t('form.generatePassword')
          }
          onSubmit={resetResult ? undefined : onResetRandom}
          submitDisabled={tooShort}
          loading={isPending}
        />
      }
    >
      {resetResult ? (
        <PasswordResultAlert
          title={t('form.passwordSet')}
          label={t('form.newPasswordLabel')}
          password={resetResult}
        />
      ) : (
        <FormSection title={t('header.newPassword')} hint={t('form.leaveEmptyToGenerate')}>
          <Stack gap="xs">
            <PasswordInput
              value={customPassword}
              onChange={(e) => onCustomPasswordChange(e.currentTarget.value)}
              placeholder={t('form.min6placeholder')}
              error={tooShort ? t('form.min6') : undefined}
            />
            {customPassword && (
              <Text size="xs" c="dimmed">
                {t('form.customPasswordUnsupported')}
              </Text>
            )}
          </Stack>
        </FormSection>
      )}
    </FormModal>
  );
}
