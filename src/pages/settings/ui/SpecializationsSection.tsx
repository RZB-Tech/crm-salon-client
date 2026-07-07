import React from 'react';
import {
  ActionIcon,
  Button,
  Card,
  Group,
  Menu,
  Modal,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import { DotsThree, PencilSimple, Plus, Trash } from '@phosphor-icons/react';
import {
  useCreateSpecialization,
  useDeleteSpecialization,
  useSpecializations,
  useUpdateSpecialization,
} from '@/shared/api/hooks/useSpecializations';
import type { Specialization } from '@/shared/api/types';
import { ConfirmModal, DataTable, DataTableRow } from '@/shared/ui';

export const SpecializationsSection: React.FC = () => {
  const { data: specializations } = useSpecializations();
  const createSpec = useCreateSpecialization();
  const updateSpec = useUpdateSpecialization();
  const deleteSpec = useDeleteSpecialization();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Specialization | null>(null);
  const [name, setName] = React.useState('');
  const [deleteTarget, setDeleteTarget] = React.useState<Specialization | null>(null);

  const openCreate = React.useCallback(() => {
    setEditing(null);
    setName('');
    setFormOpen(true);
  }, []);

  const openEdit = React.useCallback((spec: Specialization) => {
    setEditing(spec);
    setName(spec.name);
    setFormOpen(true);
  }, []);

  const handleSubmit = React.useCallback(() => {
    if (editing) {
      updateSpec.mutate({ id: editing.id, name }, { onSuccess: () => setFormOpen(false) });
    } else {
      createSpec.mutate({ name }, { onSuccess: () => setFormOpen(false) });
    }
  }, [name, editing, createSpec, updateSpec]);

  const list = specializations ?? [];

  return (
    <>
      <Card padding="xl" radius="lg" shadow="xs">
        <Group justify="space-between" mb="md">
          <Text fw={600}>Специализации</Text>
          <Button size="xs" variant="light" leftSection={<Plus size={14} />} onClick={openCreate}>
            Добавить
          </Button>
        </Group>

        <DataTable
          columns={[
            { key: 'name', label: 'Название' },
            { key: 'actions', label: '', width: 48 },
          ]}
          isEmpty={list.length === 0}
          emptyMessage="Специализации не добавлены"
          compact
          stickyHeader={false}
        >
          {list.map((spec) => (
            <DataTableRow key={spec.id}>
              <Table.Td>
                <Text size="sm">{spec.name}</Text>
              </Table.Td>
              <Table.Td>
                <Menu shadow="sm" width={160} radius="md">
                  <Menu.Target>
                    <ActionIcon variant="subtle" color="gray" size="sm">
                      <DotsThree size={16} weight="bold" />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<PencilSimple size={14} />}
                      onClick={() => openEdit(spec)}
                    >
                      Редактировать
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<Trash size={14} />}
                      color="red"
                      onClick={() => setDeleteTarget(spec)}
                    >
                      Удалить
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Table.Td>
            </DataTableRow>
          ))}
        </DataTable>
      </Card>

      <Modal
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Редактировать специализацию' : 'Новая специализация'}
        radius="md"
      >
        <TextInput
          label="Название"
          required
          mb="lg"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
        <Group justify="flex-end">
          <Button variant="subtle" color="gray" onClick={() => setFormOpen(false)}>
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            loading={createSpec.isPending || updateSpec.isPending}
            disabled={!name}
          >
            {editing ? 'Сохранить' : 'Создать'}
          </Button>
        </Group>
      </Modal>

      <ConfirmModal
        opened={Boolean(deleteTarget)}
        title="Удалить специализацию"
        message={`Удалить «${deleteTarget?.name ?? ''}»?`}
        loading={deleteSpec.isPending}
        onConfirm={() =>
          deleteTarget &&
          deleteSpec.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
};
