import React from 'react';
import { Badge, Modal, Skeleton, Table, Tabs, Text } from '@mantine/core';
import { useClientAppointments } from '@/shared/api/hooks/useClients';
import type { Client } from '@/shared/api/types';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import { DataTable, DataTableRow } from '@/shared/ui';
import { formatAppointmentDateTime, formatPrice, getClientFullName } from '@/shared/lib/format';

interface ClientDetailModalProps {
  client: Client | null;
  onClose: () => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({ client, onClose }) => {
  const [tab, setTab] = React.useState<string>('appointments');
  const { data: appointments, isLoading } = useClientAppointments(client?.id ?? 0);

  React.useEffect(() => {
    if (client) setTab('appointments');
  }, [client]);

  return (
    <Modal opened={Boolean(client)} onClose={onClose} title={client ? getClientFullName(client) : 'Клиент'} radius="md" size="lg">
      <Tabs value={tab} onChange={(v) => setTab(v ?? 'appointments')}>
        <Tabs.List mb="md">
          <Tabs.Tab value="appointments">Записи</Tabs.Tab>
          <Tabs.Tab value="audit">История изменений</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="appointments">
          {isLoading ? (
            <Skeleton height={120} />
          ) : (
            <DataTable
              compact
              stickyHeader={false}
              maxHeight={320}
              columns={[
                { key: 'date', label: 'Дата' },
                { key: 'amount', label: 'Сумма' },
                { key: 'status', label: 'Статус' },
              ]}
              isEmpty={(appointments ?? []).length === 0}
              emptyMessage="Записей нет"
            >
              {(appointments ?? []).map((appt) => (
                <DataTableRow key={appt.id}>
                  <Table.Td><Text size="xs">{formatAppointmentDateTime(appt.start_time_est)}</Text></Table.Td>
                  <Table.Td><Text size="sm" fw={600}>{formatPrice(appt.total_price)}</Text></Table.Td>
                  <Table.Td>
                    <Badge size="xs" color={appt.paid ? 'green' : 'orange'} variant="light">
                      {appt.paid ? 'Оплачено' : 'Не оплачено'}
                    </Badge>
                  </Table.Td>
                </DataTableRow>
              ))}
            </DataTable>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="audit">
          {client && <AuditLogsPanel tableName="clients" recordId={client.id} />}
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
};
