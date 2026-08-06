import React from 'react';
import { Badge, Button, Tabs } from '@mantine/core';
import { CurrencyCircleDollarIcon, PencilSimpleIcon, UserCircleIcon } from '@phosphor-icons/react';
import type { Client } from '@/shared/api/types';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import { FormModal, FormModalFooter, FormSection, formModalStyles } from '@/shared/ui';
import { formatPrice, getClientFullName, getClientInitials } from '@/shared/lib/format';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { ClientAppointmentsTab } from './ClientAppointmentsTab';
import { ClientFinanceTab } from './ClientFinanceTab';

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
  onDeposit
}) => {
  const { hasPermission } = useAccess();
  const [tab, setTab] = React.useState<string>('appointments');

  useResetOnOpen(client, () => setTab('appointments'));

  const canEdit = Boolean(onEdit) && hasPermission(PermissionCode.CLIENT_UPDATE);
  const canDeposit = Boolean(onDeposit) && hasPermission(PermissionCode.CLIENT_UPDATE_DEPOSIT);

  return (
    <FormModal
      opened={Boolean(client)}
      onClose={onClose}
      title={client ? getClientFullName(client) : 'Клиент'}
      subtitle={client?.phone ?? 'Карточка клиента'}
      initials={client ? getClientInitials(client) : null}
      icon={<UserCircleIcon size={22} />}
      headerAside={
        client ? (
          <Badge variant='light' color='sage' size='lg' radius='sm'>
            {formatPrice(client.deposit)}
          </Badge>
        ) : undefined
      }
      size='lg'
      footer={
        <FormModalFooter
          metaLabel='Депозит'
          metaValue={client ? formatPrice(client.deposit) : undefined}
          cancelLabel='Закрыть'
          onCancel={onClose}
        >
          {canEdit && client && (
            <Button
              variant='light'
              size='sm'
              leftSection={<PencilSimpleIcon size={16} />}
              onClick={() => onEdit?.(client)}
            >
              Редактировать
            </Button>
          )}
          {canDeposit && client && (
            <Button
              variant='light'
              size='sm'
              leftSection={<CurrencyCircleDollarIcon size={16} />}
              onClick={() => onDeposit?.(client)}
            >
              Депозит
            </Button>
          )}
        </FormModalFooter>
      }
    >
      <Tabs
        value={tab}
        onChange={(v) => setTab(v ?? 'appointments')}
        variant='pills'
        color='sage'
        radius='xl'
      >
        <Tabs.List className={formModalStyles.tabsList}>
          <Tabs.Tab value='appointments'>Записи</Tabs.Tab>
          <Tabs.Tab value='finance'>Финансы</Tabs.Tab>
          <Tabs.Tab value='audit'>История</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='appointments'>
          <FormSection title='Записи клиента'>
            {client && <ClientAppointmentsTab clientId={client.id} />}
          </FormSection>
        </Tabs.Panel>
        <Tabs.Panel value='finance'>
          <FormSection title='Финансы'>
            {client && <ClientFinanceTab clientId={client.id} />}
          </FormSection>
        </Tabs.Panel>
        <Tabs.Panel value='audit'>
          <FormSection title='История изменений' muted>
            {client && <AuditLogsPanel tableName='clients' recordId={client.id} />}
          </FormSection>
        </Tabs.Panel>
      </Tabs>
    </FormModal>
  );
};
