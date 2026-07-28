import React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import {
  Box,
  Button,
  Text,
  Skeleton,
  Alert,
  Stack,
  Avatar,
} from '@mantine/core';
import { ResourcesDayView, type ScheduleEventData } from '@mantine/schedule';
import { Plus } from '@phosphor-icons/react';
import { useEmployees, useAssignedEmployeesByDate } from '@/shared/api/hooks/useEmployees';
import {
  useAppointments,
  useAppointment,
  useCreateAppointment,
  useDeleteAppointment,
  useCancelAppointment,
} from '@/shared/api/hooks/useAppointments';
import { useClients } from '@/shared/api/hooks/useClients';
import { useServices } from '@/shared/api/hooks/useServices';
import type { Employee } from '@/shared/api/types';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { BackgroundRefreshIndicator } from '@/shared/ui/BackgroundRefreshIndicator';
import {
  getClientFullName,
  getEmployeeFullName,
  getEmployeeInitials,
  isSameDay,
  parseApiDateFromDateTime,
  toDateInput,
} from '@/shared/lib/format';
import { mapAppointmentsToBoard } from '../lib/appointmentBoard';
import {
  appointmentToFormValues,
  buildServiceOptions,
  emptyAppointmentForm,
  formValuesToPayload,
  type AppointmentFormValues,
} from '../lib/appointmentForm';
import { AppointmentFormModal } from './AppointmentFormModal';
import { BoardSidebar } from './BoardSidebar';
import { EmployeeFilterPopover } from './EmployeeFilterPopover';
import styles from './board-page.module.css';

dayjs.locale('ru');

const padTime = (v: number) => v.toString().padStart(2, '0');

const BoardSkeleton = () => (
  <Stack gap={0} h='100%' className={styles.skeletonRoot}>
    <Skeleton height={56} radius={0} mb={0} />
    <Box className={styles.skeletonBody}>
      <Skeleton height='100%' width='100%' radius={0} />
      <Skeleton height='100%' width={320} radius={0} />
    </Box>
  </Stack>
);

export const BoardPage: React.FC = () => {
  const [date, setDate] = React.useState(() => new Date());

  const dateStr = React.useMemo(() => toDateInput(date), [date]);

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
  } = useAppointments();

  const { data: clients } = useClients();
  const { data: services } = useServices();
  const createAppointment = useCreateAppointment();
  const deleteAppointment = useDeleteAppointment();
  const cancelAppointment = useCancelAppointment();

  const [employeeFilter, setEmployeeFilter] = React.useState<Set<number>>(() => new Set());
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<'create' | 'edit'>('create');
  const [formValues, setFormValues] = React.useState<AppointmentFormValues>(() =>
    emptyAppointmentForm()
  );
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editingEmployeeId, setEditingEmployeeId] = React.useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = React.useState(false);

  const { data: editingAppointment, isLoading: editingLoading } = useAppointment(editingId ?? 0);

  const today = React.useMemo(() => new Date(), []);

  const boardEmployees = React.useMemo(() => assignedEmployees ?? [], [assignedEmployees]);

  const filteredEmployees = React.useMemo(() => {
    if (employeeFilter.size === 0) return boardEmployees;
    return boardEmployees.filter((e) => employeeFilter.has(e.id));
  }, [boardEmployees, employeeFilter]);

  const filterSet = React.useMemo(
    () => (employeeFilter.size > 0 ? employeeFilter : undefined),
    [employeeFilter]
  );

  const boardAppointments = React.useMemo(
    () => mapAppointmentsToBoard(appointments ?? [], date, filterSet),
    [appointments, date, filterSet]
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
    [boardAppointments]
  );

  // --- Resources for ResourcesDayView ---
  const resources = React.useMemo(
    () =>
      filteredEmployees.map((emp) => ({
        id: emp.id,
        label: getEmployeeFullName(emp),
      })),
    [filteredEmployees]
  );

  // --- Events for ResourcesDayView ---
  const scheduleEvents: ScheduleEventData[] = React.useMemo(() => {
    return boardAppointments.map((appt) => ({
      id: `${appt.id}-${appt.employeeId}`,
      title: `${appt.client} · ${appt.service}`,
      start: `${dateStr} ${padTime(appt.startHour)}:${padTime(appt.startMinute)}:00`,
      end: `${dateStr} ${padTime(appt.endHour)}:${padTime(appt.endMinute)}:00`,
      color: appt.cancelled ? 'gray' : appt.paid ? 'sage' : 'orange',
      resourceId: appt.employeeId,
    }));
  }, [boardAppointments, dateStr]);

  // --- Schedule date as string ---
  const scheduleDateStr = React.useMemo(() => dayjs(date).format('YYYY-MM-DD'), [date]);

  const handleScheduleDateChange = React.useCallback((newDate: string) => {
    setDate(new Date(newDate));
  }, []);

  // --- Handlers ---
  const goToday = React.useCallback(() => setDate(new Date()), []);

  const handleDatePick = React.useCallback((picked: Date) => {
    setDate(picked);
  }, []);

  const isAtToday = isSameDay(date, today);

  const closeForm = React.useCallback(() => {
    setFormOpen(false);
    setEditingId(null);
    setEditingEmployeeId(null);
    setFormMode('create');
    setDeleteConfirmOpen(false);
    setCancelConfirmOpen(false);
  }, []);

  React.useEffect(() => {
    if (!editingAppointment || formMode !== 'edit' || editingEmployeeId == null) return;
    setFormValues(appointmentToFormValues(editingAppointment, editingEmployeeId));
  }, [editingAppointment, editingEmployeeId, formMode]);

  const openCreateForm = React.useCallback(
    (prefill?: Partial<AppointmentFormValues>, targetDate?: Date) => {
      setEditingId(null);
      setEditingEmployeeId(null);
      setFormMode('create');
      setFormValues({ ...emptyAppointmentForm(targetDate ?? date), ...prefill });
      setFormOpen(true);
    },
    [date]
  );

  const handleEventClick = React.useCallback(
    (event: ScheduleEventData) => {
      const idStr = String(event.id);
      const [apptIdStr, empIdStr] = idStr.split('-');
      const apptId = Number(apptIdStr);
      const empId = Number(empIdStr);
      if (!isNaN(apptId) && !isNaN(empId)) {
        setEditingId(apptId);
        setEditingEmployeeId(empId);
        setFormMode('edit');
        setFormOpen(true);
      }
    },
    []
  );

  const handleTimeSlotClick = React.useCallback(
    ({ slotStart, slotEnd, resourceId }: { slotStart: string; slotEnd: string; resourceId?: string | number }) => {
      openCreateForm(
        {
          employeeId: resourceId != null ? String(resourceId) : null,
          date: dateStr,
          startTime: dayjs(slotStart).format('HH:mm'),
          endTime: dayjs(slotEnd).format('HH:mm'),
        },
        date
      );
    },
    [openCreateForm, date, dateStr]
  );

  const handleSlotDragEnd = React.useCallback(
    ({ rangeStart, rangeEnd, resourceId }: { rangeStart: string; rangeEnd: string; resourceId?: string | number }) => {
      openCreateForm(
        {
          employeeId: resourceId != null ? String(resourceId) : null,
          date: dateStr,
          startTime: dayjs(rangeStart).format('HH:mm'),
          endTime: dayjs(rangeEnd).format('HH:mm'),
        },
        date
      );
    },
    [openCreateForm, date, dateStr]
  );

  const handleFormSubmit = React.useCallback(() => {
    const payload = formValuesToPayload(formValues);
    const afterSave = () => closeForm();

    if (editingId) {
      deleteAppointment.mutate(editingId, {
        onSuccess: () => createAppointment.mutate(payload, { onSuccess: afterSave }),
      });
      return;
    }

    createAppointment.mutate(payload, { onSuccess: afterSave });
  }, [formValues, editingId, deleteAppointment, createAppointment, closeForm]);

  const handleDelete = React.useCallback(() => {
    if (!editingId) return;
    deleteAppointment.mutate(editingId, { onSuccess: () => closeForm() });
  }, [editingId, deleteAppointment, closeForm]);

  const handleCancel = React.useCallback(() => {
    if (!editingId) return;
    cancelAppointment.mutate(editingId, { onSuccess: () => closeForm() });
  }, [editingId, cancelAppointment, closeForm]);

  const selectedEmployee = React.useMemo(
    () => (allEmployees ?? []).find((e) => String(e.id) === formValues.employeeId),
    [allEmployees, formValues.employeeId]
  );

  const clientOptions = React.useMemo(
    () => (clients ?? []).map((c) => ({ value: String(c.id), label: getClientFullName(c) })),
    [clients]
  );

  const employeeOptions = React.useMemo(() => {
    const boardIds = new Set(boardEmployees.map((e: Employee) => e.id));
    const all = (allEmployees ?? []).filter((e) => e.active || boardIds.has(e.id));
    return all.map((e) => ({ value: String(e.id), label: getEmployeeFullName(e) }));
  }, [allEmployees, boardEmployees]);

  const serviceOptions = React.useMemo(
    () => buildServiceOptions(services ?? [], selectedEmployee),
    [services, selectedEmployee]
  );

  const isSaving =
    createAppointment.isPending || deleteAppointment.isPending || cancelAppointment.isPending;
  const formLoading = isSaving || (formMode === 'edit' && editingLoading && !editingAppointment);

  const isInitialLoading = employeesLoading || appointmentsLoading;
  const isBackgroundFetching = employeesFetching || appointmentsFetching;

  if (isInitialLoading) {
    return <BoardSkeleton />;
  }

  if (employeesError) {
    return (
      <Box className={styles.page}>
        <Alert color='red' title='Не удалось загрузить данные' m='md'>
          Проверьте доступность API и авторизацию
        </Alert>
      </Box>
    );
  }

  return (
    <Box className={styles.page}>
      <BackgroundRefreshIndicator isRefreshing={isBackgroundFetching} />

      <Box className={styles.toolbar}>
        <Box className={styles.toolbarMain}>
          {boardEmployees.length > 0 && (
            <EmployeeFilterPopover
              employees={boardEmployees}
              selectedIds={employeeFilter}
              onChange={setEmployeeFilter}
              embedded
            />
          )}

          <Button
            leftSection={<Plus size={16} />}
            size='sm'
            onClick={() => openCreateForm()}
            disabled={employeeOptions.length === 0}
          >
            Новая запись
          </Button>
        </Box>
      </Box>

      <Box className={styles.body}>
        <Box className={styles.main}>
          {filteredEmployees.length === 0 && employeeFilter.size > 0 ? (
            <Alert color='gray' title='Фильтр сотрудников' m='md'>
              Выберите сотрудников в панели выше или сбросьте фильтр
            </Alert>
          ) : boardEmployees.length === 0 ? (
            <Alert color='gray' title='Нет сотрудников с графиком' m='md'>
              На выбранную дату нет сотрудников с рабочим графиком
            </Alert>
          ) : (
            <ResourcesDayView
              date={scheduleDateStr}
              onDateChange={handleScheduleDateChange}
              resources={resources}
              events={scheduleEvents}
              startTime='09:00:00'
              endTime='21:00:00'
              locale='ru'
              withCurrentTimeIndicator
              withDragSlotSelect
              onTimeSlotClick={handleTimeSlotClick}
              onSlotDragEnd={handleSlotDragEnd}
              onEventClick={handleEventClick}
              startScrollTime='09:00:00'
              renderResourceLabel={(resource) => (
                <Box className={styles.resourceLabel}>
                  <Avatar size='sm' radius='md' color='sage'>
                    {getEmployeeInitials(
                      filteredEmployees.find((e) => e.id === resource.id) ?? {
                        firstname: String(resource.label).charAt(0),
                        lastname: '',
                      }
                    )}
                  </Avatar>
                  <Box>
                    <Text size='sm' fw={500} lineClamp={1}>
                      {resource.label}
                    </Text>
                    <Text size='xs' c='dimmed'>
                      Сотрудник
                    </Text>
                  </Box>
                </Box>
              )}
              labels={{
                today: 'Сегодня',
                day: 'День',
                week: 'Неделя',
                month: 'Месяц',
                resources: 'Сотрудники',
                previous: 'Назад',
                next: 'Вперёд',
              }}
            />
          )}
        </Box>

        <BoardSidebar
          date={date}
          isAtToday={isAtToday}
          markedDates={appointmentDates}
          dayRevenue={dayRevenue}
          appointmentsCount={boardAppointments.length}
          onDateChange={handleDatePick}
          onGoToday={goToday}
        />
      </Box>

      <AppointmentFormModal
        opened={formOpen}
        mode={formMode}
        loading={formLoading}
        paid={editingAppointment?.paid}
        cancelled={!!editingAppointment?.cancelled_at}
        appointment={editingAppointment ?? null}
        values={formValues}
        clientOptions={clientOptions}
        clients={clients ?? []}
        employeeOptions={employeeOptions}
        serviceOptions={serviceOptions}
        onChange={setFormValues}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        onDelete={formMode === 'edit' ? () => setDeleteConfirmOpen(true) : undefined}
        onCancel={formMode === 'edit' ? () => setCancelConfirmOpen(true) : undefined}
      />

      <ConfirmModal
        opened={deleteConfirmOpen}
        title='Удалить запись'
        message='Удалить эту запись?'
        loading={deleteAppointment.isPending}
        onConfirm={handleDelete}
        onClose={() => setDeleteConfirmOpen(false)}
      />

      <ConfirmModal
        opened={cancelConfirmOpen}
        title='Отменить запись'
        message='Отменить эту запись? Она останется в системе, но будет помечена как отменённая.'
        loading={cancelAppointment.isPending}
        onConfirm={handleCancel}
        onClose={() => setCancelConfirmOpen(false)}
      />
    </Box>
  );
};
