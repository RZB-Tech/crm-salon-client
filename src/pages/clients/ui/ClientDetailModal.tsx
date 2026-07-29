import React from 'react';
import { Badge, Modal, Skeleton, Stack, Table, Tabs, Text } from '@mantine/core';
import { useClientAppointments } from '@/shared/api/hooks/useClients';
import { useClientFinanceReport } from '@/shared/api/hooks/useClientFinanceReport';
import type { Client } from '@/shared/api/types';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import { DataTable, DataTableRow } from '@/shared/ui';
import { formatAppointmentDateTime, formatPrice, getClientFullName } from '@/shared/lib/format';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';

interface ClientDetailModalProps {
  client: Client | null;
  onClose: () => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({ client, onClose }) => {
  const [tab, setTab] = React.useState<string>('appointments');
  const { data: appointments, isLoading } = useClientAppointments(client?.id ?? 0);
  const { data: financeReport, isLoading: financeLoading } = useClientFinanceReport({
    clientID: client?.id ?? 0,
  });

  useResetOnOpen(client, () => setTab('appointments'));

  return (
    <Modal opened={Boolean(client)} onClose={onClose} title={client ? getClientFullName(client) : 'Клиент'} radius="md" size="lg">
      <Tabs value={tab} onChange={(v) => setTab(v ?? 'appointments')}>
        <Tabs.List mb="md">
          <Tabs.Tab value="appointments">Записи</Tabs.Tab>
          <Tabs.Tab value="finance">Финансы</Tabs.Tab>
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
        <Tabs.Panel value="finance">
          {financeLoading ? (
            <Skeleton height={120} />
          ) : financeReport && Object.keys(financeReport.items).length > 0 ? (
            <Stack gap="sm">
              <Text size="sm" fw={600}>
                Итого: {formatPrice(financeReport.total)}
              </Text>
              <DataTable
                compact
                stickyHeader={false}
                maxHeight={320}
                columns={[
                  { key: 'month', label: 'Месяц' },
                  { key: 'income', label: 'Доход' },
                  { key: 'net', label: 'Нетто' },
                  { key: 'transactions', label: 'Операций' },
                ]}
                isEmpty={false}
                emptyMessage=""
              >
                {Object.entries(financeReport.items).map(([month, data]) => (
                  <DataTableRow key={month}>
                    <Table.Td><Text size="xs">{month}</Text></Table.Td>
                    <Table.Td><Text size="xs" c="green">{formatPrice(data.income)}</Text></Table.Td>
                    <Table.Td><Text size="xs" fw={600}>{formatPrice(data.net)}</Text></Table.Td>
                    <Table.Td><Badge size="xs" variant="light">{data.transactions.length}</Badge></Table.Td>
                  </DataTableRow>
                ))}
              </DataTable>
            </Stack>
          ) : (
            <Text size="sm" c="dimmed">Финансовых данных нет</Text>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="audit">
          {client && <AuditLogsPanel tableName="clients" recordId={client.id} />}
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
};
