import React from 'react';
import { Box, Button, Group, Text } from '@mantine/core';
import { PlusIcon } from '@phosphor-icons/react';
import {
  useCreateSpecialization,
  useArchiveSpecialization,
  useSpecializations,
  useUpdateSpecialization,
} from '@/shared/api/hooks/useSpecializations';
import type { Specialization } from '@/shared/api/types';
import { ConfirmModal } from '@/shared/ui';
import { useResolvedById } from '@/shared/lib/hooks/useResolvedById';
import { SpecializationFormModal } from './SpecializationFormModal';
import { SpecializationsTable } from './SpecializationsTable';

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
        <SpecializationsTable items={list} onEdit={openEdit} onArchive={setArchiveTargetId} />
      </Box>

      <SpecializationFormModal
        opened={formOpen}
        editing={editing}
        name={name}
        loading={createSpec.isPending || updateSpec.isPending}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        onNameChange={setName}
      />

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
