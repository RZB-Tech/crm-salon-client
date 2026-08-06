import { PasswordInput, Select, Stack, TextInput } from '@mantine/core';
import { UserPlusIcon } from '@phosphor-icons/react';
import type { StaffType } from '@/shared/api/types';
import { FormFieldGrid, FormModal, FormModalFooter, FormSection } from '@/shared/ui';
import { PasswordResultAlert } from './PasswordResultAlert';
import type { CreateForm } from './types';

interface CreateStaffModalProps {
  opened: boolean;
  onClose: () => void;
  form: CreateForm;
  onFormChange: (form: CreateForm) => void;
  onCreate: () => void;
  isPending: boolean;
  createdPassword: string | null;
}

const STAFF_TYPE_OPTIONS = [
  { value: 'employee', label: 'Сотрудник' },
  { value: 'administrator', label: 'Администратор' },
];

export function CreateStaffModal({
  opened,
  onClose,
  form,
  onFormChange,
  onCreate,
  isPending,
  createdPassword,
}: CreateStaffModalProps) {
  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title="Новый пользователь"
      subtitle="Доступ в систему"
      icon={<UserPlusIcon size={22} />}
      size="lg"
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel="Создать"
          onSubmit={onCreate}
          submitDisabled={!form.login}
          loading={isPending}
        />
      }
    >
      <FormSection title="Учётная запись">
        <Stack gap="sm">
          <TextInput
            label="Логин"
            required
            value={form.login}
            onChange={(e) => onFormChange({ ...form, login: e.currentTarget.value })}
          />
          <FormFieldGrid>
            <TextInput
              label="Имя"
              value={form.firstname}
              onChange={(e) => onFormChange({ ...form, firstname: e.currentTarget.value })}
            />
            <TextInput
              label="Фамилия"
              value={form.lastname}
              onChange={(e) => onFormChange({ ...form, lastname: e.currentTarget.value })}
            />
          </FormFieldGrid>
          <Select
            label="Тип"
            data={STAFF_TYPE_OPTIONS}
            value={form.staff_type}
            onChange={(v) => onFormChange({ ...form, staff_type: (v as StaffType) ?? 'employee' })}
          />
        </Stack>
      </FormSection>

      <FormSection title="Пароль" hint="Если не указан, будет сгенерирован автоматически">
        <PasswordInput
          label="Пароль"
          placeholder="Мин. 6 символов"
          value={form.password}
          onChange={(e) => onFormChange({ ...form, password: e.currentTarget.value })}
        />
      </FormSection>

      {createdPassword && (
        <PasswordResultAlert
          title="Пользователь создан"
          label="Пароль:"
          password={createdPassword}
        />
      )}
    </FormModal>
  );
}
