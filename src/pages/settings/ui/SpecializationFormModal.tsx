import React from 'react';
import { TextInput } from '@mantine/core';
import { TagIcon } from '@phosphor-icons/react';
import type { Specialization } from '@/shared/api/types';
import { FormModal, FormModalFooter, FormSection } from '@/shared/ui';

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
    subtitle={editing ? editing.name : 'Направление работы мастера'}
    icon={<TagIcon size={22} />}
    size="md"
    footer={
      <FormModalFooter
        onCancel={onClose}
        submitLabel={editing ? 'Сохранить' : 'Создать'}
        onSubmit={onSubmit}
        submitDisabled={!name}
        loading={loading}
      />
    }
  >
    <FormSection title="Основное">
      <TextInput
        label="Название"
        required
        value={name}
        onChange={(e) => onNameChange(e.currentTarget.value)}
      />
    </FormSection>
  </FormModal>
);
