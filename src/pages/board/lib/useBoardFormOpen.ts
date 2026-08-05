import React from 'react';
import type { AppointmentCancelledReason } from '@/shared/api/types';
import { emptyAppointmentForm, type AppointmentFormValues } from './appointmentForm';
import { DEFAULT_CANCEL_REASON } from './useBoardFormTypes';
interface UseBoardFormOpenOptions {
  date: Date;
}

export const useBoardFormOpen = ({ date }: UseBoardFormOpenOptions) => {
  const [formOpen, setFormOpen] = React.useState(false);
  const [formModeState, setFormMode] = React.useState<'create' | 'edit'>('create');
  const [formValues, setFormValues] = React.useState<AppointmentFormValues>(() =>
    emptyAppointmentForm(),
  );
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editingEmployeeIdState, setEditingEmployeeId] = React.useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = React.useState(false);
  const [cancelReason, setCancelReason] =
    React.useState<AppointmentCancelledReason>(DEFAULT_CANCEL_REASON);

  const closeForm = React.useCallback(() => {
    setFormOpen(false);
    setEditingId(null);
    setEditingEmployeeId(null);
    setFormMode('create');
    setDeleteConfirmOpen(false);
    setCancelConfirmOpen(false);
    setCancelReason(DEFAULT_CANCEL_REASON);
  }, []);


  const openCreateForm = React.useCallback(
    (prefill?: Partial<AppointmentFormValues>, targetDate?: Date) => {
      setEditingId(null);
      setEditingEmployeeId(null);
      setFormMode('create');
      setFormValues({ ...emptyAppointmentForm(targetDate ?? date), ...prefill });
      setFormOpen(true);
    },
    [date],
  );

  const openEditForm = React.useCallback((appointmentId: number, employeeId: number) => {
    setEditingId(appointmentId);
    setEditingEmployeeId(employeeId);
    setFormMode('edit');
    setFormOpen(true);
  }, []);

  const openCancelConfirm = React.useCallback(() => {
    setCancelReason(DEFAULT_CANCEL_REASON);
    setCancelConfirmOpen(true);
  }, []);

  return {
    formOpen,
    formMode: formModeState,
    formValues,
    setFormValues,
    editingId,
    editingEmployeeId: editingEmployeeIdState,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    cancelConfirmOpen,
    setCancelConfirmOpen,
    cancelReason,
    setCancelReason,
    closeForm,
    openCreateForm,
    openEditForm,
    openCancelConfirm,
  };
};
