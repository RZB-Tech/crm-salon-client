import React from 'react';
import { Button, Group, Modal, Text } from '@mantine/core';

interface ConfirmModalProps {
  opened: boolean;
  title: string;
  message: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  confirmColor?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  opened,
  title,
  message,
  children,
  confirmLabel = 'Удалить',
  confirmColor = 'red',
  loading = false,
  onConfirm,
  onClose
}) => (
  <Modal opened={opened} onClose={onClose} title={title} centered radius='md'>
    <Text size='sm' mb='lg'>
      {message}
    </Text>
    {children}
    <Group justify='flex-end'>
      <Button variant='subtle' color='gray' onClick={onClose} disabled={loading}>
        Отмена
      </Button>
      <Button color={confirmColor} onClick={onConfirm} loading={loading}>
        {confirmLabel}
      </Button>
    </Group>
  </Modal>
);
