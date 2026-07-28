import React from 'react';
import {
  Box,
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
  WorkScheduleDay,
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

interface DayTimeEntry {
  day: number;
  startTime: string;
  endTime: string;
}

const ALL_DAYS = [1, 2, 3, 4, 5, 6, 7] as const;

export const ScheduleTab: React.FC<ScheduleTabProps> = ({ employeeId }) => {
  const [scheduleFormOpen, setScheduleFormOpen] = React.useState(false);
  const [absenceFormOpen, setAbsenceFormOpen] = React.useState(false);
  const [editingAbsence, setEditingAbsence] = React.useState<Absence | null>(null);
  const [dayEntries, setDayEntries] = React.useState<DayTimeEntry[]>([]);
  const [startDate, setStartDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [absenceType, setAbsenceType] = React.useState<AbsenceType>('vacation');
  const [reason, setReason] = React.useState('');
  const [deleteAbsenceTarget, setDeleteAbsenceTarget] = React.useState<Absence | null>(null);

  const { data, isLoading } = useEmployeeWorkSchedules(employeeId);
  const createSchedule = useCreateWorkSchedule();
  const updateSchedule = useUpdateWorkSchedule();
  const deleteSchedule = useDeleteWorkSchedule();
  const createAbsence = useCreateAbsence();
  const updateAbsence = useUpdateAbsence();
  const deleteAbsence = useDeleteAbsence();

  const schedules: WorkScheduleDay[] = data?.work_schedules ?? [];
  const absences = data?.absences ?? [];

  const hasSchedule = schedules.length > 0;

  const dayScheduleMap = React.useMemo(() => {
    const map = new Map<number, WorkScheduleDay>();
    for (const s of schedules) map.set(s.day, s);
    return map;
  }, [schedules]);

  const openScheduleForm = React.useCallback(() => {
    const entries: DayTimeEntry[] = ALL_DAYS.map((day) => {
      const existing = dayScheduleMap.get(day);
      return {
        day,
        startTime: existing ? formatTime(existing.start_time) : '09:00',
        endTime: existing ? formatTime(existing.end_time) : '18:00',
      };
    });
    setDayEntries(entries.filter((e) => dayScheduleMap.has(e.day)));
    setScheduleFormOpen(true);
  }, [dayScheduleMap]);

  const openNewSchedule = React.useCallback(() => {
    setDayEntries([]);
    setScheduleFormOpen(true);
  }, []);

  const updateDayTime = React.useCallback((day: number, field: 'startTime' | 'endTime', value: string) => {
    setDayEntries((prev) =>
      prev.map((e) => (e.day === day ? { ...e, [field]: value } : e)),
    );
  }, []);

  const submitSchedule = React.useCallback(() => {
    if (dayEntries.length === 0) return;

    if (hasSchedule) {
      // Update existing schedule entries
      const payload: WorkScheduleUpdatePayload = {
        work_schedules: schedules
          .filter((s) => dayEntries.some((e) => e.day === s.day))
          .map((s) => {
            const entry = dayEntries.find((e) => e.day === s.day)!;
            return { id: s.id, start_time: toApiTime(entry.startTime), end_time: toApiTime(entry.endTime) };
          }),
      };

      // For new days that don't exist yet, we create
      const newDays = dayEntries.filter((e) => !dayScheduleMap.has(e.day));
      const removedDays = schedules.filter((s) => !dayEntries.some((e) => e.day === s.day));

      // Delete removed days
      for (const removed of removedDays) {
        deleteSchedule.mutate(removed.id);
      }

      if (payload.work_schedules.length > 0) {
        updateSchedule.mutate(payload, {
          onSuccess: () => {
            if (newDays.length > 0) {
              const createPayload: WorkScheduleCreatePayload = {
                employee_id: employeeId,
                work_schedules: newDays.map((e) => ({
                  day: e.day,
                  start_time: toApiTime(e.startTime),
                  end_time: toApiTime(e.endTime),
                })),
              };
              createSchedule.mutate(createPayload, { onSuccess: () => setScheduleFormOpen(false) });
            } else {
              setScheduleFormOpen(false);
            }
          },
        });
      } else if (newDays.length > 0) {
        const createPayload: WorkScheduleCreatePayload = {
          employee_id: employeeId,
          work_schedules: newDays.map((e) => ({
            day: e.day,
            start_time: toApiTime(e.startTime),
            end_time: toApiTime(e.endTime),
          })),
        };
        createSchedule.mutate(createPayload, { onSuccess: () => setScheduleFormOpen(false) });
      } else {
        setScheduleFormOpen(false);
      }
    } else {
      const payload: WorkScheduleCreatePayload = {
        employee_id: employeeId,
        work_schedules: dayEntries.map((e) => ({
          day: e.day,
          start_time: toApiTime(e.startTime),
          end_time: toApiTime(e.endTime),
        })),
      };
      createSchedule.mutate(payload, { onSuccess: () => setScheduleFormOpen(false) });
    }
  }, [dayEntries, hasSchedule, schedules, dayScheduleMap, employeeId, createSchedule, updateSchedule, deleteSchedule]);

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
      <Box>
        <Box className={styles.toolbar}>
          <Text fw={600}>Недельный график</Text>
          {hasSchedule ? (
            <Button size="xs" variant="light" leftSection={<PencilSimple size={14} />} onClick={openScheduleForm}>
              Редактировать
            </Button>
          ) : (
            <Button size="xs" variant="light" leftSection={<Plus size={14} />} onClick={openNewSchedule}>
              Добавить
            </Button>
          )}
        </Box>
        {hasSchedule ? (
          <SimpleGrid cols={{ base: 4, xs: 7 }} spacing="xs">
            {ALL_DAYS.map((dayNum) => {
              const schedule = dayScheduleMap.get(dayNum);
              return (
                <Box
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
                </Box>
              );
            })}
          </SimpleGrid>
        ) : (
          <Text size="sm" c="dimmed">График не задан</Text>
        )}
      </Box>

      {/* Отсутствия */}
      <Box>
        <Box className={styles.toolbar}>
          <Text fw={600}>Отсутствия</Text>
          <Button size="xs" variant="light" leftSection={<Plus size={14} />} onClick={() => { setEditingAbsence(null); setAbsenceFormOpen(true); }}>
            Добавить
          </Button>
        </Box>
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
      </Box>

      {/* Модалка графика */}
      <Modal
        opened={scheduleFormOpen}
        onClose={() => setScheduleFormOpen(false)}
        title={hasSchedule ? 'Редактировать график' : 'Новый график'}
        radius="md"
        size="lg"
      >
        <Text size="sm" fw={500} mb={6}>Выберите рабочие дни и задайте время</Text>
        <Chip.Group multiple value={dayEntries.map((e) => String(e.day))} onChange={(values) => {
          const newDays = values.map(Number);
          setDayEntries((prev) => {
            const kept = prev.filter((e) => newDays.includes(e.day));
            const added = newDays
              .filter((d) => !prev.some((e) => e.day === d))
              .map((d) => ({ day: d, startTime: '09:00', endTime: '18:00' }));
            return [...kept, ...added].sort((a, b) => a.day - b.day);
          });
        }}>
          <Group gap="xs" mb="md">
            {DAY_OF_WEEK_OPTIONS.map((opt) => (
              <Chip key={opt.value} value={opt.value} radius="md" size="sm">{opt.label}</Chip>
            ))}
          </Group>
        </Chip.Group>

        {dayEntries.length > 0 && (
          <Stack gap="xs" mb="lg">
            {dayEntries.map((entry) => (
              <Group key={entry.day} grow align="center">
                <Text size="sm" fw={500} className={scheduleStyles.dayName}>
                  {DAY_OF_WEEK_LABELS[entry.day]}
                </Text>
                <TextInput
                  type="time"
                  size="xs"
                  value={entry.startTime}
                  onChange={(e) => updateDayTime(entry.day, 'startTime', e.currentTarget.value)}
                />
                <Text size="xs" c="dimmed" ta="center">—</Text>
                <TextInput
                  type="time"
                  size="xs"
                  value={entry.endTime}
                  onChange={(e) => updateDayTime(entry.day, 'endTime', e.currentTarget.value)}
                />
              </Group>
            ))}
          </Stack>
        )}

        <Group justify="flex-end" mt="md">
          <Button variant="subtle" color="gray" onClick={() => setScheduleFormOpen(false)}>Отмена</Button>
          <Button
            onClick={submitSchedule}
            loading={createSchedule.isPending || updateSchedule.isPending}
            disabled={dayEntries.length === 0}
          >
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

      <ConfirmModal opened={Boolean(deleteAbsenceTarget)} title="Удалить отсутствие" message="Удалить это отсутствие?" loading={deleteAbsence.isPending} onConfirm={() => deleteAbsenceTarget && deleteAbsence.mutate(deleteAbsenceTarget.id, { onSuccess: () => setDeleteAbsenceTarget(null) })} onClose={() => setDeleteAbsenceTarget(null)} />
    </Stack>
  );
};
