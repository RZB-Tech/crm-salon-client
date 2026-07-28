import React from 'react';
import { Button, Group, Modal, Text, TextInput } from '@mantine/core';
import { useCreateServiceCategory, useUpdateServiceCategory } from '@/shared/api/hooks/useServices';
import type { ServiceCategory, ServiceCategoryCreatePayload, ServiceCategoryUpdatePayload } from '@/shared/api/types';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';

interface CategoryFormModalProps {
  opened: boolean;
  category: ServiceCategory | null;
  onClose: () => void;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ opened, category, onClose }) => {
  const [name, setName] = React.useState('');
  const createCategory = useCreateServiceCategory();
  const updateCategory = useUpdateServiceCategory();

  useResetOnOpen(opened, () => setName(category?.name ?? ''));

  const handleSubmit = React.useCallback(() => {
    if (category) {
      const payload: ServiceCategoryUpdatePayload = { id: category.id, name };
      updateCategory.mutate(payload, { onSuccess: onClose });
    } else {
      const payload: ServiceCategoryCreatePayload = { name };
      createCategory.mutate(payload, { onSuccess: onClose });
    }
  }, [name, category, createCategory, updateCategory, onClose]);

  return (
    <Modal opened={opened} onClose={onClose} title={category ? 'Редактировать категорию' : 'Новая категория'} radius="md">
      <TextInput label="Название" required mb="lg" value={name} onChange={(e) => setName(e.currentTarget.value)} />
      {category && (
        <>
          <Text size="sm" fw={600} mb="xs">История изменений</Text>
          <AuditLogsPanel tableName="service_categories" recordId={category.id} />
        </>
      )}
      <Group justify="flex-end" mt={category ? 'md' : undefined}>
        <Button variant="subtle" color="gray" onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} loading={createCategory.isPending || updateCategory.isPending} disabled={!name}>
          {category ? 'Сохранить' : 'Создать'}
        </Button>
      </Group>
    </Modal>
  );
};
