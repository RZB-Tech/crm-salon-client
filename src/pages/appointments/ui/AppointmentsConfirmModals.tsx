import React from 'react';
import { Alert, Select } from '@mantine/core';
import type { Appointment, AppointmentCancelledReason } from '@/shared/api/types';
import { ConfirmModal } from '@/shared/ui';
import {
  APPOINTMENT_CANCELLED_REASON_OPTIONS,
} from '@/shared/lib/format';
import { getAppointmentClientName } from '../lib/appointmentList';
import { useI18n } from '@/shared/lib/i18n';
import type { useBoardForm } from '@/pages/board/lib/useBoardForm';

type BoardForm = ReturnType<typeof useBoardForm>;

interface AppointmentsConfirmModalsProps {
  form: BoardForm;
  archiveTarget: Appointment | null | undefined;
  archivePending: boolean;
  cancelPending: boolean;
  onConfirmArchiveRow: () => void;
  onCloseArchiveRow: () => void;
}

export const AppointmentsConfirmModals: React.FC<AppointmentsConfirmModalsProps> = ({
  form,
  archiveTarget,
  archivePending,
  cancelPending,
  onConfirmArchiveRow,
  onCloseArchiveRow,
}) => {
  const { t } = useI18n();
  return (
  <>
    <ConfirmModal
      opened={form.deleteConfirmOpen}
      title={t('appointments.archiveVisitTitle')}
      message={t('appointments.archiveVisitList')}
      confirmLabel={t('common.archive')}
      loading={archivePending}
      onConfirm={form.handleDelete}
      onClose={() => form.setDeleteConfirmOpen(false)}
    />

    <ConfirmModal
      opened={Boolean(archiveTarget)}
      title={t('appointments.archiveVisitTitle')}
      message={t('appointments.archiveVisitNamed', {
        id: archiveTarget?.id ?? '',
        name: archiveTarget ? getAppointmentClientName(archiveTarget) : '',
      })}
      confirmLabel={t('common.archive')}
      loading={archivePending}
      onConfirm={onConfirmArchiveRow}
      onClose={onCloseArchiveRow}
    />

    <ConfirmModal
      opened={form.cancelConfirmOpen}
      title={t('appointments.cancelVisitTitle')}
      message={t('appointments.cancelVisitMessage')}
      confirmLabel={t('appointments.cancelVisitLabel')}
      loading={cancelPending}
      confirmDisabled={!form.cancelReason || form.hasActiveReceipt}
      onConfirm={form.handleCancel}
      onClose={() => form.setCancelConfirmOpen(false)}
    >
      {form.hasActiveReceipt && (
        <Alert color="orange" mb="sm">
          {t('board.activeReceiptAlert')}
        </Alert>
      )}
      <Select
        label={t('appointments.cancelReason')}
        data={APPOINTMENT_CANCELLED_REASON_OPTIONS()}
        value={form.cancelReason}
        onChange={(value) => {
          if (value) form.setCancelReason(value as AppointmentCancelledReason);
        }}
        allowDeselect={false}
      />
    </ConfirmModal>
  </>
  );
};
