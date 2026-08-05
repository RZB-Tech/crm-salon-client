import React from 'react';
import {
  useAppointment,
  useAppointmentReceipts,
} from '@/shared/api/hooks/useAppointments';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { appointmentToFormValues } from './appointmentForm';
import { useBoardFormActions } from './useBoardFormActions';
import { useBoardFormOpen } from './useBoardFormOpen';
import type { UseBoardFormOptions } from './useBoardFormTypes';

export const useBoardForm = ({
  date,
  services,
  materials,
  createAppointment,
  archiveAppointment,
  restoreAppointment,
  cancelAppointment,
}: UseBoardFormOptions) => {
  const open = useBoardFormOpen({ date });
  const { data: editingAppointment, isLoading: editingLoading } = useAppointment(
    open.editingId ?? 0,
  );

  useResetOnOpen(editingAppointment, () => {
    if (!editingAppointment || open.formMode !== 'edit' || open.editingEmployeeId == null) return;
    open.setFormValues(
      appointmentToFormValues(editingAppointment, open.editingEmployeeId, services, materials),
    );
  });
  const { data: appointmentReceipts } = useAppointmentReceipts(open.editingId ?? 0);

  const activeReceipt = React.useMemo(
    () => (appointmentReceipts ?? []).find((receipt) => receipt.status !== 'cancelled') ?? null,
    [appointmentReceipts],
  );
  const hasActiveReceipt = activeReceipt != null;

  const actions = useBoardFormActions({
    editingId: open.editingId,
    editingAppointment,
    editingEmployeeId: open.editingEmployeeId,
    formValues: open.formValues,
    hasActiveReceipt,
    cancelReason: open.cancelReason,
    createAppointment,
    archiveAppointment,
    restoreAppointment,
    cancelAppointment,
    closeForm: open.closeForm,
  });

  const isPaid = React.useMemo(() => {
    if (appointmentReceipts == null) return Boolean(editingAppointment?.paid);
    return appointmentReceipts.some((receipt) => receipt.status === 'paid');
  }, [appointmentReceipts, editingAppointment?.paid]);

  const formLoading =
    actions.isSaving || (open.formMode === 'edit' && editingLoading && !editingAppointment);

  return {
    formOpen: open.formOpen,
    formMode: open.formMode,
    formValues: open.formValues,
    setFormValues: open.setFormValues,
    editingAppointment,
    activeReceipt,
    hasActiveReceipt,
    isPaid,
    deleteConfirmOpen: open.deleteConfirmOpen,
    setDeleteConfirmOpen: open.setDeleteConfirmOpen,
    cancelConfirmOpen: open.cancelConfirmOpen,
    setCancelConfirmOpen: open.setCancelConfirmOpen,
    cancelReason: open.cancelReason,
    setCancelReason: open.setCancelReason,
    closeForm: open.closeForm,
    openCreateForm: open.openCreateForm,
    openEditForm: open.openEditForm,
    openCancelConfirm: open.openCancelConfirm,
    handleFormSubmit: actions.handleFormSubmit,
    handleDelete: actions.handleDelete,
    handleRestore: actions.handleRestore,
    handleCancel: actions.handleCancel,
    formLoading,
    isSaving: actions.isSaving,
  };
};
