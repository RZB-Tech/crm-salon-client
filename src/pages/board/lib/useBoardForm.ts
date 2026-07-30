import React from 'react';
import { useAppointment } from '@/shared/api/hooks/useAppointments';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import {
  appointmentToFormValues,
  emptyAppointmentForm,
  formValuesToPayload,
  type AppointmentFormValues,
} from './appointmentForm';

interface UseBoardFormOptions {
  date: Date;
  createAppointment: { mutate: (payload: ReturnType<typeof formValuesToPayload>, opts?: { onSuccess?: () => void }) => void; isPending: boolean };
  archiveAppointment: { mutate: (id: number, opts?: { onSuccess?: () => void }) => void; isPending: boolean };
  cancelAppointment: { mutate: (id: number, opts?: { onSuccess?: () => void }) => void; isPending: boolean };
}

export const useBoardForm = ({
  date,
  createAppointment,
  archiveAppointment,
  cancelAppointment,
}: UseBoardFormOptions) => {
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<'create' | 'edit'>('create');
  const [formValues, setFormValues] = React.useState<AppointmentFormValues>(() =>
    emptyAppointmentForm(),
  );
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editingEmployeeId, setEditingEmployeeId] = React.useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = React.useState(false);

  const { data: editingAppointment, isLoading: editingLoading } = useAppointment(editingId ?? 0);

  const closeForm = React.useCallback(() => {
    setFormOpen(false);
    setEditingId(null);
    setEditingEmployeeId(null);
    setFormMode('create');
    setDeleteConfirmOpen(false);
    setCancelConfirmOpen(false);
  }, []);

  useResetOnOpen(editingAppointment, () => {
    if (!editingAppointment || formMode !== 'edit' || editingEmployeeId == null) return;
    setFormValues(appointmentToFormValues(editingAppointment, editingEmployeeId));
  });

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

  const handleFormSubmit = React.useCallback(() => {
    const payload = formValuesToPayload(formValues);
    const afterSave = () => closeForm();

    if (editingId) {
      archiveAppointment.mutate(editingId, {
        onSuccess: () => createAppointment.mutate(payload, { onSuccess: afterSave }),
      });
      return;
    }

    createAppointment.mutate(payload, { onSuccess: afterSave });
  }, [formValues, editingId, archiveAppointment, createAppointment, closeForm]);

  const handleDelete = React.useCallback(() => {
    if (!editingId) return;
    archiveAppointment.mutate(editingId, { onSuccess: () => closeForm() });
  }, [editingId, archiveAppointment, closeForm]);

  const handleCancel = React.useCallback(() => {
    if (!editingId) return;
    cancelAppointment.mutate(editingId, { onSuccess: () => closeForm() });
  }, [editingId, cancelAppointment, closeForm]);

  const isSaving =
    createAppointment.isPending || archiveAppointment.isPending || cancelAppointment.isPending;
  const formLoading = isSaving || (formMode === 'edit' && editingLoading && !editingAppointment);

  return {
    formOpen,
    formMode,
    formValues,
    setFormValues,
    editingAppointment,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    cancelConfirmOpen,
    setCancelConfirmOpen,
    closeForm,
    openCreateForm,
    openEditForm,
    handleFormSubmit,
    handleDelete,
    handleCancel,
    formLoading,
    isSaving,
  };
};
