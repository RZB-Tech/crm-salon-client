import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useAppointment,
  useAppointmentReceipts,
} from '@/shared/api/hooks/useAppointments';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  AppointmentCancelPayload,
  AppointmentCancelledReason,
  Material,
  Service,
} from '@/shared/api/types';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { addNotification } from '@/shared/lib/notifications';
import {
  appointmentToFormValues,
  emptyAppointmentForm,
  formValuesToPayload,
  type AppointmentFormValues,
} from './appointmentForm';
import {
  AppointmentEditBlockedError,
  syncAppointmentEdit,
} from './syncAppointmentEdit';

const DEFAULT_CANCEL_REASON: AppointmentCancelledReason = 'mistaken input';

interface UseBoardFormOptions {
  date: Date;
  services: Service[];
  materials: Material[];
  createAppointment: {
    mutate: (
      payload: ReturnType<typeof formValuesToPayload>,
      opts?: { onSuccess?: () => void },
    ) => void;
    isPending: boolean;
  };
  archiveAppointment: { mutate: (id: number, opts?: { onSuccess?: () => void }) => void; isPending: boolean };
  restoreAppointment: { mutate: (id: number, opts?: { onSuccess?: () => void }) => void; isPending: boolean };
  cancelAppointment: {
    mutate: (payload: AppointmentCancelPayload, opts?: { onSuccess?: () => void }) => void;
    isPending: boolean;
  };
}

export const useBoardForm = ({
  date,
  services,
  materials,
  createAppointment,
  archiveAppointment,
  restoreAppointment,
  cancelAppointment,
}: UseBoardFormOptions) => {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<'create' | 'edit'>('create');
  const [formValues, setFormValues] = React.useState<AppointmentFormValues>(() =>
    emptyAppointmentForm(),
  );
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editingEmployeeId, setEditingEmployeeId] = React.useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = React.useState(false);
  const [cancelReason, setCancelReason] =
    React.useState<AppointmentCancelledReason>(DEFAULT_CANCEL_REASON);
  const [isSyncing, setIsSyncing] = React.useState(false);

  const { data: editingAppointment, isLoading: editingLoading } = useAppointment(editingId ?? 0);
  const { data: appointmentReceipts } = useAppointmentReceipts(editingId ?? 0);

  const activeReceipt = React.useMemo(
    () => (appointmentReceipts ?? []).find((receipt) => receipt.status !== 'cancelled') ?? null,
    [appointmentReceipts],
  );
  const hasActiveReceipt = activeReceipt != null;

  const closeForm = React.useCallback(() => {
    setFormOpen(false);
    setEditingId(null);
    setEditingEmployeeId(null);
    setFormMode('create');
    setDeleteConfirmOpen(false);
    setCancelConfirmOpen(false);
    setCancelReason(DEFAULT_CANCEL_REASON);
    setIsSyncing(false);
  }, []);

  useResetOnOpen(editingAppointment, () => {
    if (!editingAppointment || formMode !== 'edit' || editingEmployeeId == null) return;
    setFormValues(
      appointmentToFormValues(editingAppointment, editingEmployeeId, services, materials),
    );
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
      await queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.detail(editingId),
      });
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

  const openCancelConfirm = React.useCallback(() => {
    setCancelReason(DEFAULT_CANCEL_REASON);
    setCancelConfirmOpen(true);
  }, []);

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
  const formLoading = isSaving || (formMode === 'edit' && editingLoading && !editingAppointment);

  return {
    formOpen,
    formMode,
    formValues,
    setFormValues,
    editingAppointment,
    activeReceipt,
    hasActiveReceipt,
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
    handleFormSubmit,
    handleDelete,
    handleRestore,
    handleCancel,
    formLoading,
    isSaving,
  };
};
