import React from 'react';
import { Select, Stack, TextInput } from '@mantine/core';
import { AirplaneTakeoffIcon } from '@phosphor-icons/react';
import { DateInput } from '@mantine/dates';
import type { Absence, AbsenceType } from '@/shared/api/types';
import { ABSENCE_TYPE_OPTIONS } from '@/shared/lib/format';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import { FormFieldGrid, FormModal, FormModalFooter, FormSection } from '@/shared/ui';

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
  <FormModal
    opened={opened}
    onClose={onClose}
    title={editingAbsence ? 'Редактировать отсутствие' : 'Новое отсутствие'}
    subtitle="Тип, период и причина"
    icon={<AirplaneTakeoffIcon size={22} />}
    size="lg"
    footer={
      <FormModalFooter
        onCancel={onClose}
        submitLabel="Сохранить"
        onSubmit={onSubmit}
        loading={loading}
      />
    }
  >
    <FormSection title="Период">
      <Stack gap="sm">
        <Select
          label="Тип"
          data={ABSENCE_TYPE_OPTIONS}
          value={absenceType}
          onChange={(v) => onAbsenceTypeChange((v as AbsenceType) ?? 'vacation')}
        />
        <FormFieldGrid>
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
        </FormFieldGrid>
      </Stack>
    </FormSection>

    <FormSection title="Комментарий">
      <TextInput
        label="Причина"
        value={reason}
        onChange={(e) => onReasonChange(e.currentTarget.value)}
      />
    </FormSection>

    {editingAbsence && (
      <FormSection title="История изменений" muted>
        <AuditLogsPanel tableName="employee_absences" recordId={editingAbsence.id} />
      </FormSection>
    )}
  </FormModal>
);
