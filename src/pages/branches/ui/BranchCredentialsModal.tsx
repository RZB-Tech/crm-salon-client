import React from 'react';
import { Text } from '@mantine/core';
import { KeyIcon } from '@phosphor-icons/react';
import type { BranchCredentials } from '@/shared/api/types';
import { useI18n } from '@/shared/lib/i18n';
import { FormModal, FormModalFooter, FormSection } from '@/shared/ui';
import { BranchSecretRow } from './BranchSecretRow';

interface BranchCredentialsModalProps {
  credentials: BranchCredentials | null;
  onClose: () => void;
}

export const BranchCredentialsModal: React.FC<BranchCredentialsModalProps> = ({
  credentials,
  onClose,
}) => {
  const { t } = useI18n();
  return (
    <FormModal
      opened={Boolean(credentials)}
      onClose={onClose}
      title={t('branches.credentials')}
      icon={<KeyIcon />}
      size={480}
      footer={<FormModalFooter submitLabel={t('common.understand')} onSubmit={onClose} />}
    >
      <FormSection>
        <Text size="sm" c="dimmed" mb="sm">
          {t('branches.credentialsHint')}
        </Text>
        {credentials && (
          <>
            <BranchSecretRow label={t('common.login')} value={credentials.login} />
            <BranchSecretRow label={t('common.password')} value={credentials.password} />
          </>
        )}
      </FormSection>
    </FormModal>
  );
};
