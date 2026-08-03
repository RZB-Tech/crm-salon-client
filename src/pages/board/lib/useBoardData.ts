import React from 'react';
import { useEmployees, useAssignedEmployeesByDate } from '@/shared/api/hooks/useEmployees';
import {
  useAppointments,
  useCreateAppointment,
  useArchiveAppointment,
  useRestoreAppointment,
  useCancelAppointment,
} from '@/shared/api/hooks/useAppointments';
import { useClients } from '@/shared/api/hooks/useClients';
import { useMaterials } from '@/shared/api/hooks/useMaterials';
import { useServices } from '@/shared/api/hooks/useServices';
import type { Employee } from '@/shared/api/types';
import {
  getClientFullName,
  getEmployeeFullName,
  isSameDay,
  parseApiDateFromDateTime,
  toDateInput,
} from '@/shared/lib/format';
import { mapAppointmentsToBoard } from './appointmentBoard';
import { buildMaterialOptions, buildServiceOptions } from './appointmentForm';

export const useBoardData = () => {
  const [date, setDate] = React.useState(() => new Date());
  const [employeeFilter, setEmployeeFilter] = React.useState<Set<number>>(() => new Set());
  const [showArchived, setShowArchived] = React.useState(false);

  const dateStr = React.useMemo(() => toDateInput(date), [date]);
  const today = React.useMemo(() => new Date(), []);
  const isAtToday = isSameDay(date, today);

  const {
    data: assignedEmployees,
    isLoading: employeesLoading,
    isError: employeesError,
    isFetching: employeesFetching,
  } = useAssignedEmployeesByDate(dateStr);
  const { data: allEmployees } = useEmployees();
  const {
    data: appointments,
    isLoading: appointmentsLoading,
    isFetching: appointmentsFetching,
  } = useAppointments(showArchived);
  const { data: clients } = useClients();
  const { data: services } = useServices();
  const { data: materials } = useMaterials();

  const createAppointment = useCreateAppointment();
  const archiveAppointment = useArchiveAppointment();
  const restoreAppointment = useRestoreAppointment();
  const cancelAppointment = useCancelAppointment();

  const boardEmployees = React.useMemo(() => assignedEmployees ?? [], [assignedEmployees]);

  const filteredEmployees = React.useMemo(() => {
    if (employeeFilter.size === 0) return boardEmployees;
    return boardEmployees.filter((e) => employeeFilter.has(e.id));
  }, [boardEmployees, employeeFilter]);

  const filterSet = React.useMemo(
    () => (employeeFilter.size > 0 ? employeeFilter : undefined),
    [employeeFilter],
  );

  const boardAppointments = React.useMemo(
    () => mapAppointmentsToBoard(appointments ?? [], date, filterSet),
    [appointments, date, filterSet],
  );

  const appointmentDates = React.useMemo(() => {
    const dates = new Set<string>();
    for (const appt of appointments ?? []) {
      dates.add(parseApiDateFromDateTime(appt.start_time_est));
    }
    return dates;
  }, [appointments]);

  const dayRevenue = React.useMemo(
    () => boardAppointments.reduce((sum, appt) => sum + (appt.paid ? appt.totalPrice : 0), 0),
    [boardAppointments],
  );

  const clientOptions = React.useMemo(
    () => (clients ?? []).map((c) => ({ value: String(c.id), label: getClientFullName(c) })),
    [clients],
  );

  const employeeOptions = React.useMemo(() => {
    const boardIds = new Set(boardEmployees.map((e: Employee) => e.id));
    const all = (allEmployees ?? []).filter((e) => e.active || boardIds.has(e.id));
    return all.map((e) => ({ value: String(e.id), label: getEmployeeFullName(e) }));
  }, [allEmployees, boardEmployees]);

  const materialOptions = React.useMemo(
    () => buildMaterialOptions(materials ?? []),
    [materials],
  );

  const goToday = React.useCallback(() => setDate(new Date()), []);

  const isInitialLoading = employeesLoading || appointmentsLoading;
  const isBackgroundFetching = employeesFetching || appointmentsFetching;

  return {
    date,
    dateStr,
    isAtToday,
    setDate,
    boardEmployees,
    filteredEmployees,
    employeeFilter,
    setEmployeeFilter,
    showArchived,
    setShowArchived,
    boardAppointments,
    appointmentDates,
    dayRevenue,
    clientOptions,
    employeeOptions,
    materialOptions,
    clients: clients ?? [],
    allEmployees: allEmployees ?? [],
    services: services ?? [],
    materials: materials ?? [],
    createAppointment,
    archiveAppointment,
    restoreAppointment,
    cancelAppointment,
    goToday,
    isInitialLoading,
    isBackgroundFetching,
    employeesError,
    buildServiceOptions,
  };
};
