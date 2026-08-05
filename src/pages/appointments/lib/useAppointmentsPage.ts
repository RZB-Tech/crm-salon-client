import React from 'react';
import {
  useAppointments,
  useArchiveAppointment,
  useCancelAppointment,
  useCreateAppointment,
  useRestoreAppointment,
} from '@/shared/api/hooks/useAppointments';
import { useTableFilters } from '@/shared/api/hooks/useTableFilters';
import { useClients } from '@/shared/api/hooks/useClients';
import { useEmployees } from '@/shared/api/hooks/useEmployees';
import { useMaterials } from '@/shared/api/hooks/useMaterials';
import { useServices } from '@/shared/api/hooks/useServices';
import type { Appointment } from '@/shared/api/types';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { useResolvedById } from '@/shared/lib/hooks/useResolvedById';
import { getClientFullName, getEmployeeFullName } from '@/shared/lib/format';
import { useAccess } from '@/shared/lib/permissions';
import { useBoardForm } from '@/pages/board/lib/useBoardForm';
import { buildMaterialOptions, buildServiceOptions } from '@/pages/board/lib/appointmentForm';
import {
  buildAppointmentListFilters,
  clientFilterOptions,
  emptyAppointmentFilterForm,
  type AppointmentFilterFormState,
} from './appointmentFilters';
import { resolveStatusFilterOptions } from './appointmentStatus';

export function useAppointmentsPage() {
  const { hasPermission } = useAccess();
  const [filterForm, setFilterForm] = React.useState<AppointmentFilterFormState>(
    emptyAppointmentFilterForm,
  );
  const [archiveTargetId, setArchiveTargetId] = React.useState<number | null>(null);

  const { data: filterSchema } = useTableFilters('appointments');
  const listFilters = React.useMemo(
    () => buildAppointmentListFilters(filterForm),
    [filterForm],
  );

  const { data: appointments, isLoading, isError } = useAppointments(listFilters);
  const { data: clients } = useClients();
  const { data: allEmployees } = useEmployees();
  const { data: services } = useServices();
  const { data: materials } = useMaterials();
  const archiveTarget = useResolvedById(appointments, archiveTargetId);

  const createAppointment = useCreateAppointment();
  const archiveAppointment = useArchiveAppointment();
  const restoreAppointment = useRestoreAppointment();
  const cancelAppointment = useCancelAppointment();

  const form = useBoardForm({
    date: new Date(),
    services: services ?? [],
    materials: materials ?? [],
    createAppointment,
    archiveAppointment,
    restoreAppointment,
    cancelAppointment,
  });

  const schemaByField = React.useMemo(() => {
    const map = new Map((filterSchema ?? []).map((field) => [field.field, field]));
    return map;
  }, [filterSchema]);

  const statusOptions = React.useMemo(
    () => resolveStatusFilterOptions(schemaByField.get('status')),
    [schemaByField],
  );

  const hasFilterField = React.useCallback(
    (field: string) => !filterSchema || schemaByField.has(field),
    [filterSchema, schemaByField],
  );

  const sorted = React.useMemo(
    () =>
      [...(appointments ?? [])].sort(
        (a, b) =>
          new Date(b.start_time_est).getTime() - new Date(a.start_time_est).getTime(),
      ),
    [appointments],
  );

  const pagination = usePagination(sorted, { defaultPageSize: 20 });

  React.useEffect(() => {
    pagination.resetPage();
  }, [listFilters, pagination.resetPage]);

  const patchFilter = React.useCallback(
    (patch: Partial<AppointmentFilterFormState>) => {
      setFilterForm((prev) => ({ ...prev, ...patch }));
    },
    [],
  );

  const clientOptions = React.useMemo(
    () => clientFilterOptions(clients ?? []),
    [clients],
  );

  const formClientOptions = React.useMemo(
    () =>
      (clients ?? []).map((client) => ({
        value: String(client.id),
        label: getClientFullName(client),
      })),
    [clients],
  );

  const employeeOptions = React.useMemo(
    () =>
      (allEmployees ?? [])
        .filter((employee) => employee.active)
        .map((employee) => ({
          value: String(employee.id),
          label: getEmployeeFullName(employee),
        })),
    [allEmployees],
  );

  const selectedEmployee = React.useMemo(
    () =>
      (allEmployees ?? []).find(
        (employee) => String(employee.id) === form.formValues.employeeId,
      ),
    [allEmployees, form.formValues.employeeId],
  );

  const serviceOptions = React.useMemo(
    () => buildServiceOptions(services ?? [], selectedEmployee),
    [services, selectedEmployee],
  );

  const materialOptions = React.useMemo(
    () => buildMaterialOptions(materials ?? []),
    [materials],
  );

  const openEdit = React.useCallback(
    (appointment: Appointment) => {
      const employeeId = appointment.records?.[0]?.employee_id ?? 0;
      form.openEditForm(appointment.id, employeeId || 0);
    },
    [form],
  );

  const handleRestoreRow = React.useCallback(
    (event: React.MouseEvent, id: number) => {
      event.stopPropagation();
      restoreAppointment.mutate(id);
    },
    [restoreAppointment],
  );

  const handleArchiveRow = React.useCallback(
    (event: React.MouseEvent, appointment: Appointment) => {
      event.stopPropagation();
      setArchiveTargetId(appointment.id);
    },
    [],
  );

  const confirmArchiveRow = React.useCallback(() => {
    if (!archiveTarget) return;
    archiveAppointment.mutate(archiveTarget.id, {
      onSuccess: () => setArchiveTargetId(null),
    });
  }, [archiveTarget, archiveAppointment]);

  const closeArchiveConfirm = React.useCallback(() => setArchiveTargetId(null), []);

  return {
    hasPermission,
    filterForm,
    isLoading,
    isError,
    pagination,
    patchFilter,
    hasFilterField,
    clientOptions,
    statusOptions,
    form,
    clients,
    formClientOptions,
    employeeOptions,
    serviceOptions,
    materialOptions,
    openEdit,
    handleRestoreRow,
    handleArchiveRow,
    archiveTarget,
    archiveAppointment,
    confirmArchiveRow,
    closeArchiveConfirm,
    restoreAppointment,
    cancelAppointment,
  };
}
