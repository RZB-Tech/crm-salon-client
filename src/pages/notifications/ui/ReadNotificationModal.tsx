import React from 'react';
import { Textarea } from '@mantine/core';
import { CheckCircleIcon } from '@phosphor-icons/react';
import { FormModal, FormModalFooter, FormSection } from '@/shared/ui';

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
  <FormModal
    opened={opened}
    onClose={onClose}
    title="Отметить прочитанным"
    subtitle="Оставьте комментарий к уведомлению"
    icon={<CheckCircleIcon size={22} />}
    size="md"
    footer={
      <FormModalFooter
        onCancel={onClose}
        submitLabel="Прочитано"
        onSubmit={onConfirm}
        submitDisabled={!comment.trim()}
        loading={loading}
      />
    }
  >
    <FormSection title="Комментарий">
      <Textarea
        required
        placeholder="Введите комментарий"
        minRows={2}
        value={comment}
        onChange={(e) => onCommentChange(e.currentTarget.value)}
      />
    </FormSection>
  </FormModal>
);
