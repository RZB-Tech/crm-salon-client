import React from 'react';
import { TextInput } from '@mantine/core';
import { TagIcon } from '@phosphor-icons/react';
import type { Specialization } from '@/shared/api/types';
import { useI18n } from '@/shared/lib/i18n';
import { FormModal, FormModalFooter } from '@/shared/ui';

interface SpecializationFormModalProps {
  opened: boolean;
  editing: Specialization | null;
  name: string;
  loading: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onNameChange: (name: string) => void;
}

export const SpecializationFormModal: React.FC<SpecializationFormModalProps> = ({
  opened,
  editing,
  name,
  loading,
  onClose,
  onSubmit,
  onNameChange,
}) => {
  const { t } = useI18n();
  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title={editing ? t('form.editSpec') : t('form.newSpec')}
      icon={<TagIcon />}
      size={567}
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel={editing ? t('common.save') : t('form.createSpec')}
          onSubmit={onSubmit}
          submitDisabled={!name}
          loading={loading}
        />
      }
    >
      <TextInput
        label={t('common.name')}
        required
        placeholder={t('form.enterName')}
        value={name}
        onChange={(e) => onNameChange(e.currentTarget.value)}
      />
    </FormModal>
  );
};
