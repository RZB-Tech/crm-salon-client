import React from 'react';
import { Alert, Box, Skeleton, Stack } from '@mantine/core';
import { ListPageShell, ListPaginationFooter } from '@/shared/ui';
import { PermissionCode } from '@/shared/lib/permissions';
import { AppointmentFormModal } from '@/pages/board/ui/AppointmentForm';
import { useAppointmentsPage } from '../lib/useAppointmentsPage';
import { AppointmentsFilters } from './AppointmentsFilters';
import { AppointmentsTable } from './AppointmentsTable';
import { AppointmentsConfirmModals } from './AppointmentsConfirmModals';

export const AppointmentsPage: React.FC = () => {
  const {
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
    cancelAppointment,
    confirmArchiveRow,
    closeArchiveConfirm,
    restoreAppointment,
  } = useAppointmentsPage();

  const filterToolbar = (
    <AppointmentsFilters
      filterForm={filterForm}
      patchFilter={patchFilter}
      hasFilterField={hasFilterField}
      clientOptions={clientOptions}
      statusOptions={statusOptions}
      canCreate={hasPermission(PermissionCode.APPOINTMENT_CREATE)}
      onCreateClick={() => form.openCreateForm()}
    />
  );

  if (isLoading) {
    return (
      <ListPageShell
        toolbar={
          <>
            <Skeleton height={48} width={260} radius="md" />
            <Skeleton height={48} width={280} radius="md" />
          </>
        }
      >
        <Stack gap="xs" p="md">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} height={52} radius="sm" />
          ))}
        </Stack>
      </ListPageShell>
    );
  }

  if (isError) {
    return (
      <ListPageShell>
        <Box p="xl">
          <Alert color="red" title="Не удалось загрузить посещения">
            Проверьте доступность API и авторизацию
          </Alert>
        </Box>
      </ListPageShell>
    );
  }

  const { page, pageSize, paginatedItems, total, setPage, setPageSize } = pagination;

  return (
    <ListPageShell
      toolbar={filterToolbar}
      footer={
        <ListPaginationFooter
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      }
    >
      <AppointmentsTable
        items={paginatedItems}
        showArchived={filterForm.archived}
        canUpdate={hasPermission(PermissionCode.APPOINTMENT_UPDATE)}
        restorePending={restoreAppointment.isPending}
        onRowClick={openEdit}
        onRestore={handleRestoreRow}
        onArchive={handleArchiveRow}
      />

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
        clientOptions={formClientOptions}
        clients={clients ?? []}
        employeeOptions={employeeOptions}
        serviceOptions={serviceOptions}
        materialOptions={materialOptions}
        onChange={form.setFormValues}
        onClose={form.closeForm}
        onSubmit={() => void form.handleFormSubmit()}
        onDelete={form.formMode === 'edit' ? () => form.setDeleteConfirmOpen(true) : undefined}
        onRestore={form.formMode === 'edit' ? form.handleRestore : undefined}
        onCancel={form.formMode === 'edit' ? form.openCancelConfirm : undefined}
      />

      <AppointmentsConfirmModals
        form={form}
        archiveTarget={archiveTarget}
        archivePending={archiveAppointment.isPending}
        cancelPending={cancelAppointment.isPending}
        onConfirmArchiveRow={confirmArchiveRow}
        onCloseArchiveRow={closeArchiveConfirm}
      />
    </ListPageShell>
  );
};
