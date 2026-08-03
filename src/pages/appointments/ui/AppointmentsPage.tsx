import React from 'react';
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Group,
  Select,
  Skeleton,
  Stack,
  Table,
  Text,
  Tooltip,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
  ArchiveIcon,
  ArrowCounterClockwiseIcon,
  PlusIcon,
} from '@phosphor-icons/react';
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
import type { Appointment, AppointmentCancelledReason, AppointmentStatus } from '@/shared/api/types';
import {
  ArchiveToggle,
  ConfirmModal,
  ListPageShell,
  ListPaginationFooter,
  listPageStyles,
} from '@/shared/ui';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import {
  APPOINTMENT_CANCELLED_REASON_LABELS,
  APPOINTMENT_CANCELLED_REASON_OPTIONS,
  APPOINTMENT_STATUS_LABELS,
  formatDateTime,
  formatPrice,
  getClientFullName,
  getEmployeeFullName,
} from '@/shared/lib/format';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { AppointmentFormModal } from '@/pages/board/ui/AppointmentForm';
import { useBoardForm } from '@/pages/board/lib/useBoardForm';
import { buildMaterialOptions, buildServiceOptions } from '@/pages/board/lib/appointmentForm';
import {
  getAppointmentClientName,
  getAppointmentEmployeesLabel,
  getAppointmentServicesLabel,
  getAppointmentWhenLabel,
} from '../lib/appointmentList';
import {
  APPOINTMENT_FILTER_LABELS,
  buildAppointmentListFilters,
  clientFilterOptions,
  emptyAppointmentFilterForm,
  enumOptionsFromSchema,
  type AppointmentFilterFormState,
} from '../lib/appointmentFilters';

const PAID_OPTIONS = [
  { value: 'true', label: 'Оплачено' },
  { value: 'false', label: 'Не оплачено' },
];

const statusColor = (status: AppointmentStatus): string => {
  if (status === 'cancelled') return 'red';
  if (status === 'finished') return 'teal';
  if (status === 'started') return 'blue';
  return 'gray';
};

export const AppointmentsPage: React.FC = () => {
  const { hasPermission } = useAccess();
  const [filterForm, setFilterForm] = React.useState<AppointmentFilterFormState>(
    emptyAppointmentFilterForm,
  );
  const [archiveTarget, setArchiveTarget] = React.useState<Appointment | null>(null);

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

  const statusOptions = React.useMemo(() => {
    const fromSchema = enumOptionsFromSchema(schemaByField.get('status'));
    if (fromSchema.length > 0) return fromSchema;
    return [
      { value: 'awaiting', label: 'Ожидание' },
      { value: 'started', label: 'Начата' },
      { value: 'finished', label: 'Завершена' },
      { value: 'cancelled', label: 'Отменена' },
    ];
  }, [schemaByField]);

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

  const { page, pageSize, paginatedItems, total, setPage, setPageSize, resetPage } =
    usePagination(sorted, { defaultPageSize: 20 });

  React.useEffect(() => {
    resetPage();
  }, [listFilters, resetPage]);

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
      setArchiveTarget(appointment);
    },
    [],
  );

  const filterToolbar = (
    <Group justify="space-between" w="100%" gap="sm" wrap="wrap" align="flex-end">
      <Group gap="sm" wrap="wrap" align="flex-end">
        {hasFilterField('client_id') && (
          <Select
            label={APPOINTMENT_FILTER_LABELS.client_id}
            placeholder="Все клиенты"
            searchable
            clearable
            data={clientOptions}
            value={filterForm.clientId}
            onChange={(value) => patchFilter({ clientId: value })}
            size="sm"
            w={200}
          />
        )}
        {hasFilterField('status') && (
          <Select
            label={APPOINTMENT_FILTER_LABELS.status}
            placeholder="Все статусы"
            clearable
            data={statusOptions}
            value={filterForm.status}
            onChange={(value) => patchFilter({ status: value })}
            size="sm"
            w={150}
          />
        )}
        {hasFilterField('paid') && (
          <Select
            label={APPOINTMENT_FILTER_LABELS.paid}
            placeholder="Все"
            clearable
            data={PAID_OPTIONS}
            value={filterForm.paid}
            onChange={(value) => patchFilter({ paid: value })}
            size="sm"
            w={140}
          />
        )}
        {hasFilterField('start_time_est') && (
          <>
            <DateInput
              label={APPOINTMENT_FILTER_LABELS.start_time_est}
              placeholder="От"
              clearable
              value={filterForm.dateFrom || null}
              onChange={(value) => patchFilter({ dateFrom: value ?? '' })}
              size="sm"
              w={150}
            />
            <DateInput
              label={APPOINTMENT_FILTER_LABELS.end_time_est}
              placeholder="До"
              clearable
              value={filterForm.dateTo || null}
              onChange={(value) => patchFilter({ dateTo: value ?? '' })}
              size="sm"
              w={150}
            />
          </>
        )}
      </Group>

      <Group gap={8} wrap="nowrap" align="flex-end">
        {!filterForm.archived && hasPermission(PermissionCode.APPOINTMENT_CREATE) && (
          <Button
            color="sage.7"
            rightSection={<PlusIcon size={16} />}
            onClick={() => form.openCreateForm()}
            size="sm"
          >
            Новая запись
          </Button>
        )}
        {hasFilterField('archived') && (
          <ArchiveToggle
            active={filterForm.archived}
            onChange={(archived) => patchFilter({ archived })}
          />
        )}
      </Group>
    </Group>
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
      <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th className={listPageStyles.headCell} w={64}>
              №
            </Table.Th>
            <Table.Th className={listPageStyles.headCell} miw={160}>
              Дата и время
            </Table.Th>
            <Table.Th className={listPageStyles.headCell} miw={160}>
              Клиент
            </Table.Th>
            <Table.Th className={listPageStyles.headCell} miw={140}>
              Сотрудники
            </Table.Th>
            <Table.Th className={listPageStyles.headCell} miw={220}>
              Услуги и товары
            </Table.Th>
            <Table.Th className={listPageStyles.headCell} w={120}>
              Сумма
            </Table.Th>
            <Table.Th className={listPageStyles.headCell} w={120}>
              Статус
            </Table.Th>
            <Table.Th className={listPageStyles.headCell} w={110}>
              Оплата
            </Table.Th>
            <Table.Th className={listPageStyles.headCell} miw={140}>
              Комментарий
            </Table.Th>
            <Table.Th className={listPageStyles.headCell} w={130}>
              Создано
            </Table.Th>
            <Table.Th className={listPageStyles.headCell} w={48} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {paginatedItems.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={11}>
                <Text c="dimmed" ta="center" py="xl">
                  Посещений не найдено
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            paginatedItems.map((appointment) => (
              <Table.Tr
                key={appointment.id}
                className={`${listPageStyles.row} ${listPageStyles.rowClickable}`}
                onClick={() => openEdit(appointment)}
              >
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" c="dimmed">
                    {appointment.id}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" fw={600}>
                    {getAppointmentWhenLabel(appointment)}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Stack gap={2}>
                    <Text size="sm" fw={500}>
                      {getAppointmentClientName(appointment)}
                    </Text>
                    {appointment.client?.phone && (
                      <Text size="xs" c="dimmed">
                        {appointment.client.phone}
                      </Text>
                    )}
                  </Stack>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" lineClamp={2}>
                    {getAppointmentEmployeesLabel(appointment)}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" lineClamp={3}>
                    {getAppointmentServicesLabel(appointment)}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" fw={600}>
                    {formatPrice(appointment.total_price)}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Stack gap={4}>
                    <Badge size="sm" variant="light" color={statusColor(appointment.status)}>
                      {APPOINTMENT_STATUS_LABELS[appointment.status] ?? appointment.status}
                    </Badge>
                    {appointment.status === 'cancelled' && appointment.cancelled_reason && (
                      <Text size="xs" c="dimmed" lineClamp={2}>
                        {APPOINTMENT_CANCELLED_REASON_LABELS[appointment.cancelled_reason] ??
                          appointment.cancelled_reason}
                      </Text>
                    )}
                  </Stack>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Badge size="sm" variant="light" color={appointment.paid ? 'teal' : 'orange'}>
                    {appointment.paid ? 'Оплачено' : 'Не оплачено'}
                  </Badge>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" c={appointment.notes ? undefined : 'dimmed'} lineClamp={2}>
                    {appointment.notes || '—'}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="xs" c="dimmed">
                    {formatDateTime(appointment.created_at)}
                  </Text>
                </Table.Td>
                <Table.Td
                  className={listPageStyles.bodyCell}
                  onClick={(event) => event.stopPropagation()}
                >
                  {filterForm.archived || appointment.archived
                    ? hasPermission(PermissionCode.APPOINTMENT_UPDATE) && (
                        <Tooltip label="Восстановить">
                          <ActionIcon
                            variant="subtle"
                            color="teal"
                            onClick={(event) => handleRestoreRow(event, appointment.id)}
                            loading={restoreAppointment.isPending}
                          >
                            <ArrowCounterClockwiseIcon size={16} />
                          </ActionIcon>
                        </Tooltip>
                      )
                    : hasPermission(PermissionCode.APPOINTMENT_UPDATE) && (
                        <Tooltip label="Архивировать">
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={(event) => handleArchiveRow(event, appointment)}
                          >
                            <ArchiveIcon size={16} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>

      <AppointmentFormModal
        opened={form.formOpen}
        mode={form.formMode}
        loading={form.formLoading}
        paid={form.editingAppointment?.paid}
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

      <ConfirmModal
        opened={form.deleteConfirmOpen}
        title="Архивировать посещение"
        message="Архивировать это посещение? Оно будет скрыто из списка и расписания."
        confirmLabel="Архивировать"
        loading={archiveAppointment.isPending}
        onConfirm={form.handleDelete}
        onClose={() => form.setDeleteConfirmOpen(false)}
      />

      <ConfirmModal
        opened={Boolean(archiveTarget)}
        title="Архивировать посещение"
        message={`Архивировать посещение №${archiveTarget?.id ?? ''} (${archiveTarget ? getAppointmentClientName(archiveTarget) : ''})?`}
        confirmLabel="Архивировать"
        loading={archiveAppointment.isPending}
        onConfirm={() =>
          archiveTarget &&
          archiveAppointment.mutate(archiveTarget.id, {
            onSuccess: () => setArchiveTarget(null),
          })
        }
        onClose={() => setArchiveTarget(null)}
      />

      <ConfirmModal
        opened={form.cancelConfirmOpen}
        title="Отменить посещение"
        message="Отменить это посещение? Оплаченные и посещения с активным чеком отменить нельзя — сначала отмените чек."
        confirmLabel="Отменить посещение"
        loading={cancelAppointment.isPending}
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
    </ListPageShell>
  );
};
