import React from 'react';
import { Alert, Select } from '@mantine/core';
import type { Appointment, AppointmentCancelledReason } from '@/shared/api/types';
import { ConfirmModal } from '@/shared/ui';
import {
  APPOINTMENT_CANCELLED_REASON_OPTIONS,
} from '@/shared/lib/format';
import { getAppointmentClientName } from '../lib/appointmentList';
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
}) => (
  <>
    <ConfirmModal
      opened={form.deleteConfirmOpen}
      title="Архивировать посещение"
      message="Архивировать это посещение? Оно будет скрыто из списка и расписания."
      confirmLabel="Архивировать"
      loading={archivePending}
      onConfirm={form.handleDelete}
      onClose={() => form.setDeleteConfirmOpen(false)}
    />

    <ConfirmModal
      opened={Boolean(archiveTarget)}
      title="Архивировать посещение"
      message={`Архивировать посещение №${archiveTarget?.id ?? ''} (${archiveTarget ? getAppointmentClientName(archiveTarget) : ''})?`}
      confirmLabel="Архивировать"
      loading={archivePending}
      onConfirm={onConfirmArchiveRow}
      onClose={onCloseArchiveRow}
    />

    <ConfirmModal
      opened={form.cancelConfirmOpen}
      title="Отменить посещение"
      message="Отменить это посещение? Оплаченные и посещения с активным чеком отменить нельзя — сначала отмените чек."
      confirmLabel="Отменить посещение"
      loading={cancelPending}
      confirmDisabled={!form.cancelReason || form.hasActiveReceipt}
      onConfirm={form.handleCancel}
      onClose={() => form.setCancelConfirmOpen(false)}
    >
      {form.hasActiveReceipt && (
        <Alert color="orange" mb="sm">
          Есть активный чек. Сначала отмените его в блоке оплаты.
        </Alert>
      )}
      <Select
        label="Причина отмены"
        data={APPOINTMENT_CANCELLED_REASON_OPTIONS}
        value={form.cancelReason}
        onChange={(value) => {
          if (value) form.setCancelReason(value as AppointmentCancelledReason);
        }}
        allowDeselect={false}
      />
    </ConfirmModal>
  </>
);
