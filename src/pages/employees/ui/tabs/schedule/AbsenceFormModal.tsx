import React from 'react';
import { Button, Group, Modal, Select, Text, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import type { Absence, AbsenceType } from '@/shared/api/types';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import { ABSENCE_TYPE_OPTIONS } from '@/shared/lib/format';

export interface AbsenceFormModalProps {
  opened: boolean;
  editingAbsence: Absence | null;
  absenceType: AbsenceType;
  startDate: string;
  endDate: string;
  reason: string;
  loading: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onAbsenceTypeChange: (value: AbsenceType) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onReasonChange: (value: string) => void;
}

export const AbsenceFormModal: React.FC<AbsenceFormModalProps> = ({
  opened,
  editingAbsence,
  absenceType,
  startDate,
  endDate,
  reason,
  loading,
  onClose,
  onSubmit,
  onAbsenceTypeChange,
  onStartDateChange,
  onEndDateChange,
  onReasonChange,
}) => (
  <Modal
    opened={opened}
    onClose={onClose}
    title={editingAbsence ? 'Редактировать отсутствие' : 'Новое отсутствие'}
    radius="md"
  >
    <Select
      label="Тип"
      data={ABSENCE_TYPE_OPTIONS}
      mb="md"
      value={absenceType}
      onChange={(v) => onAbsenceTypeChange((v as AbsenceType) ?? 'vacation')}
    />
    <Group grow mb="md">
      <DateInput
        label="С"
        value={startDate || null}
        onChange={(value) => onStartDateChange(value ?? '')}
      />
      <DateInput
        label="По"
        value={endDate || null}
        onChange={(value) => onEndDateChange(value ?? '')}
      />
    </Group>
    <TextInput label="Причина" mb="lg" value={reason} onChange={(e) => onReasonChange(e.currentTarget.value)} />
    {editingAbsence && (
      <>
        <Text size="sm" fw={600} mb="xs">
          История изменений
        </Text>
        <AuditLogsPanel tableName="employee_absences" recordId={editingAbsence.id} />
      </>
    )}
    <Group justify="flex-end" mt="md">
      <Button variant="subtle" color="gray" onClick={onClose}>
        Отмена
      </Button>
      <Button onClick={onSubmit} loading={loading}>
        Сохранить
      </Button>
    </Group>
  </Modal>
);
