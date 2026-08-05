import React from 'react';
import { Button, Group, Modal, TextInput } from '@mantine/core';
import type { Specialization } from '@/shared/api/types';

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
  <Modal
    opened={opened}
    onClose={onClose}
    title={editing ? 'Редактировать специализацию' : 'Новая специализация'}
    radius="md"
  >
    <TextInput
      label="Название"
      required
      mb="lg"
      value={name}
      onChange={(e) => onNameChange(e.currentTarget.value)}
    />
    <Group justify="flex-end">
      <Button variant="subtle" color="gray" onClick={onClose}>
        Отмена
      </Button>
      <Button onClick={onSubmit} loading={loading} disabled={!name}>
        {editing ? 'Сохранить' : 'Создать'}
      </Button>
    </Group>
  </Modal>
);
