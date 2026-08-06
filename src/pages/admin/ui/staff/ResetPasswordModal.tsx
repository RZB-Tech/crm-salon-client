import { PasswordInput, Stack, Text } from '@mantine/core';
import { KeyIcon } from '@phosphor-icons/react';
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
  const tooShort = customPassword.length > 0 && customPassword.length < 6;

  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title="Сброс пароля"
      subtitle={staffLogin}
      icon={<KeyIcon size={22} />}
      tone="warning"
      size="md"
      footer={
        <FormModalFooter
          cancelLabel={resetResult ? 'Закрыть' : 'Отмена'}
          onCancel={onClose}
          submitLabel={
            resetResult ? undefined : customPassword ? 'Задать пароль' : 'Сгенерировать случайный'
          }
          onSubmit={resetResult ? undefined : onResetRandom}
          submitDisabled={tooShort}
          loading={isPending}
        />
      }
    >
      {resetResult ? (
        <PasswordResultAlert
          title="Пароль установлен"
          label="Новый пароль:"
          password={resetResult}
        />
      ) : (
        <FormSection title="Новый пароль" hint="Оставьте пустым для генерации случайного">
          <Stack gap="xs">
            <PasswordInput
              value={customPassword}
              onChange={(e) => onCustomPasswordChange(e.currentTarget.value)}
              placeholder="Мин. 6 символов"
              error={tooShort ? 'Минимум 6 символов' : undefined}
            />
            {customPassword && (
              <Text size="xs" c="dimmed">
                Пользовательский пароль пока не поддерживается бэкендом — будет сгенерирован
                случайный.
              </Text>
            )}
          </Stack>
        </FormSection>
      )}
    </FormModal>
  );
}
