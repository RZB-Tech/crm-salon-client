import React from 'react';
import { Badge, Skeleton, Table, Text } from '@mantine/core';
import { useClientAppointments } from '@/shared/api/hooks/useClients';
import { DataTable, DataTableRow } from '@/shared/ui';
import { formatAppointmentDateTime, formatPrice } from '@/shared/lib/format';

interface ClientAppointmentsTabProps {
  clientId: number;
}

export const ClientAppointmentsTab: React.FC<ClientAppointmentsTabProps> = ({ clientId }) => {
  const { data: appointments, isLoading } = useClientAppointments(clientId);

  if (isLoading) return <Skeleton height={120} />;

  return (
    <DataTable
      compact
      stickyHeader={false}
      maxHeight={320}
      columns={[
        { key: 'date', label: 'Дата' },
        { key: 'amount', label: 'Сумма' },
        { key: 'status', label: 'Статус' }
      ]}
      isEmpty={(appointments ?? []).length === 0}
      emptyMessage='Записей нет'
    >
      {(appointments ?? []).map((appt) => (
        <DataTableRow key={appt.id}>
          <Table.Td>
            <Text size='xs'>{formatAppointmentDateTime(appt.start_time_est)}</Text>
          </Table.Td>
          <Table.Td>
            <Text size='sm' fw={600}>
              {formatPrice(appt.total_price)}
            </Text>
          </Table.Td>
          <Table.Td>
            <Badge size='xs' color={appt.paid ? 'green' : 'orange'} variant='light'>
              {appt.paid ? 'Оплачено' : 'Не оплачено'}
            </Badge>
          </Table.Td>
        </DataTableRow>
      ))}
    </DataTable>
  );
};
