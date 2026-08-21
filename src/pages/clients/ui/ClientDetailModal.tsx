import React from 'react';
import { Tabs } from '@mantine/core';
import type { Client } from '@/shared/api/types';
import { FormModal, FormModalFooter } from '@/shared/ui';
import { getClientInitials, getClientShortName } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { ClientAppointmentsTab } from './ClientAppointmentsTab';
import { ClientDepositBadge } from './ClientDepositBadge';
import { ClientFinanceTab } from './ClientFinanceTab';
import { ClientHistoryTab } from './ClientHistoryTab';
import styles from './client-modals.module.css';

interface ClientDetailModalProps {
  client: Client | null;
  onClose: () => void;
  onEdit?: (client: Client) => void;
  onDeposit?: (client: Client) => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  client,
  onClose,
  onEdit,
  onDeposit,
}) => {
  const { t } = useI18n();
  const { hasPermission } = useAccess();
  const [tab, setTab] = React.useState<string>('appointments');

  useResetOnOpen(client, () => setTab('appointments'));

  const canEdit = Boolean(onEdit) && hasPermission(PermissionCode.CLIENT_UPDATE);
  const canDeposit = Boolean(onDeposit) && hasPermission(PermissionCode.CLIENT_UPDATE_DEPOSIT);

  return (
    <FormModal
      opened={Boolean(client)}
      onClose={onClose}
      title={client ? getClientShortName(client) : t('form.client')}
      subtitle={client?.phone || undefined}
      initials={client ? getClientInitials(client) : null}
      size={567}
      footer={
        client && (canEdit || canDeposit) ? (
          <FormModalFooter
            cancelLabel={t('common.edit')}
            onCancel={canEdit ? () => onEdit?.(client) : undefined}
            submitLabel={t('clients.deposit')}
            onSubmit={canDeposit ? () => onDeposit?.(client) : undefined}
          />
        ) : undefined
      }
    >
      <div className={styles.body}>
        {client && <ClientDepositBadge amount={client.deposit} />}
        <Tabs
          value={tab}
          onChange={(v) => setTab(v ?? 'appointments')}
          variant="pills"
          radius={4}
          classNames={{ root: styles.tabs, list: styles.tabsList, tab: styles.tab }}
        >
          <Tabs.List>
            <Tabs.Tab value="appointments">{t('clients.tabAppointments')}</Tabs.Tab>
            <Tabs.Tab value="finance">{t('clients.tabFinance')}</Tabs.Tab>
            <Tabs.Tab value="audit">{t('clients.tabHistory')}</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="appointments">
            {client && <ClientAppointmentsTab clientId={client.id} />}
          </Tabs.Panel>
          <Tabs.Panel value="finance">{client && <ClientFinanceTab clientId={client.id} />}</Tabs.Panel>
          <Tabs.Panel value="audit">{client && <ClientHistoryTab clientId={client.id} />}</Tabs.Panel>
        </Tabs>
      </div>
    </FormModal>
  );
};
