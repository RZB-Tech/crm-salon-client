import React from 'react';
import {
  Group,
  Button,
  Table,
  Text,
  ActionIcon,
  Menu,
  Modal,
  Select,
  TextInput,
  Skeleton,
} from '@mantine/core';
import { Plus, DotsThree, PencilSimple, Trash } from '@phosphor-icons/react';
import { useEmployeeSchedules } from '@/shared/api/hooks/useEmployees';
import {
  useCreateSchedule,
  useDeleteSchedule,
  useUpdateSchedule,
} from '@/shared/api/hooks/useSchedules';
import type { CreateSchedulePayload, DayOfWeek, PatchedSchedule, Schedule } from '@/shared/api/types';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { DAY_OF_WEEK_LABELS, DAY_OF_WEEK_OPTIONS, formatTime } from '@/shared/lib/format';
import styles from '../employee-profile.module.css';

interface ScheduleTabProps {
  employeeId: number;
}

const toApiTime = (time: string): string => (time.length === 5 ? `${time}:00` : time);

export const ScheduleTab: React.FC<ScheduleTabProps> = ({ employeeId }) => {
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Schedule | null>(null);
  const [dayOfWeek, setDayOfWeek] = React.useState('0');
  const [startTime, setStartTime] = React.useState('09:00');
  const [endTime, setEndTime] = React.useState('18:00');
  const [deleteTarget, setDeleteTarget] = React.useState<Schedule | null>(null);

  const { data: schedules, isLoading } = useEmployeeSchedules(employeeId);
  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();
  const deleteSchedule = useDeleteSchedule();

  const openCreate = React.useCallback(() => {
    setEditing(null);
    setDayOfWeek('0');
    setStartTime('09:00');
    setEndTime('18:00');
    setFormOpen(true);
  }, []);

  const openEdit = React.useCallback((schedule: Schedule) => {
    setEditing(schedule);
    setDayOfWeek(String(schedule.dayOfWeek));
    setStartTime(formatTime(schedule.startTime));
    setEndTime(formatTime(schedule.endTime));
    setFormOpen(true);
  }, []);

  const submit = React.useCallback(() => {
    const payload: CreateSchedulePayload = {
      dayOfWeek: Number(dayOfWeek) as DayOfWeek,
      startTime: toApiTime(startTime),
      endTime: toApiTime(endTime),
      employee: employeeId,
    };
    if (editing) {
      updateSchedule.mutate(
        { id: editing.id, payload: payload as PatchedSchedule },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createSchedule.mutate(payload, { onSuccess: () => setFormOpen(false) });
    }
  }, [dayOfWeek, startTime, endTime, employeeId, editing, createSchedule, updateSchedule]);

  const sorted = React.useMemo(
    () => [...(schedules ?? [])].sort((a, b) => a.dayOfWeek - b.dayOfWeek),
    [schedules],
  );

  return (
    <div>
      <div className={styles.toolbar}>
        <Text fw={600}>Рабочие смены</Text>
        <Button size="sm" leftSection={<Plus size={15} />} onClick={openCreate}>
          Добавить смену
        </Button>
      </div>

      {isLoading ? (
        <Skeleton height={160} radius="md" />
      ) : (
        <Table highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>День</Table.Th>
              <Table.Th>Начало</Table.Th>
              <Table.Th>Конец</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sorted.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Text c="dimmed" ta="center" py="md">
                    Смены не заданы
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              sorted.map((schedule) => (
                <Table.Tr key={schedule.id}>
                  <Table.Td>{DAY_OF_WEEK_LABELS[schedule.dayOfWeek]}</Table.Td>
                  <Table.Td>{formatTime(schedule.startTime)}</Table.Td>
                  <Table.Td>{formatTime(schedule.endTime)}</Table.Td>
                  <Table.Td>
                    <Menu shadow="sm" width={160} radius="md">
                      <Menu.Target>
                        <ActionIcon variant="subtle" color="gray" size="sm">
                          <DotsThree size={16} weight="bold" />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<PencilSimple size={14} />} onClick={() => openEdit(schedule)}>
                          Редактировать
                        </Menu.Item>
                        <Menu.Item leftSection={<Trash size={14} />} color="red" onClick={() => setDeleteTarget(schedule)}>
                          Удалить
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      )}

      <Modal
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Редактировать смену' : 'Новая смена'}
        radius="md"
      >
        <Select label="День недели" required data={DAY_OF_WEEK_OPTIONS} mb="md" value={dayOfWeek} onChange={(v) => setDayOfWeek(v ?? '0')} />
        <Group grow mb="lg">
          <TextInput label="Начало" type="time" value={startTime} onChange={(e) => setStartTime(e.currentTarget.value)} />
          <TextInput label="Конец" type="time" value={endTime} onChange={(e) => setEndTime(e.currentTarget.value)} />
        </Group>
        <Group justify="flex-end">
          <Button variant="subtle" color="gray" onClick={() => setFormOpen(false)}>
            Отмена
          </Button>
          <Button onClick={submit} loading={createSchedule.isPending || updateSchedule.isPending}>
            Сохранить
          </Button>
        </Group>
      </Modal>

      <ConfirmModal
        opened={Boolean(deleteTarget)}
        title="Удалить смену"
        message="Удалить эту смену из графика?"
        loading={deleteSchedule.isPending}
        onConfirm={() => deleteTarget && deleteSchedule.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
