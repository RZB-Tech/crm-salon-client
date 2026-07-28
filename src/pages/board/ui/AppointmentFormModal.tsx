import React from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Table,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { Plus, Trash } from '@phosphor-icons/react';
import type { Appointment, Client } from '@/shared/api/types';
import { useCreateClient } from '@/shared/api/hooks/useClients';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import { PayAppointmentPanel } from '@/shared/ui/PayAppointmentPanel';
import { formatPrice } from '@/shared/lib/format';
import {
  applyServiceDuration,
  applyStartTimeChange,
  calcServicesTotal,
  calcTotalEstimatedTime,
  createEmptyServiceLine,
  isAppointmentFormValid,
  type AppointmentFormValues,
  type ServiceOption,
} from '../lib/appointmentForm';
import styles from './appointment-form-modal.module.css';

const TIME_STEP = 900;

interface AppointmentFormModalProps {
  opened: boolean;
  mode: 'create' | 'edit';
  loading?: boolean;
  paid?: boolean;
  cancelled?: boolean;
  appointment?: Appointment | null;
  values: AppointmentFormValues;
  clientOptions: { value: string; label: string }[];
  clients: Client[];
  employeeOptions: { value: string; label: string }[];
  serviceOptions: ServiceOption[];
  onChange: (values: AppointmentFormValues) => void;
  onClose: () => void;
  onSubmit: () => void;
  onDelete?: () => void;
  onCancel?: () => void;
}

export type { AppointmentFormValues };

export const AppointmentFormModal: React.FC<AppointmentFormModalProps> = ({
  opened,
  mode,
  loading = false,
  paid = false,
  cancelled = false,
  appointment = null,
  values,
  clientOptions,
  clients,
  employeeOptions,
  serviceOptions,
  onChange,
  onClose,
  onSubmit,
  onDelete,
  onCancel,
}) => {
  const selectedClient = React.useMemo(
    () => clients.find((client) => String(client.id) === values.clientId),
    [clients, values.clientId],
  );

  const [quickClientOpen, setQuickClientOpen] = React.useState(false);
  const [quickClientName, setQuickClientName] = React.useState('');
  const [quickClientPhone, setQuickClientPhone] = React.useState('');

  const createClient = useCreateClient();

  const total = React.useMemo(() => calcServicesTotal(values.services), [values.services]);
  const isValid = isAppointmentFormValid(values);

  const handleServiceSelect = React.useCallback(
    (key: string, serviceId: string | null) => {
      const option = serviceOptions.find((item) => item.value === serviceId);
      const nextServices = values.services.map((line) =>
        line.key === key
          ? { ...line, serviceId, price: option?.price ?? line.price }
          : line,
      );
      const updated = { ...values, services: nextServices };
      onChange(applyServiceDuration(updated, serviceOptions));
    },
    [onChange, serviceOptions, values],
  );

  const handleServiceFieldChange = React.useCallback(
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

  const handleRemoveService = React.useCallback(
    (key: string) => {
      const next = values.services.filter((line) => line.key !== key);
      const nextServices = next.length > 0 ? next : [createEmptyServiceLine()];
      const updated = { ...values, services: nextServices };
      onChange(applyServiceDuration(updated, serviceOptions));
    },
    [onChange, serviceOptions, values],
  );

  const handleAddService = React.useCallback(() => {
    onChange({
      ...values,
      services: [...values.services, createEmptyServiceLine()],
    });
  }, [onChange, values]);

  const handleEmployeeChange = React.useCallback(
    (employeeId: string | null) => {
      onChange({
        ...values,
        employeeId,
        services: [createEmptyServiceLine()],
      });
    },
    [onChange, values],
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={mode === 'edit' ? 'Запись клиента' : 'Новая запись'}
      radius="md"
      size="lg"
    >
      <Group justify="space-between" mb="md">
        {mode === 'edit' && (
          <Group gap="xs">
            {cancelled && (
              <Badge color="red" variant="light">
                Отменена
              </Badge>
            )}
            <Badge color={paid ? 'green' : 'orange'} variant="light">
              {paid ? 'Оплачено' : 'Не оплачено'}
            </Badge>
          </Group>
        )}
      </Group>

      <Box className={styles.section}>
        <Stack gap="sm">
          <Box>
            {!quickClientOpen ? (
              <Group align="flex-end" gap="xs">
                <Select
                  label="Клиент"
                  required
                  searchable
                  data={clientOptions}
                  value={values.clientId}
                  onChange={(value) => onChange({ ...values, clientId: value })}
                  className={styles.clientSelect}
                />
                <Button
                  variant="light"
                  size="sm"
                  leftSection={<Plus size={14} />}
                  onClick={() => setQuickClientOpen(true)}
                >
                  Новый
                </Button>
              </Group>
            ) : (
              <Stack gap="xs">
                <Text size="sm" fw={600}>Новый клиент</Text>
                <Group grow>
                  <TextInput
                    label="Имя"
                    required
                    value={quickClientName}
                    onChange={(event) => setQuickClientName(event.currentTarget.value)}
                    placeholder="Имя клиента"
                  />
                  <TextInput
                    label="Телефон"
                    value={quickClientPhone}
                    onChange={(event) => setQuickClientPhone(event.currentTarget.value)}
                    placeholder="+7..."
                  />
                </Group>
                <Group gap="xs">
                  <Button
                    size="xs"
                    disabled={!quickClientName.trim()}
                    loading={createClient.isPending}
                    onClick={() => {
                      createClient.mutate(
                        {
                          firstname: quickClientName.trim(),
                          phone: quickClientPhone.trim() || undefined,
                          sex: 'female' as const,
                        },
                        {
                          onSuccess: (created) => {
                            onChange({ ...values, clientId: String(created.id) });
                            setQuickClientOpen(false);
                            setQuickClientName('');
                            setQuickClientPhone('');
                          },
                        },
                      );
                    }}
                  >
                    Создать
                  </Button>
                  <Button
                    size="xs"
                    variant="subtle"
                    color="gray"
                    onClick={() => {
                      setQuickClientOpen(false);
                      setQuickClientName('');
                      setQuickClientPhone('');
                    }}
                  >
                    Отмена
                  </Button>
                </Group>
              </Stack>
            )}
            {selectedClient?.phone && !quickClientOpen && (
              <Text size="xs" c="dimmed" className={styles.clientPhone}>
                {selectedClient.phone}
              </Text>
            )}
          </Box>

          <Group grow align="flex-start">
            <TextInput
              label="Дата"
              type="date"
              required
              value={values.date}
              onChange={(event) => onChange({ ...values, date: event.currentTarget.value })}
            />
            <TextInput
              label="Начало"
              type="time"
              required
              step={TIME_STEP}
              value={values.startTime}
              onChange={(event) =>
                onChange(applyStartTimeChange(values, event.currentTarget.value, calcTotalEstimatedTime(values.services, serviceOptions)))
              }
            />
            <TextInput
              label="Конец"
              type="time"
              required
              step={TIME_STEP}
              value={values.endTime}
              onChange={(event) => onChange({ ...values, endTime: event.currentTarget.value })}
            />
          </Group>

          <Select
            label="Сотрудник"
            required
            searchable
            data={employeeOptions}
            value={values.employeeId}
            onChange={handleEmployeeChange}
          />
        </Stack>
      </Box>

      <Box className={styles.section}>
        <Group className={styles.servicesHeader} justify="space-between">
          <Text className={styles.sectionTitle} mb={0}>
            Услуги
          </Text>
          <Button
            variant="light"
            size="xs"
            leftSection={<Plus size={14} />}
            onClick={handleAddService}
            disabled={!values.employeeId}
          >
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
                    onChange={(value) =>
                      handleServiceFieldChange(line.key, 'quantity', Number(value) || 1)
                    }
                  />
                </Table.Td>
                <Table.Td>
                  <NumberInput
                    min={0}
                    value={line.price}
                    onChange={(value) =>
                      handleServiceFieldChange(line.key, 'price', Number(value) || 0)
                    }
                    suffix=" сум"
                    thousandSeparator=" "
                  />
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    aria-label="Удалить услугу"
                    onClick={() => handleRemoveService(line.key)}
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

      <Box className={styles.section}>
        <Text className={styles.sectionTitle}>Комментарий</Text>
        <Textarea
          placeholder="Заметки к записи"
          minRows={3}
          value={values.notes}
          onChange={(event) => onChange({ ...values, notes: event.currentTarget.value })}
        />
      </Box>

      {mode === 'edit' && appointment && (
        <>
          <Box className={styles.section}>
            <Text className={styles.sectionTitle}>Оплата</Text>
            <PayAppointmentPanel appointment={appointment} />
          </Box>
          <Box className={styles.section}>
            <Text className={styles.sectionTitle}>История изменений</Text>
            <Text size="xs" c="dimmed" mb="xs">
              Запись
            </Text>
            <AuditLogsPanel tableName="appointments" recordId={appointment.id} />
            {(appointment.records ?? []).map((record) => (
              <React.Fragment key={record.id}>
                <Text size="xs" c="dimmed" mt="md" mb="xs">
                  Сотрудник:{' '}
                  {record.employee
                    ? `${record.employee.firstname} ${record.employee.lastname ?? ''}`.trim()
                    : `#${record.id}`}
                </Text>
                <AuditLogsPanel tableName="appointment_records" recordId={record.id} />
                {record.services.map((service) => (
                  <React.Fragment key={service.id}>
                    <Text size="xs" c="dimmed" mt="sm" mb="xs">
                      Услуга: {service.service?.name ?? `#${service.id}`}
                    </Text>
                    <AuditLogsPanel tableName="appointment_services" recordId={service.id} />
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </Box>
        </>
      )}

      <Group className={styles.footer} justify="space-between">
        <Button variant="subtle" color="gray" onClick={onClose}>
          Отмена
        </Button>
        <Group className={styles.footerActions} gap="sm">
          {mode === 'edit' && onCancel && !cancelled && (
            <Button variant="light" color="orange" onClick={onCancel} loading={loading}>
              Отменить запись
            </Button>
          )}
          {mode === 'edit' && onDelete && (
            <Button variant="light" color="red" onClick={onDelete} loading={loading}>
              Удалить
            </Button>
          )}
          {!cancelled && (
            <Button onClick={onSubmit} loading={loading} disabled={!isValid}>
              {mode === 'edit' ? 'Сохранить' : 'Создать'}
            </Button>
          )}
        </Group>
      </Group>
    </Modal>
  );
};
