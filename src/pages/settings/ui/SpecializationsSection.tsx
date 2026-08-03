import React from 'react';
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Modal,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import {
  ArchiveIcon,
  PlusIcon,
} from '@phosphor-icons/react';
import {
  useCreateSpecialization,
  useArchiveSpecialization,
  useSpecializations,
  useUpdateSpecialization,
} from '@/shared/api/hooks/useSpecializations';
import type { Specialization } from '@/shared/api/types';
import { ConfirmModal, listPageStyles } from '@/shared/ui';
import { useResolvedById } from '@/shared/lib/hooks/useResolvedById';

export const SpecializationsSection: React.FC = () => {
  const { data: specializations } = useSpecializations();
  const createSpec = useCreateSpecialization();
  const updateSpec = useUpdateSpecialization();
  const archiveSpec = useArchiveSpecialization();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [name, setName] = React.useState('');
  const [archiveTargetId, setArchiveTargetId] = React.useState<number | null>(null);

  const editing = useResolvedById(specializations, editingId);
  const archiveTarget = useResolvedById(specializations, archiveTargetId);

  const openCreate = React.useCallback(() => {
    setEditingId(null);
    setName('');
    setFormOpen(true);
  }, []);

  const openEdit = React.useCallback((spec: Specialization) => {
    setEditingId(spec.id);
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
      <Group justify="space-between" mb="md">
        <Text fw={600} size="sm" c="#484848">
          Специализации
        </Text>
        <Button
          size="xs"
          variant="light"
          color="sage"
          rightSection={<PlusIcon size={14} />}
          onClick={openCreate}
        >
          Добавить
        </Button>
      </Group>

      <Box style={{ border: '1px solid var(--mantine-color-gray-2)', borderRadius: 8, overflow: 'hidden' }}>
        <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className={listPageStyles.headCell}>Название</Table.Th>
              <Table.Th className={listPageStyles.headCell} w={48} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {list.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={2}>
                  <Text size="sm" c="dimmed" ta="center" py="xl">
                    Специализации не добавлены
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              list.map((spec) => (
                <Table.Tr
                  key={spec.id}
                  className={`${listPageStyles.row} ${listPageStyles.rowClickable}`}
                  onClick={() => openEdit(spec)}
                >
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Text size="sm" c="#484848">
                      {spec.name}
                    </Text>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <ActionIcon
                      variant="subtle"
                      color="orange"
                      size="sm"
                      aria-label="Архивировать"
                      onClick={(e) => {
                        e.stopPropagation();
                        setArchiveTargetId(spec.id);
                      }}
                    >
                      <ArchiveIcon size={18} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Box>

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
        opened={Boolean(archiveTarget)}
        title="Архивировать специализацию"
        message={`Архивировать «${archiveTarget?.name ?? ''}»?`}
        loading={archiveSpec.isPending}
        onConfirm={() =>
          archiveTarget &&
          archiveSpec.mutate(archiveTarget.id, { onSuccess: () => setArchiveTargetId(null) })
        }
        onClose={() => setArchiveTargetId(null)}
      />
    </>
  );
};
