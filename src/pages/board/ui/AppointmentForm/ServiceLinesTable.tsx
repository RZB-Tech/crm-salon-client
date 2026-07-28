import React from 'react';
import { ActionIcon, Box, Button, Group, NumberInput, Select, Table, Text } from '@mantine/core';
import { Plus, Trash } from '@phosphor-icons/react';
import { formatPrice } from '@/shared/lib/format';
import {
  applyServiceDuration,
  calcServicesTotal,
  createEmptyServiceLine,
  type AppointmentFormValues,
  type ServiceOption,
} from '../../lib/appointmentForm';
import styles from './appointment-form-modal.module.css';

interface ServiceLinesTableProps {
  values: AppointmentFormValues;
  serviceOptions: ServiceOption[];
  onChange: (values: AppointmentFormValues) => void;
}

export const ServiceLinesTable: React.FC<ServiceLinesTableProps> = ({
  values,
  serviceOptions,
  onChange,
}) => {
  const total = React.useMemo(() => calcServicesTotal(values.services), [values.services]);

  const handleServiceSelect = React.useCallback(
    (key: string, serviceId: string | null) => {
      const option = serviceOptions.find((item) => item.value === serviceId);
      const nextServices = values.services.map((line) =>
        line.key === key ? { ...line, serviceId, price: option?.price ?? line.price } : line,
      );
      onChange(applyServiceDuration({ ...values, services: nextServices }, serviceOptions));
    },
    [onChange, serviceOptions, values],
  );

  const handleFieldChange = React.useCallback(
    (key: string, field: 'quantity' | 'price', value: number) => {
      const nextServices = values.services.map((line) =>
        line.key === key ? { ...line, [field]: value } : line,
      );
      const updated = { ...values, services: nextServices };
      if (field === 'quantity') {
        onChange(applyServiceDuration(updated, serviceOptions));
      } else {
        onChange(updated);
      }
    },
    [onChange, serviceOptions, values],
  );

  const handleRemove = React.useCallback(
    (key: string) => {
      const next = values.services.filter((line) => line.key !== key);
      const nextServices = next.length > 0 ? next : [createEmptyServiceLine()];
      onChange(applyServiceDuration({ ...values, services: nextServices }, serviceOptions));
    },
    [onChange, serviceOptions, values],
  );

  const handleAdd = React.useCallback(() => {
    onChange({ ...values, services: [...values.services, createEmptyServiceLine()] });
  }, [onChange, values]);

  return (
    <Box className={styles.section}>
      <Group className={styles.servicesHeader} justify="space-between">
        <Text className={styles.sectionTitle} mb={0}>
          Услуги
        </Text>
        <Button variant="light" size="xs" leftSection={<Plus size={14} />} onClick={handleAdd} disabled={!values.employeeId}>
          Добавить
        </Button>
      </Group>

      <Table verticalSpacing="xs" withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Услуга</Table.Th>
            <Table.Th w={90}>Кол-во</Table.Th>
            <Table.Th w={140}>Цена</Table.Th>
            <Table.Th w={44} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {values.services.map((line) => (
            <Table.Tr key={line.key} className={styles.serviceRow}>
              <Table.Td>
                <Select
                  searchable
                  placeholder="Выберите услугу"
                  data={serviceOptions}
                  value={line.serviceId}
                  onChange={(value) => handleServiceSelect(line.key, value)}
                  nothingFoundMessage="Нет услуг у сотрудника"
                  disabled={!values.employeeId}
                />
              </Table.Td>
              <Table.Td>
                <NumberInput
                  min={1}
                  value={line.quantity}
                  onChange={(value) => handleFieldChange(line.key, 'quantity', Number(value) || 1)}
                />
              </Table.Td>
              <Table.Td>
                <NumberInput
                  min={0}
                  value={line.price}
                  onChange={(value) => handleFieldChange(line.key, 'price', Number(value) || 0)}
                  suffix=" сум"
                  thousandSeparator=" "
                />
              </Table.Td>
              <Table.Td>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  aria-label="Удалить услугу"
                  onClick={() => handleRemove(line.key)}
                  disabled={values.services.length === 1 && !line.serviceId}
                >
                  <Trash size={16} />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Box className={styles.totalRow}>
        <Text size="sm" fw={600}>
          Итого: {formatPrice(total)}
        </Text>
      </Box>
    </Box>
  );
};
