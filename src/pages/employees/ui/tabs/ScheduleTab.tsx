import React from 'react';
import { Skeleton, Stack } from '@mantine/core';
import { ConfirmModal } from '@/shared/ui';
import { AbsenceFormModal } from './schedule/AbsenceFormModal';
import { AbsencesTable } from './schedule/AbsencesTable';
import { ScheduleFormModal } from './schedule/ScheduleFormModal';
import { WeekScheduleGrid } from './schedule/WeekScheduleGrid';
import { useScheduleTab } from './useScheduleTab';

interface ScheduleTabProps {
  employeeId: number;
}

export const ScheduleTab: React.FC<ScheduleTabProps> = ({ employeeId }) => {
  const tab = useScheduleTab(employeeId);

  if (tab.isLoading) return <Skeleton height={200} radius="md" />;

  return (
    <Stack gap="lg">
      <WeekScheduleGrid
        hasSchedule={tab.hasSchedule}
        dayScheduleMap={tab.dayScheduleMap}
        onEdit={tab.openScheduleEdit}
        onCreate={tab.openScheduleCreate}
      />

      <AbsencesTable
        absences={tab.absences}
        onAdd={() => tab.openAbsenceForm()}
        onEdit={tab.openAbsenceForm}
        onArchive={tab.setDeleteAbsenceTargetId}
      />

      <ScheduleFormModal
        opened={tab.scheduleFormOpen}
        hasSchedule={tab.hasSchedule}
        dayEntries={tab.dayEntries}
        loading={tab.scheduleLoading}
        onClose={() => tab.setScheduleFormOpen(false)}
        onSubmit={tab.submitSchedule}
        onDayEntriesChange={tab.setDayEntries}
      />

      <AbsenceFormModal
        opened={tab.absenceFormOpen}
        editingAbsence={tab.editingAbsence}
        absenceType={tab.absenceType}
        startDate={tab.startDate}
        endDate={tab.endDate}
        reason={tab.reason}
        loading={tab.absenceLoading}
        onClose={() => tab.setAbsenceFormOpen(false)}
        onSubmit={tab.submitAbsence}
        onAbsenceTypeChange={tab.setAbsenceType}
        onStartDateChange={tab.setStartDate}
        onEndDateChange={tab.setEndDate}
        onReasonChange={tab.setReason}
      />

      <ConfirmModal
        opened={Boolean(tab.deleteAbsenceTarget)}
        title="Архивировать отсутствие"
        message="Архивировать это отсутствие?"
        loading={tab.archiveAbsencePending}
        onConfirm={() =>
          tab.deleteAbsenceTarget &&
          tab.archiveAbsence.mutate(tab.deleteAbsenceTarget.id, {
            onSuccess: () => tab.setDeleteAbsenceTargetId(null),
          })
        }
        onClose={() => tab.setDeleteAbsenceTargetId(null)}
      />
    </Stack>
  );
};
