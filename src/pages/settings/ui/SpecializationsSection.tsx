import React from 'react';
import { ActionIcon, Box, Button, Group, Text } from '@mantine/core';
import { ArchiveIcon, PlusIcon } from '@phosphor-icons/react';
import {
  useCreateSpecialization,
  useArchiveSpecialization,
  useSpecializations,
  useUpdateSpecialization,
} from '@/shared/api/hooks/useSpecializations';
import type { Specialization } from '@/shared/api/types';
import { ConfirmModal, ListCardField, ListEntityCard } from '@/shared/ui';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { useI18n } from '@/shared/lib/i18n';
import { useResolvedById } from '@/shared/lib/hooks/useResolvedById';
import { SpecializationFormModal } from './SpecializationFormModal';
import { SpecializationsTable } from './SpecializationsTable';
import styles from './settings-page.module.css';

export const SpecializationsSection: React.FC = () => {
  const { t } = useI18n();
  const isMobile = useIsMobile();
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
  const list = specializations ?? [];

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

  return (
    <>
      {isMobile ? (
        <Box className={styles.specList}>
          <Text fw={600} size="lg" c="#484848">
            {t('settings.specializations')}
          </Text>
          <Button
            className={styles.addBtn}
            size="md"
            variant="light"
            color="sage"
            rightSection={<PlusIcon size={20} />}
            onClick={openCreate}
          >
            {t('common.add')}
          </Button>
          {list.length === 0 ? (
            <Text size="sm" c="dimmed" ta="center" py="md">
              {t('settings.empty')}
            </Text>
          ) : (
            list.map((spec) => (
              <ListEntityCard key={spec.id} onClick={() => openEdit(spec)}>
                <Group justify="space-between" wrap="nowrap">
                  <ListCardField label={t('common.name')} value={spec.name} />
                  <ActionIcon
                    variant="subtle"
                    color="orange"
                    aria-label={t('common.archive')}
                    onClick={(event) => {
                      event.stopPropagation();
                      setArchiveTargetId(spec.id);
                    }}
                  >
                    <ArchiveIcon size={18} />
                  </ActionIcon>
                </Group>
              </ListEntityCard>
            ))
          )}
        </Box>
      ) : (
        <>
          <Group justify="space-between" mb="md">
            <Text fw={600} size="sm" c="#484848">
              {t('settings.specializations')}
            </Text>
            <Button
              size="xs"
              variant="light"
              color="sage"
              rightSection={<PlusIcon size={14} />}
              onClick={openCreate}
            >
              {t('common.add')}
            </Button>
          </Group>
          <Box style={{ border: '1px solid var(--mantine-color-gray-2)', borderRadius: 8, overflow: 'hidden' }}>
            <SpecializationsTable items={list} onEdit={openEdit} onArchive={setArchiveTargetId} />
          </Box>
        </>
      )}

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
        title={t('settings.archiveTitle')}
        message={t('settings.archiveMessage', { name: archiveTarget?.name ?? '' })}
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
