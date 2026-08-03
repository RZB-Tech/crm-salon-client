import React from 'react';
import { Stack, Text } from '@mantine/core';
import type { Appointment } from '@/shared/api/types';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import styles from './appointment-form-modal.module.css';

interface AppointmentAuditSectionProps {
  appointment: Appointment;
}

export const AppointmentAuditSection: React.FC<AppointmentAuditSectionProps> = ({
  appointment,
}) => (
  <div className={styles.sectionCardMuted}>
    <p className={styles.sectionTitleMuted}>История изменений</p>
    <p className={styles.sectionHint}>Кто и что менял в этой записи</p>
    <Stack gap="md">
      <div>
        <Text size="xs" c="dimmed" mb="xs" fw={600}>
          Визит
        </Text>
        <AuditLogsPanel tableName="appointments" recordId={appointment.id} />
      </div>
      {(appointment.records ?? []).map((record) => (
        <div key={record.id}>
          <Text size="xs" c="dimmed" mb="xs" fw={600}>
            Сотрудник:{' '}
            {record.employee
              ? `${record.employee.firstname} ${record.employee.lastname ?? ''}`.trim()
              : `#${record.id}`}
          </Text>
          <AuditLogsPanel tableName="appointment_records" recordId={record.id} />
          {record.services.map((service) => (
            <div key={service.id} style={{ marginTop: 12 }}>
              <Text size="xs" c="dimmed" mb="xs">
                {service.service?.name ??
                  (service.material_id != null ? `Товар #${service.material_id}` : `Позиция #${service.id}`)}
              </Text>
              <AuditLogsPanel tableName="appointment_services" recordId={service.id} />
            </div>
          ))}
        </div>
      ))}
    </Stack>
  </div>
);
