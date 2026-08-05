import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/query-keys';
import { invalidateAppointmentRelations } from '@/shared/api/invalidate';
import type { Appointment, AppointmentCancelledReason } from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';
import { formValuesToPayload, type AppointmentFormValues } from './appointmentForm';
import {
  AppointmentEditBlockedError,
  syncAppointmentEdit,
} from './syncAppointmentEdit';
import type { UseBoardFormOptions } from './useBoardFormTypes';

interface UseBoardFormActionsOptions
  extends Pick<
    UseBoardFormOptions,
    'createAppointment' | 'archiveAppointment' | 'restoreAppointment' | 'cancelAppointment'
  > {
  editingId: number | null;
  editingAppointment: Appointment | undefined;
  editingEmployeeId: number | null;
  formValues: AppointmentFormValues;
  hasActiveReceipt: boolean;
  cancelReason: AppointmentCancelledReason;
  closeForm: () => void;
}

export const useBoardFormActions = ({
  editingId,
  editingAppointment,
  editingEmployeeId,
  formValues,
  hasActiveReceipt,
  cancelReason,
  createAppointment,
  archiveAppointment,
  restoreAppointment,
  cancelAppointment,
  closeForm,
}: UseBoardFormActionsOptions) => {
  const queryClient = useQueryClient();
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleFormSubmit = React.useCallback(async () => {
    const afterSave = () => closeForm();

    if (!editingId || !editingAppointment || editingEmployeeId == null) {
      createAppointment.mutate(formValuesToPayload(formValues), { onSuccess: afterSave });
      return;
    }

    setIsSyncing(true);
    try {
      await syncAppointmentEdit({
        appointment: editingAppointment,
        values: formValues,
        editingEmployeeId,
        hasActiveReceipt,
      });
      await invalidateAppointmentRelations(queryClient, {
        appointmentId: editingId,
        clientId: Number(formValues.clientId) || null,
        employeeId: editingEmployeeId,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.materials.all });
      addNotification.success({ message: 'Запись сохранена' });
      afterSave();
    } catch (error) {
      const message =
        error instanceof AppointmentEditBlockedError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Не удалось сохранить запись';
      addNotification.error({ message });
    } finally {
      setIsSyncing(false);
    }
  }, [
    editingId,
    editingAppointment,
    editingEmployeeId,
    formValues,
    hasActiveReceipt,
    createAppointment,
    closeForm,
    queryClient,
  ]);

  const handleDelete = React.useCallback(() => {
    if (!editingId) return;
    archiveAppointment.mutate(editingId, { onSuccess: () => closeForm() });
  }, [editingId, archiveAppointment, closeForm]);

  const handleRestore = React.useCallback(() => {
    if (!editingId) return;
    restoreAppointment.mutate(editingId);
  }, [editingId, restoreAppointment]);

  const handleCancel = React.useCallback(() => {
    if (!editingId) return;
    cancelAppointment.mutate(
      { id: editingId, reason: cancelReason },
      { onSuccess: () => closeForm() },
    );
  }, [editingId, cancelReason, cancelAppointment, closeForm]);

  const isSaving =
    createAppointment.isPending ||
    archiveAppointment.isPending ||
    restoreAppointment.isPending ||
    cancelAppointment.isPending ||
    isSyncing;

  return {
    handleFormSubmit,
    handleDelete,
    handleRestore,
    handleCancel,
    isSyncing,
    isSaving,
  };
};
