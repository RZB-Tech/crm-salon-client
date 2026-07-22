import React from 'react';
import {
  Group,
  Button,
  Table,
  Text,
  ActionIcon,
  Menu,
  Modal,
  TextInput,
  Skeleton,
  Select,
  Badge,
  Chip,
  SimpleGrid,
  Stack,
} from '@mantine/core';
import { Plus, PencilSimple, DotsThree, Trash } from '@phosphor-icons/react';
import { useEmployeeWorkSchedules } from '@/shared/api/hooks/useEmployees';
import {
  useCreateWorkSchedule,
  useDeleteWorkSchedule,
  useUpdateWorkSchedule,
} from '@/shared/api/hooks/useWorkSchedules';
import {
  useCreateAbsence,
  useDeleteAbsence,
  useUpdateAbsence,
} from '@/shared/api/hooks/useAbsences';
import type {
  Absence,
  AbsenceType,
  WorkSchedule,
  WorkScheduleCreatePayload,
  WorkScheduleUpdatePayload,
} from '@/shared/api/types';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import { ConfirmModal, DataTable, DataTableRow } from '@/shared/ui';
import {
  ABSENCE_TYPE_LABELS,
  ABSENCE_TYPE_OPTIONS,
  DAY_OF_WEEK_LABELS,
  DAY_OF_WEEK_OPTIONS,
  formatDate,
  formatTime,
  toApiTime,
} from '@/shared/lib/format';
import styles from '../employee-profile.module.css';
import scheduleStyles from './schedule-tab.module.css';

interface ScheduleTabProps {
  employeeId: number;
}

const ALL_DAYS = [1, 2, 3, 4, 5, 6, 7] as const;

export const ScheduleTab: React.FC<ScheduleTabProps> = ({ employeeId }) => {
  const [scheduleFormOpen, setScheduleFormOpen] = React.useState(false);
  const [absenceFormOpen, setAbsenceFormOpen] = React.useState(false);
  const [editingSchedule, setEditingSchedule] = React.useState<WorkSchedule | null>(null);
  const [editingAbsence, setEditingAbsence] = React.useState<Absence | null>(null);
  const [selectedDays, setSelectedDays] = React.useState<string[]>([]);
  const [startTime, setStartTime] = React.useState('09:00');
  const [endTime, setEndTime] = React.useState('18:00');
  const [startDate, setStartDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [absenceType, setAbsenceType] = React.useState<AbsenceType>('vacation');
  const [reason, setReason] = React.useState('');
  const [deleteScheduleTarget, setDeleteScheduleTarget] = React.useState<WorkSchedule | null>(null);
  const [deleteAbsenceTarget, setDeleteAbsenceTarget] = React.useState<Absence | null>(null);

  const { data, isLoading } = useEmployeeWorkSchedules(employeeId);
  const createSchedule = useCreateWorkSchedule();
  const updateSchedule = useUpdateWorkSchedule();
  const deleteSchedule = useDeleteWorkSchedule();
  const createAbsence = useCreateAbsence();
  const updateAbsence = useUpdateAbsence();
  const deleteAbsence = useDeleteAbsence();

  const schedules = data?.work_schedules ?? [];
  const absences = data?.absences ?? [];

  const hasSchedule = schedules.length > 0;

  // Карта: день → расписание
  const dayScheduleMap = React.useMemo(() => {
    const map = new Map<number, WorkSchedule>();
    for (const s of schedules) {
      for (const d of s.days) map.set(d, s);
    }
    return map;
  }, [schedules]);

  const openNewSchedule = React.useCallback(() => {
    setEditingSchedule(null);
    setSelectedDays([]);
    setStartTime('09:00');
    setEndTime('18:00');
    setScheduleFormOpen(true);
  }, []);

  const openEditSchedule = React.useCallback((schedule: WorkSchedule) => {
    setEditingSchedule(schedule);
    // Ставим ВСЕ рабочие дни из всего графика сотрудника
    const allWorkingDays = new Set<string>();
    for (const s of schedules) {
      for (const d of s.days) allWorkingDays.add(String(d));
    }
    setSelectedDays(Array.from(allWorkingDays));
    setStartTime(formatTime(schedule.start_time));
    setEndTime(formatTime(schedule.end_time));
    setScheduleFormOpen(true);
  }, [schedules]);

  const submitSchedule = React.useCallback(() => {
    const days = selectedDays.map(Number);
    if (days.length === 0) return;

    if (editingSchedule) {
      const payload: WorkScheduleUpdatePayload = {
        id: editingSchedule.id,
        days,
        start_time: toApiTime(startTime),
        end_time: toApiTime(endTime),
      };
      updateSchedule.mutate(payload, { onSuccess: () => setScheduleFormOpen(false) });
    } else {
      const payload: WorkScheduleCreatePayload = {
        employee_id: employeeId,
        days,
        start_time: toApiTime(startTime),
        end_time: toApiTime(endTime),
      };
      createSchedule.mutate(payload, { onSuccess: () => setScheduleFormOpen(false) });
    }
  }, [selectedDays, startTime, endTime, employeeId, editingSchedule, createSchedule, updateSchedule]);

  const submitAbsence = React.useCallback(() => {
    if (editingAbsence) {
      updateAbsence.mutate(
        { id: editingAbsence.id, start_date: startDate, end_date: endDate, absence_type: absenceType, reason: reason || null },
        { onSuccess: () => setAbsenceFormOpen(false) },
      );
    } else {
      createAbsence.mutate(
        { employee_id: employeeId, start_date: startDate, end_date: endDate, absence_type: absenceType, reason: reason || null },
        { onSuccess: () => setAbsenceFormOpen(false) },
      );
    }
  }, [startDate, endDate, absenceType, reason, employeeId, editingAbsence, createAbsence, updateAbsence]);

  if (isLoading) return <Skeleton height={200} radius="md" />;

  return (
    <Stack gap="lg">
      {/* Недельный график */}
      <div>
        <div className={styles.toolbar}>
          <Text fw={600}>Недельный график</Text>
          {hasSchedule ? (
            <Button size="xs" variant="light" leftSection={<PencilSimple size={14} />} onClick={() => openEditSchedule(schedules[0])}>
              Редактировать
            </Button>
          ) : (
            <Button size="xs" variant="light" leftSection={<Plus size={14} />} onClick={openNewSchedule}>
              Добавить
            </Button>
          )}
        </div>
        {hasSchedule ? (
          <SimpleGrid cols={{ base: 4, xs: 7 }} spacing="xs">
            {ALL_DAYS.map((dayNum) => {
              const schedule = dayScheduleMap.get(dayNum);
              return (
                <div
                  key={dayNum}
                  className={`${scheduleStyles.dayCard} ${schedule ? scheduleStyles.dayCardActive : scheduleStyles.dayCardInactive}`}
                >
                  <Text size="xs" fw={700} className={scheduleStyles.dayLabel}>
                    {DAY_OF_WEEK_LABELS[dayNum]}
                  </Text>
                  {schedule ? (
                    <Text size="xs" className={scheduleStyles.dayTime}>
                      {formatTime(schedule.start_time)}–{formatTime(schedule.end_time)}
                    </Text>
                  ) : (
                    <Text size="xs" c="dimmed">Вых.</Text>
                  )}
                </div>
              );
            })}
          </SimpleGrid>
        ) : (
          <Text size="sm" c="dimmed">График не задан</Text>
        )}
      </div>

      {/* Отсутствия */}
      <div>
        <div className={styles.toolbar}>
          <Text fw={600}>Отсутствия</Text>
          <Button size="xs" variant="light" leftSection={<Plus size={14} />} onClick={() => { setEditingAbsence(null); setAbsenceFormOpen(true); }}>
            Добавить
          </Button>
        </div>
        <DataTable
          compact
          stickyHeader={false}
          maxHeight={300}
          columns={[
            { key: 'type', label: 'Тип' },
            { key: 'period', label: 'Период' },
            { key: 'reason', label: 'Причина' },
            { key: 'actions', label: '', width: 48 },
          ]}
          isEmpty={absences.length === 0}
          emptyMessage="Отсутствий нет"
        >
          {absences.map((absence) => (
            <DataTableRow key={absence.id}>
              <Table.Td><Badge variant="light" size="sm">{ABSENCE_TYPE_LABELS[absence.absence_type]}</Badge></Table.Td>
              <Table.Td>{formatDate(absence.start_date)} — {formatDate(absence.end_date)}</Table.Td>
              <Table.Td><Text size="sm" c="dimmed" lineClamp={1}>{absence.reason ?? '—'}</Text></Table.Td>
              <Table.Td>
                <Menu shadow="sm" width={160} radius="md">
                  <Menu.Target><ActionIcon variant="subtle" color="gray" size="sm"><DotsThree size={16} weight="bold" /></ActionIcon></Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item leftSection={<PencilSimple size={14} />} onClick={() => { setEditingAbsence(absence); setStartDate(absence.start_date); setEndDate(absence.end_date); setAbsenceType(absence.absence_type); setReason(absence.reason ?? ''); setAbsenceFormOpen(true); }}>Редактировать</Menu.Item>
                    <Menu.Item leftSection={<Trash size={14} />} color="red" onClick={() => setDeleteAbsenceTarget(absence)}>Удалить</Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Table.Td>
            </DataTableRow>
          ))}
        </DataTable>
      </div>

      {/* Модалка смены */}
      <Modal
        opened={scheduleFormOpen}
        onClose={() => setScheduleFormOpen(false)}
        title={editingSchedule ? 'Редактировать график' : 'Новый график'}
        radius="md"
        size="md"
      >
        <Text size="sm" fw={500} mb={6}>Дни недели</Text>
        <Chip.Group multiple value={selectedDays} onChange={setSelectedDays}>
          <Group gap="xs" mb="md">
            {DAY_OF_WEEK_OPTIONS.map((opt) => (
              <Chip key={opt.value} value={opt.value} radius="md" size="sm">{opt.label}</Chip>
            ))}
          </Group>
        </Chip.Group>
        <Group grow mb="lg">
          <TextInput label="Начало" type="time" value={startTime} onChange={(e) => setStartTime(e.currentTarget.value)} />
          <TextInput label="Конец" type="time" value={endTime} onChange={(e) => setEndTime(e.currentTarget.value)} />
        </Group>
        {editingSchedule && (
          <>
            <Text size="sm" fw={600} mb="xs">История изменений</Text>
            <AuditLogsPanel tableName="employee_work_schedules" recordId={editingSchedule.id} />
          </>
        )}
        <Group justify="flex-end" mt="md">
          <Button variant="subtle" color="gray" onClick={() => setScheduleFormOpen(false)}>Отмена</Button>
          {editingSchedule && (
            <Button variant="light" color="red" onClick={() => { setScheduleFormOpen(false); setDeleteScheduleTarget(editingSchedule); }}>
              Удалить
            </Button>
          )}
          <Button onClick={submitSchedule} loading={createSchedule.isPending || updateSchedule.isPending} disabled={selectedDays.length === 0}>
            Сохранить
          </Button>
        </Group>
      </Modal>

      {/* Модалка отсутствия */}
      <Modal opened={absenceFormOpen} onClose={() => setAbsenceFormOpen(false)} title={editingAbsence ? 'Редактировать отсутствие' : 'Новое отсутствие'} radius="md">
        <Select label="Тип" data={ABSENCE_TYPE_OPTIONS} mb="md" value={absenceType} onChange={(v) => setAbsenceType((v as AbsenceType) ?? 'vacation')} />
        <Group grow mb="md">
          <TextInput label="С" type="date" value={startDate} onChange={(e) => setStartDate(e.currentTarget.value)} />
          <TextInput label="По" type="date" value={endDate} onChange={(e) => setEndDate(e.currentTarget.value)} />
        </Group>
        <TextInput label="Причина" mb="lg" value={reason} onChange={(e) => setReason(e.currentTarget.value)} />
        {editingAbsence && (
          <>
            <Text size="sm" fw={600} mb="xs">История изменений</Text>
            <AuditLogsPanel tableName="employee_absences" recordId={editingAbsence.id} />
          </>
        )}
        <Group justify="flex-end" mt="md">
          <Button variant="subtle" color="gray" onClick={() => setAbsenceFormOpen(false)}>Отмена</Button>
          <Button onClick={submitAbsence} loading={createAbsence.isPending || updateAbsence.isPending}>Сохранить</Button>
        </Group>
      </Modal>

      <ConfirmModal opened={Boolean(deleteScheduleTarget)} title="Удалить смену" message="Удалить эту смену?" loading={deleteSchedule.isPending} onConfirm={() => deleteScheduleTarget && deleteSchedule.mutate(deleteScheduleTarget.id, { onSuccess: () => setDeleteScheduleTarget(null) })} onClose={() => setDeleteScheduleTarget(null)} />
      <ConfirmModal opened={Boolean(deleteAbsenceTarget)} title="Удалить отсутствие" message="Удалить это отсутствие?" loading={deleteAbsence.isPending} onConfirm={() => deleteAbsenceTarget && deleteAbsence.mutate(deleteAbsenceTarget.id, { onSuccess: () => setDeleteAbsenceTarget(null) })} onClose={() => setDeleteAbsenceTarget(null)} />
    </Stack>
  );
};
