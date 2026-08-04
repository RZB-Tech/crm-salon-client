import React from 'react';
import { Alert, Box, Button, Group, Loader, Select, Skeleton, Stack, Text } from '@mantine/core';
import { Plus } from '@phosphor-icons/react';
import type { AppointmentCancelledReason } from '@/shared/api/types';
import { APPOINTMENT_CANCELLED_REASON_OPTIONS } from '@/shared/lib/format';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { ArchiveToggle } from '@/shared/ui';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { useBoardData } from '../lib/useBoardData';
import { useBoardForm } from '../lib/useBoardForm';
import { AppointmentFormModal } from './AppointmentForm';
import { BoardSidebar } from './Sidebar';
import { BoardSchedule } from './BoardSchedule';
import { EmployeeFilterPopover } from './EmployeeFilterPopover';
import styles from './board-page.module.css';

const BoardSkeleton: React.FC = () => (
  <Stack gap={0} h="100%" className={styles.skeletonRoot}>
    <Skeleton height={56} radius={0} mb={0} />
    <Box className={styles.skeletonBody}>
      <Skeleton height="100%" width="100%" radius={0} />
      <Skeleton height="100%" width={320} radius={0} />
    </Box>
  </Stack>
);

export const BoardPage: React.FC = () => {
  const board = useBoardData();
  const { hasPermission } = useAccess();
  const form = useBoardForm({
    date: board.date,
    services: board.services,
    materials: board.materials,
    createAppointment: board.createAppointment,
    archiveAppointment: board.archiveAppointment,
    restoreAppointment: board.restoreAppointment,
    cancelAppointment: board.cancelAppointment,
  });

  const selectedEmployee = React.useMemo(
    () => board.allEmployees.find((e) => String(e.id) === form.formValues.employeeId),
    [board.allEmployees, form.formValues.employeeId],
  );

  const serviceOptions = React.useMemo(
    () => board.buildServiceOptions(board.services, selectedEmployee),
    [board.services, selectedEmployee, board.buildServiceOptions],
  );

  if (board.isInitialLoading) {
    return <BoardSkeleton />;
  }

  if (board.employeesError) {
    return (
      <Box className={styles.page}>
        <Alert color="red" title="Не удалось загрузить данные" m="md">
          Проверьте доступность API и авторизацию
        </Alert>
      </Box>
    );
  }

  return (
    <Box className={styles.page}>
      {board.isBackgroundFetching && (
        <Box className={styles.refreshIndicator}>
          <Loader size="xs" />
          <Text size="xs" c="dimmed">
            Обновление...
          </Text>
        </Box>
      )}

      <Box className={styles.toolbar}>
        <Box className={styles.toolbarMain}>
          {board.boardEmployees.length > 0 && (
            <EmployeeFilterPopover
              employees={board.boardEmployees}
              selectedIds={board.employeeFilter}
              onChange={board.setEmployeeFilter}
              embedded
            />
          )}
        </Box>
        <Group gap={8} wrap="nowrap">
          {hasPermission(PermissionCode.APPOINTMENT_CREATE) && (
            <Button
              leftSection={<Plus size={16} />}
              size="sm"
              onClick={() => form.openCreateForm()}
              disabled={board.employeeOptions.length === 0}
            >
              Новая запись
            </Button>
          )}
          <ArchiveToggle active={board.showArchived} onChange={board.setShowArchived} />
        </Group>
      </Box>

      <Box className={styles.body}>
        <Box className={styles.main}>
          <BoardSchedule
            date={board.date}
            dateStr={board.dateStr}
            filteredEmployees={board.filteredEmployees}
            boardEmployees={board.boardEmployees}
            boardAppointments={board.boardAppointments}
            employeeFilter={board.employeeFilter}
            onEventClick={form.openEditForm}
            onSlotCreate={(prefill) => form.openCreateForm(prefill, board.date)}
          />
        </Box>

        <BoardSidebar
          date={board.date}
          isAtToday={board.isAtToday}
          markedDates={board.appointmentDates}
          dayRevenue={board.dayRevenue}
          appointmentsCount={board.boardAppointments.length}
          onDateChange={board.setDate}
          onGoToday={board.goToday}
        />
      </Box>

      <AppointmentFormModal
        opened={form.formOpen}
        mode={form.formMode}
        loading={form.formLoading}
        paid={form.isPaid}
        cancelled={form.editingAppointment?.status === 'cancelled'}
        archived={form.editingAppointment?.archived}
        structureLocked={form.hasActiveReceipt}
        activeReceipt={form.activeReceipt}
        appointment={form.editingAppointment ?? null}
        values={form.formValues}
        clientOptions={board.clientOptions}
        clients={board.clients}
        employeeOptions={board.employeeOptions}
        serviceOptions={serviceOptions}
        materialOptions={board.materialOptions}
        onChange={form.setFormValues}
        onClose={form.closeForm}
        onSubmit={() => void form.handleFormSubmit()}
        onDelete={form.formMode === 'edit' ? () => form.setDeleteConfirmOpen(true) : undefined}
        onRestore={form.formMode === 'edit' ? form.handleRestore : undefined}
        onCancel={form.formMode === 'edit' ? form.openCancelConfirm : undefined}
      />

      <ConfirmModal
        opened={form.deleteConfirmOpen}
        title="Архивировать запись"
        message="Архивировать эту запись? Она будет скрыта из расписания. Восстановить можно через фильтр «Архив»."
        confirmLabel="Архивировать"
        loading={board.archiveAppointment.isPending}
        onConfirm={form.handleDelete}
        onClose={() => form.setDeleteConfirmOpen(false)}
      />

      <ConfirmModal
        opened={form.cancelConfirmOpen}
        title="Отменить запись"
        message="Отменить эту запись? Она останется в системе, но будет помечена как отменённая. Оплаченные записи и записи с активным чеком отменить нельзя — сначала отмените чек."
        confirmLabel="Отменить запись"
        loading={board.cancelAppointment.isPending}
        confirmDisabled={!form.cancelReason || form.hasActiveReceipt}
        onConfirm={form.handleCancel}
        onClose={() => form.setCancelConfirmOpen(false)}
      >
        {form.hasActiveReceipt && (
          <Alert color="orange" mb="sm">
            Есть активный чек. Сначала отмените его в блоке оплаты.
          </Alert>
        )}
        <Select
          label="Причина отмены"
          data={APPOINTMENT_CANCELLED_REASON_OPTIONS}
          value={form.cancelReason}
          onChange={(value) => {
            if (value) form.setCancelReason(value as AppointmentCancelledReason);
          }}
          allowDeselect={false}
        />
      </ConfirmModal>
    </Box>
  );
};
