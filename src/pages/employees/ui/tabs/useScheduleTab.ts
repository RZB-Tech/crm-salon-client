import React from 'react';
import { useEmployeeWorkSchedules } from '@/shared/api/hooks/useEmployees';
import {
  useCreateWorkSchedule,
  useDeleteWorkSchedule,
  useUpdateWorkSchedule,
} from '@/shared/api/hooks/useWorkSchedules';
import {
  useCreateAbsence,
  useArchiveAbsence,
  useUpdateAbsence,
} from '@/shared/api/hooks/useAbsences';
import type { Absence, AbsenceType } from '@/shared/api/types';
import { useResolvedById } from '@/shared/lib/hooks/useResolvedById';
import {
  buildDayEntriesForEdit,
  buildDayScheduleMap,
  buildScheduleCreatePayload,
  getScheduleDiff,
  type DayTimeEntry,
} from '../../lib/scheduleHelpers';

const today = () => new Date().toISOString().slice(0, 10);

export const useScheduleTab = (employeeId: number) => {
  const [scheduleFormOpen, setScheduleFormOpen] = React.useState(false);
  const [absenceFormOpen, setAbsenceFormOpen] = React.useState(false);
  const [editingAbsenceId, setEditingAbsenceId] = React.useState<number | null>(null);
  const [dayEntries, setDayEntries] = React.useState<DayTimeEntry[]>([]);
  const [startDate, setStartDate] = React.useState(today);
  const [endDate, setEndDate] = React.useState(today);
  const [absenceType, setAbsenceType] = React.useState<AbsenceType>('vacation');
  const [reason, setReason] = React.useState('');
  const [deleteAbsenceTargetId, setDeleteAbsenceTargetId] = React.useState<number | null>(null);

  const { data, isLoading } = useEmployeeWorkSchedules(employeeId);
  const createSchedule = useCreateWorkSchedule();
  const updateSchedule = useUpdateWorkSchedule();
  const deleteSchedule = useDeleteWorkSchedule();
  const createAbsence = useCreateAbsence();
  const updateAbsence = useUpdateAbsence();
  const archiveAbsence = useArchiveAbsence();

  const schedules = data?.work_schedules ?? [];
  const absences = data?.absences ?? [];
  const editingAbsence = useResolvedById(absences, editingAbsenceId);
  const deleteAbsenceTarget = useResolvedById(absences, deleteAbsenceTargetId);
  const hasSchedule = schedules.length > 0;
  const dayScheduleMap = React.useMemo(() => buildDayScheduleMap(schedules), [schedules]);

  const closeScheduleForm = React.useCallback(() => setScheduleFormOpen(false), []);

  const submitSchedule = React.useCallback(() => {
    if (dayEntries.length === 0 && !hasSchedule) return;

    if (hasSchedule) {
      const { updatePayload, newDays, removedDays } = getScheduleDiff(
        dayEntries,
        schedules,
        dayScheduleMap,
      );
      for (const removed of removedDays) deleteSchedule.mutate(removed.id);

      const finishCreate = (entries: DayTimeEntry[]) =>
        createSchedule.mutate(buildScheduleCreatePayload(employeeId, entries), {
          onSuccess: closeScheduleForm,
        });

      if (updatePayload.work_schedules.length > 0) {
        updateSchedule.mutate(updatePayload, {
          onSuccess: () => (newDays.length > 0 ? finishCreate(newDays) : closeScheduleForm()),
        });
      } else if (newDays.length > 0) {
        finishCreate(newDays);
      } else {
        closeScheduleForm();
      }
    } else {
      createSchedule.mutate(buildScheduleCreatePayload(employeeId, dayEntries), {
        onSuccess: closeScheduleForm,
      });
    }
  }, [
    dayEntries,
    hasSchedule,
    schedules,
    dayScheduleMap,
    employeeId,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    closeScheduleForm,
  ]);

  const openAbsenceForm = React.useCallback((absence?: Absence) => {
    setEditingAbsenceId(absence?.id ?? null);
    if (absence) {
      setStartDate(absence.start_date);
      setEndDate(absence.end_date);
      setAbsenceType(absence.absence_type);
      setReason(absence.reason ?? '');
    }
    setAbsenceFormOpen(true);
  }, []);

  const submitAbsence = React.useCallback(() => {
    const payload = {
      start_date: startDate,
      end_date: endDate,
      absence_type: absenceType,
      reason: reason || null,
    };
    if (editingAbsence) {
      updateAbsence.mutate(
        { id: editingAbsence.id, ...payload },
        { onSuccess: () => setAbsenceFormOpen(false) },
      );
    } else {
      createAbsence.mutate(
        { employee_id: employeeId, ...payload },
        { onSuccess: () => setAbsenceFormOpen(false) },
      );
    }
  }, [startDate, endDate, absenceType, reason, employeeId, editingAbsence, createAbsence, updateAbsence]);

  const openScheduleEdit = React.useCallback(() => {
    setDayEntries(buildDayEntriesForEdit(dayScheduleMap));
    setScheduleFormOpen(true);
  }, [dayScheduleMap]);

  const openScheduleCreate = React.useCallback(() => {
    setDayEntries([]);
    setScheduleFormOpen(true);
  }, []);

  return {
    isLoading,
    hasSchedule,
    dayScheduleMap,
    absences,
    editingAbsence,
    deleteAbsenceTarget,
    scheduleFormOpen,
    absenceFormOpen,
    dayEntries,
    startDate,
    endDate,
    absenceType,
    reason,
    scheduleLoading: createSchedule.isPending || updateSchedule.isPending || deleteSchedule.isPending,
    absenceLoading: createAbsence.isPending || updateAbsence.isPending,
    archiveAbsencePending: archiveAbsence.isPending,
    setScheduleFormOpen,
    setDayEntries,
    setStartDate,
    setEndDate,
    setAbsenceType,
    setReason,
    setAbsenceFormOpen,
    setDeleteAbsenceTargetId,
    submitSchedule,
    submitAbsence,
    openAbsenceForm,
    openScheduleEdit,
    openScheduleCreate,
    archiveAbsence,
  };
};
