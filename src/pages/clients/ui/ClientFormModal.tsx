import React from 'react';
import { NumberInput, Textarea } from '@mantine/core';
import { UserPlusIcon } from '@phosphor-icons/react';
import { useCreateClient, useUpdateClient } from '@/shared/api/hooks/useClients';
import type { Client, ClientUpdatePayload } from '@/shared/api/types';
import { getClientInitials } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { FormModal, FormModalFooter, FormSection } from '@/shared/ui';
import {
  clientFormToPayload,
  clientToForm,
  emptyClientForm,
  type ClientFormState,
} from '../lib/clientForm';
import { ClientDepositBadge } from './ClientDepositBadge';
import { ClientPersonalFields } from './ClientPersonalFields';
import styles from './client-modals.module.css';

interface ClientFormModalProps {
  opened: boolean;
  client: Client | null;
  onClose: () => void;
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({ opened, client, onClose }) => {
  const { t } = useI18n();
  const [form, setForm] = React.useState<ClientFormState>(emptyClientForm);
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  useResetOnOpen(opened, () => setForm(client ? clientToForm(client) : emptyClientForm()));

  const handleSubmit = React.useCallback(() => {
    if (client) {
      const payload: ClientUpdatePayload = { id: client.id, ...clientFormToPayload(form) };
      updateClient.mutate(payload, { onSuccess: onClose });
    } else {
      createClient.mutate(clientFormToPayload(form), { onSuccess: onClose });
    }
  }, [form, client, createClient, updateClient, onClose]);

  const isSaving = createClient.isPending || updateClient.isPending;

  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title={client ? t('clients.editClient') : t('clients.add')}
      initials={client ? getClientInitials(client) : null}
      icon={<UserPlusIcon />}
      size={567}
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel={client ? t('common.save') : t('clients.add')}
          onSubmit={handleSubmit}
          submitDisabled={!form.firstname.trim()}
          loading={isSaving}
        />
      }
    >
      <div className={client ? styles.body : undefined}>
        {client && <ClientDepositBadge amount={client.deposit} />}
        <div className={styles.layout}>
          <ClientPersonalFields form={form} onChange={setForm} />
          {!client && (
            <FormSection title={t('clients.deposit')} hint={t('clients.depositHint')}>
              <NumberInput
                label={t('clients.initialDeposit')}
                min={0}
                placeholder={t('services.pricePlaceholder')}
                value={form.deposit || ''}
                onChange={(v) => setForm({ ...form, deposit: Number(v) || 0 })}
                thousandSeparator=" "
              />
            </FormSection>
          )}
          <Textarea
            label={t('common.notes')}
            autosize
            minRows={2}
            placeholder={t('clients.notesPlaceholder')}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.currentTarget.value })}
          />
        </div>
      </div>
    </FormModal>
  );
};
