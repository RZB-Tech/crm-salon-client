import React from 'react';
import { TextInput } from '@mantine/core';
import { FolderIcon } from '@phosphor-icons/react';
import { useCreateServiceCategory, useUpdateServiceCategory } from '@/shared/api/hooks/useServices';
import type {
  ServiceCategory,
  ServiceCategoryCreatePayload,
  ServiceCategoryUpdatePayload
} from '@/shared/api/types';
import { useI18n } from '@/shared/lib/i18n';
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
  const { t } = useI18n();
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
      title={category ? t('form.editCategory') : t('form.newCategory')}
      icon={<FolderIcon />}
      size={567}
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel={category ? t('common.save') : t('common.create')}
          onSubmit={handleSubmit}
          submitDisabled={!name}
          loading={createCategory.isPending || updateCategory.isPending}
        />
      }
    >
      <FormSection title={t('form.main')}>
        <TextInput
          label={t('common.name')}
          required
          placeholder={t('form.enterName')}
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
      </FormSection>

      {category && (
        <FormSection title={t('form.changeHistory')} muted>
          <AuditLogsPanel tableName='service_categories' recordId={category.id} />
        </FormSection>
      )}
    </FormModal>
  );
};
