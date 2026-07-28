import React from 'react';
import { Box, Stack, Text } from '@mantine/core';
import type { Appointment } from '@/shared/api/types';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import styles from './appointment-form-modal.module.css';

interface AppointmentAuditSectionProps {
  appointment: Appointment;
}

export const AppointmentAuditSection: React.FC<AppointmentAuditSectionProps> = ({ appointment }) => (
  <Box className={styles.section}>
    <Text className={styles.sectionTitle}>История изменений</Text>
    <Stack gap="md">
      <Box>
        <Text size="xs" c="dimmed" mb="xs">Запись</Text>
        <AuditLogsPanel tableName="appointments" recordId={appointment.id} />
      </Box>
      {(appointment.records ?? []).map((record) => (
        <Box key={record.id}>
          <Text size="xs" c="dimmed" mb="xs">
            Сотрудник:{' '}
            {record.employee
              ? `${record.employee.firstname} ${record.employee.lastname ?? ''}`.trim()
              : `#${record.id}`}
          </Text>
          <AuditLogsPanel tableName="appointment_records" recordId={record.id} />
          {record.services.map((service) => (
            <Box key={service.id} mt="sm">
              <Text size="xs" c="dimmed" mb="xs">
                Услуга: {service.service?.name ?? `#${service.id}`}
              </Text>
              <AuditLogsPanel tableName="appointment_services" recordId={service.id} />
            </Box>
          ))}
        </Box>
      ))}
    </Stack>
  </Box>
);
