import React from 'react';
import { Textarea } from '@mantine/core';
import { CheckCircleIcon } from '@phosphor-icons/react';
import { FormModal, FormModalFooter, FormSection } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';

interface ReadNotificationModalProps {
  opened: boolean;
  comment: string;
  loading: boolean;
  onCommentChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  onCancelNotification: () => void;
}

export const ReadNotificationModal: React.FC<ReadNotificationModalProps> = ({
  opened,
  comment,
  loading,
  onCommentChange,
  onClose,
  onConfirm,
  onCancelNotification,
}) => {
  const { t } = useI18n();
  const { hasPermission } = useAccess();
  const canCancel = hasPermission(PermissionCode.NOTIFICATION_CANCEL);
  const empty = !comment.trim();

  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title={t('notifications.resolveTitle')}
      subtitle={t('notifications.resolveHint')}
      icon={<CheckCircleIcon />}
      size={567}
      footer={
        <FormModalFooter
          cancelLabel={canCancel ? t('notifications.cancelItem') : undefined}
          onCancel={canCancel ? onCancelNotification : undefined}
          cancelDisabled={empty}
          submitLabel={t('notifications.markReadShort')}
          onSubmit={onConfirm}
          submitDisabled={empty}
          loading={loading}
          submitColor="sage"
        />
      }
    >
      <FormSection title={t('notifications.comment')}>
        <Textarea
          required
          placeholder={t('common.commentPlaceholder')}
          minRows={2}
          value={comment}
          onChange={(e) => onCommentChange(e.currentTarget.value)}
        />
      </FormSection>
    </FormModal>
  );
};
