import React from 'react';
import { TextInput } from '@mantine/core';
import { FolderIcon } from '@phosphor-icons/react';
import { useCreateServiceCategory, useUpdateServiceCategory } from '@/shared/api/hooks/useServices';
import type {
  ServiceCategory,
  ServiceCategoryCreatePayload,
  ServiceCategoryUpdatePayload
} from '@/shared/api/types';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import { FormModal, FormModalFooter, FormSection } from '@/shared/ui';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';

interface CategoryFormModalProps {
  opened: boolean;
  category: ServiceCategory | null;
  onClose: () => void;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  opened,
  category,
  onClose
}) => {
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
    <FormModal
      opened={opened}
      onClose={onClose}
      title={category ? 'Редактировать категорию' : 'Новая категория'}
      subtitle='Группировка услуг в прайсе'
      icon={<FolderIcon size={22} />}
      size='md'
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel={category ? 'Сохранить' : 'Создать'}
          onSubmit={handleSubmit}
          submitDisabled={!name}
          loading={createCategory.isPending || updateCategory.isPending}
        />
      }
    >
      <FormSection title='Основное'>
        <TextInput
          label='Название'
          required
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
      </FormSection>

      {category && (
        <FormSection title='История изменений' muted>
          <AuditLogsPanel tableName='service_categories' recordId={category.id} />
        </FormSection>
      )}
    </FormModal>
  );
};
