import { PasswordInput, Select, TextInput } from '@mantine/core';
import { UserPlusIcon } from '@phosphor-icons/react';
import type { StaffType } from '@/shared/api/types';
import { useI18n } from '@/shared/lib/i18n';
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

export function CreateStaffModal({
  opened,
  onClose,
  form,
  onFormChange,
  onCreate,
  isPending,
  createdPassword,
}: CreateStaffModalProps) {
  const { t } = useI18n();
  const staffTypeOptions = [
    { value: 'employee', label: t('form.staffTypeEmployee') },
    { value: 'administrator', label: t('form.staffTypeAdmin') },
  ];

  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title={t('form.addUser')}
      icon={<UserPlusIcon />}
      size={567}
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel={t('form.addUser')}
          onSubmit={onCreate}
          submitDisabled={!form.login}
          loading={isPending}
        />
      }
    >
      <FormFieldGrid>
        <TextInput
          label={t('common.login')}
          required
          placeholder={t('form.enterLogin')}
          value={form.login}
          onChange={(e) => onFormChange({ ...form, login: e.currentTarget.value })}
        />
        <Select
          label={t('form.type')}
          required
          data={staffTypeOptions}
          value={form.staff_type}
          onChange={(v) => onFormChange({ ...form, staff_type: (v as StaffType) ?? 'employee' })}
        />
      </FormFieldGrid>
      <FormFieldGrid>
        <TextInput
          label={t('common.lastName')}
          required
          placeholder={t('clients.enterLastName')}
          value={form.lastname}
          onChange={(e) => onFormChange({ ...form, lastname: e.currentTarget.value })}
        />
        <TextInput
          label={t('common.firstName')}
          required
          placeholder={t('form.enterUserFirstName')}
          value={form.firstname}
          onChange={(e) => onFormChange({ ...form, firstname: e.currentTarget.value })}
        />
      </FormFieldGrid>
      <PasswordInput
        label={t('common.password')}
        description={t('form.passwordAutoHint')}
        placeholder={t('form.enterPassword')}
        value={form.password}
        onChange={(e) => onFormChange({ ...form, password: e.currentTarget.value })}
      />
      {createdPassword && (
        <PasswordResultAlert
          title={t('form.createdUser')}
          label={t('form.passwordLabel')}
          password={createdPassword}
        />
      )}
    </FormModal>
  );
}
