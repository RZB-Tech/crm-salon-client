import React from 'react';
import { Button, Group, Modal, Text } from '@mantine/core';

interface ConfirmModalProps {
  opened: boolean;
  title: string;
  message: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  opened,
  title,
  message,
  loading = false,
  onConfirm,
  onClose,
}) => (
  <Modal opened={opened} onClose={onClose} title={title} centered radius="md">
    <Text size="sm" mb="lg">
      {message}
    </Text>
    <Group justify="flex-end">
      <Button variant="subtle" color="gray" onClick={onClose} disabled={loading}>
        Отмена
      </Button>
      <Button color="red" onClick={onConfirm} loading={loading}>
        Удалить
      </Button>
    </Group>
  </Modal>
);
