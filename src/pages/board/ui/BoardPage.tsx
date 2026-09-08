import React from 'react';
import { Alert, Box, Loader, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { useLoading } from '@/shared/lib/contexts/LoadingContext';
import { useI18n } from '@/shared/lib/i18n';
import { useBoardData } from '../lib/useBoardData';
import { useBoardForm } from '../lib/useBoardForm';
import { AppointmentFormModal } from './AppointmentForm';
import { BoardCancelConfirmModal } from './BoardCancelConfirmModal';
import { BoardCreateFab } from './BoardCreateFab';
import { BoardDateSheet } from './BoardDateSheet';
import { BoardMobileSchedule } from './BoardMobileSchedule';
import { BoardMobileToolbar } from './BoardMobileToolbar';
import { BoardRevenueSheet } from './BoardRevenueSheet';
import { BoardSchedule } from './BoardSchedule';
import { BoardSkeleton } from './BoardSkeleton';
import { BoardToolbar } from './BoardToolbar';
import { BoardSidebar } from './Sidebar';
import styles from './board-page.module.css';

export const BoardPage: React.FC = () => {
  const { t } = useI18n();
  const board = useBoardData();
  const { hasPermission } = useAccess();
  const { isLoading: globalLoading, setIsLoading } = useLoading();
  const isMobile = useMediaQuery('(max-width: 47.99em)');
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [dateSheetOpen, setDateSheetOpen] = React.useState(false);
  const [revenueSheetOpen, setRevenueSheetOpen] = React.useState(false);

  const form = useBoardForm({
    date: board.date,
    services: board.services,
    materials: board.materials,
    createAppointment: board.createAppointment,
    archiveAppointment: board.archiveAppointment,
    restoreAppointment: board.restoreAppointment,
    cancelAppointment: board.cancelAppointment,
  });

  React.useEffect(() => {
    if (!board.isInitialLoading && globalLoading) {
      setIsLoading(false);
    }
  }, [board.isInitialLoading, globalLoading, setIsLoading]);

  React.useEffect(() => {
    if (isMobile) return;
    setDateSheetOpen(false);
    setRevenueSheetOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  }, [isMobile]);

  const selectedEmployee = React.useMemo(
    () => board.allEmployees.find((e) => String(e.id) === form.formValues.employeeId),
    [board.allEmployees, form.formValues.employeeId],
  );

  const serviceOptions = React.useMemo(
    () => board.buildServiceOptions(board.services, selectedEmployee),
    [board.services, selectedEmployee, board.buildServiceOptions],
  );

  const mobileAppointments = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return board.boardAppointments;
    return board.boardAppointments.filter(
      (appt) =>
        appt.client.toLowerCase().includes(query) ||
        appt.service.toLowerCase().includes(query) ||
        appt.employeeName.toLowerCase().includes(query),
    );
  }, [board.boardAppointments, searchQuery]);

  const canCreateAppointment = hasPermission(PermissionCode.APPOINTMENT_CREATE);
  const canOpenCreateForm = board.employeeOptions.length > 0;

  const handleOpenCreate = React.useCallback(() => {
    form.openCreateForm();
  }, [form]);

  if (board.isInitialLoading) {
    if (globalLoading) return null;
    return <BoardSkeleton />;
  }

  if (board.employeesError) {
    return (
      <Box className={styles.page}>
        <Alert color="red" title={t('board.loadError')} m="md">
          {t('common.checkApiAuth')}
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
            {t('board.refresh')}
          </Text>
        </Box>
      )}

      {isMobile ? (
        <BoardMobileToolbar
          date={board.date}
          showArchived={board.showArchived}
          searchOpen={searchOpen}
          searchQuery={searchQuery}
          boardEmployees={board.boardEmployees}
          employeeFilter={board.employeeFilter}
          onEmployeeFilterChange={board.setEmployeeFilter}
          onOpenDateSheet={() => setDateSheetOpen(true)}
          onOpenRevenueSheet={() => setRevenueSheetOpen(true)}
          onShowArchivedChange={board.setShowArchived}
          onSearchOpenChange={setSearchOpen}
          onSearchQueryChange={setSearchQuery}
        />
      ) : (
        <BoardToolbar
          boardEmployees={board.boardEmployees}
          employeeFilter={board.employeeFilter}
          onEmployeeFilterChange={board.setEmployeeFilter}
          showArchived={board.showArchived}
          onShowArchivedChange={board.setShowArchived}
          canCreateAppointment={canCreateAppointment}
          canOpenCreateForm={canOpenCreateForm}
          onCreateAppointment={handleOpenCreate}
        />
      )}

      <Box className={styles.body}>
        <Box className={styles.main}>
          {isMobile ? (
            <BoardMobileSchedule
              dateStr={board.dateStr}
              isAtToday={board.isAtToday}
              filteredEmployees={board.filteredEmployees}
              boardEmployees={board.boardEmployees}
              boardAppointments={mobileAppointments}
              employeeFilter={board.employeeFilter}
              onEventClick={form.openEditForm}
              onSlotCreate={(prefill) => form.openCreateForm(prefill, board.date)}
            />
          ) : (
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
          )}
        </Box>

        {!isMobile && (
          <BoardSidebar
            date={board.date}
            isAtToday={board.isAtToday}
            markedDates={board.appointmentDates}
            dayRevenue={board.dayRevenue}
            appointmentsCount={board.boardAppointments.length}
            onDateChange={board.setDate}
            onGoToday={board.goToday}
          />
        )}
      </Box>

      {isMobile && canCreateAppointment && (
        <BoardCreateFab
          disabled={!canOpenCreateForm}
          loading={form.isSaving || form.formLoading}
          onClick={handleOpenCreate}
        />
      )}

      {isMobile && (
        <>
          <BoardDateSheet
            opened={dateSheetOpen}
            date={board.date}
            markedDates={board.appointmentDates}
            onDateChange={board.setDate}
            onClose={() => setDateSheetOpen(false)}
          />
          <BoardRevenueSheet
            opened={revenueSheetOpen}
            dayRevenue={board.dayRevenue}
            appointmentsCount={board.boardAppointments.length}
            onClose={() => setRevenueSheetOpen(false)}
          />
        </>
      )}

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
        title={t('appointments.archiveTitle')}
        message={t('board.archiveMessage')}
        confirmLabel={t('common.archive')}
        loading={board.archiveAppointment.isPending}
        onConfirm={form.handleDelete}
        onClose={() => form.setDeleteConfirmOpen(false)}
      />

      <BoardCancelConfirmModal
        opened={form.cancelConfirmOpen}
        loading={board.cancelAppointment.isPending}
        hasActiveReceipt={form.hasActiveReceipt}
        cancelReason={form.cancelReason}
        onCancelReasonChange={form.setCancelReason}
        onConfirm={form.handleCancel}
        onClose={() => form.setCancelConfirmOpen(false)}
      />
    </Box>
  );
};
