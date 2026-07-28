import React from 'react';
import {
  Badge,
  Box,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import type { Appointment, Client } from '@/shared/api/types';
import { PayAppointmentPanel } from '@/shared/ui/PayAppointmentPanel';
import {
  applyStartTimeChange,
  calcTotalEstimatedTime,
  createEmptyServiceLine,
  isAppointmentFormValid,
  type AppointmentFormValues,
  type ServiceOption,
} from '../../lib/appointmentForm';
import { QuickClientForm } from './QuickClientForm';
import { ServiceLinesTable } from './ServiceLinesTable';
import { AppointmentAuditSection } from './AppointmentAuditSection';
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

  const isValid = isAppointmentFormValid(values);

  const handleEmployeeChange = React.useCallback(
    (employeeId: string | null) => {
      onChange({ ...values, employeeId, services: [createEmptyServiceLine()] });
    },
    [onChange, values],
  );

  return (
    <Modal opened={opened} onClose={onClose} title={mode === 'edit' ? 'Запись клиента' : 'Новая запись'} radius="md" size="lg">
      {mode === 'edit' && (
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            {cancelled && <Badge color="red" variant="light">Отменена</Badge>}
            <Badge color={paid ? 'green' : 'orange'} variant="light">
              {paid ? 'Оплачено' : 'Не оплачено'}
            </Badge>
          </Group>
        </Group>
      )}

      <Box className={styles.section}>
        <Stack gap="sm">
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
            <QuickClientForm onCreated={(id) => onChange({ ...values, clientId: id })} />
          </Group>
          {selectedClient?.phone && (
            <Text size="xs" c="dimmed" className={styles.clientPhone}>
              {selectedClient.phone}
            </Text>
          )}

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

      <ServiceLinesTable values={values} serviceOptions={serviceOptions} onChange={onChange} />

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
          <AppointmentAuditSection appointment={appointment} />
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
