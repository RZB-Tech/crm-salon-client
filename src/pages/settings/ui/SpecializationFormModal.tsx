import React from 'react';
import { TextInput } from '@mantine/core';
import { TagIcon } from '@phosphor-icons/react';
import type { Specialization } from '@/shared/api/types';
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
}) => (
  <FormModal
    opened={opened}
    onClose={onClose}
    title={editing ? 'Редактировать специализацию' : 'Новая специализация'}
    icon={<TagIcon />}
    size={567}
    footer={
      <FormModalFooter
        onCancel={onClose}
        submitLabel={editing ? 'Сохранить' : 'Создать специализацию'}
        onSubmit={onSubmit}
        submitDisabled={!name}
        loading={loading}
      />
    }
  >
    <TextInput
      label="Название"
      required
      placeholder="Введите название"
      value={name}
      onChange={(e) => onNameChange(e.currentTarget.value)}
    />
  </FormModal>
);
