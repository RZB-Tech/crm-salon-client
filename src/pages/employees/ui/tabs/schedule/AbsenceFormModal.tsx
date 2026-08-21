import React from 'react';
import { Select, Stack, TextInput } from '@mantine/core';
import { AirplaneTakeoffIcon } from '@phosphor-icons/react';
import { DateInput } from '@mantine/dates';
import type { Absence, AbsenceType } from '@/shared/api/types';
import { ABSENCE_TYPE_OPTIONS } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
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
}) => {
  const { t } = useI18n();
  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title={editingAbsence ? t('form.editAbsence') : t('form.addAbsence')}
      icon={<AirplaneTakeoffIcon />}
      size={567}
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel={t('common.save')}
          onSubmit={onSubmit}
          loading={loading}
        />
      }
    >
      <FormSection title={t('form.period')}>
        <Stack gap="sm">
          <Select
            label={t('form.type')}
            data={ABSENCE_TYPE_OPTIONS()}
            value={absenceType}
            onChange={(v) => onAbsenceTypeChange((v as AbsenceType) ?? 'vacation')}
          />
          <FormFieldGrid>
            <DateInput
              label={t('form.from')}
              value={startDate || null}
              onChange={(value) => onStartDateChange(value ?? '')}
            />
            <DateInput
              label={t('form.until')}
              value={endDate || null}
              onChange={(value) => onEndDateChange(value ?? '')}
            />
          </FormFieldGrid>
        </Stack>
      </FormSection>

      <FormSection title={t('common.comment')}>
        <TextInput
          label={t('form.reason')}
          value={reason}
          onChange={(e) => onReasonChange(e.currentTarget.value)}
        />
      </FormSection>

      {editingAbsence && (
        <FormSection title={t('form.changeHistory')} muted>
          <AuditLogsPanel tableName="employee_absences" recordId={editingAbsence.id} />
        </FormSection>
      )}
    </FormModal>
  );
};
