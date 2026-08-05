import React from 'react';
import { Button, Group, Modal, Textarea } from '@mantine/core';

interface ReadNotificationModalProps {
  opened: boolean;
  comment: string;
  loading: boolean;
  onCommentChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const ReadNotificationModal: React.FC<ReadNotificationModalProps> = ({
  opened,
  comment,
  loading,
  onCommentChange,
  onClose,
  onConfirm,
}) => (
  <Modal opened={opened} onClose={onClose} title="Отметить прочитанным" radius="md" size="sm">
    <Textarea
      label="Комментарий"
      required
      placeholder="Введите комментарий"
      minRows={2}
      mb="md"
      value={comment}
      onChange={(e) => onCommentChange(e.currentTarget.value)}
    />
    <Group justify="flex-end">
      <Button variant="subtle" color="gray" onClick={onClose}>
        Отмена
      </Button>
      <Button onClick={onConfirm} loading={loading} disabled={!comment.trim()}>
        Прочитано
      </Button>
    </Group>
  </Modal>
);
