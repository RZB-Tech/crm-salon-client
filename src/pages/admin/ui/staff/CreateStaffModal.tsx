import { PasswordInput, Select, TextInput } from '@mantine/core';
import { UserPlusIcon } from '@phosphor-icons/react';
import type { StaffType } from '@/shared/api/types';
import { FormFieldGrid, FormModal, FormModalFooter } from '@/shared/ui';
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
      title="Добавить пользователя"
      icon={<UserPlusIcon />}
      size={567}
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel="Добавить пользователя"
          onSubmit={onCreate}
          submitDisabled={!form.login}
          loading={isPending}
        />
      }
    >
      <FormFieldGrid>
        <TextInput
          label="Логин"
          required
          placeholder="Введите логин"
          value={form.login}
          onChange={(e) => onFormChange({ ...form, login: e.currentTarget.value })}
        />
        <Select
          label="Тип"
          required
          data={STAFF_TYPE_OPTIONS}
          value={form.staff_type}
          onChange={(v) => onFormChange({ ...form, staff_type: (v as StaffType) ?? 'employee' })}
        />
      </FormFieldGrid>
      <FormFieldGrid>
        <TextInput
          label="Фамилия"
          required
          placeholder="Введите фамилию"
          value={form.lastname}
          onChange={(e) => onFormChange({ ...form, lastname: e.currentTarget.value })}
        />
        <TextInput
          label="Имя"
          required
          placeholder="Введите имя пользователя"
          value={form.firstname}
          onChange={(e) => onFormChange({ ...form, firstname: e.currentTarget.value })}
        />
      </FormFieldGrid>
      <PasswordInput
        label="Пароль"
        description="Если не указан, пароль будет сгенерирован автоматически"
        placeholder="Введите пароль"
        value={form.password}
        onChange={(e) => onFormChange({ ...form, password: e.currentTarget.value })}
      />
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
