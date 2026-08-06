import React from 'react';
import { NumberInput, Select, TextInput } from '@mantine/core';
import { ScissorsIcon } from '@phosphor-icons/react';
import { useCreateService, useUpdateService } from '@/shared/api/hooks/useServices';
import type {
  Service,
  ServiceCategory,
  ServiceCreatePayload,
  ServiceUpdatePayload
} from '@/shared/api/types';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import { FormFieldGrid, FormModal, FormModalFooter, FormSection } from '@/shared/ui';
import { formatPrice } from '@/shared/lib/format';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';

interface ServiceFormModalProps {
  opened: boolean;
  service: Service | null;
  categories: ServiceCategory[];
  onClose: () => void;
}

export const ServiceFormModal: React.FC<ServiceFormModalProps> = ({
  opened,
  service,
  categories,
  onClose
}) => {
  const [name, setName] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [estimatedTime, setEstimatedTime] = React.useState(0);
  const [categoryId, setCategoryId] = React.useState<string | null>(null);

  const createService = useCreateService();
  const updateService = useUpdateService();

  useResetOnOpen(opened, () => {
    setName(service?.name ?? '');
    setPrice(service?.price ?? 0);
    setEstimatedTime(service?.estimated_time ?? 0);
    setCategoryId(service?.category_id != null ? String(service.category_id) : null);
  });

  const categoryOptions = React.useMemo(
    () => categories.map((c) => ({ value: String(c.id), label: c.name })),
    [categories]
  );

  const handleSubmit = React.useCallback(() => {
    if (service) {
      const payload: ServiceUpdatePayload = {
        id: service.id,
        name,
        price: price > 0 ? price : undefined,
        category_id: categoryId ? Number(categoryId) : null,
        estimated_time: estimatedTime > 0 ? estimatedTime : null
      };
      updateService.mutate(payload, { onSuccess: onClose });
      return;
    }

    const payload: ServiceCreatePayload = {
      name,
      category_id: categoryId ? Number(categoryId) : null,
      estimated_time: estimatedTime > 0 ? estimatedTime : null
    };
    createService.mutate(payload, {
      onSuccess: (created) => {
        if (price > 0) {
          updateService.mutate({ id: created.id, price }, { onSuccess: onClose });
          return;
        }
        onClose();
      }
    });
  }, [name, price, estimatedTime, categoryId, service, createService, updateService, onClose]);

  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title={service ? 'Редактировать услугу' : 'Новая услуга'}
      subtitle='Название, цена и длительность'
      icon={<ScissorsIcon size={22} />}
      size='lg'
      footer={
        <FormModalFooter
          metaLabel='Цена'
          metaValue={formatPrice(price)}
          onCancel={onClose}
          submitLabel={service ? 'Сохранить' : 'Создать'}
          onSubmit={handleSubmit}
          submitDisabled={!name}
          loading={createService.isPending || updateService.isPending}
        />
      }
    >
      <FormSection title='Основное'>
        <FormFieldGrid>
          <TextInput
            label='Название'
            required
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
          <Select
            label='Категория'
            data={categoryOptions}
            clearable
            value={categoryId}
            onChange={setCategoryId}
          />
        </FormFieldGrid>
      </FormSection>

      <FormSection title='Цена и время'>
        <FormFieldGrid>
          <NumberInput
            label='Цена'
            min={0}
            value={price}
            onChange={(v) => setPrice(Number(v) || 0)}
            thousandSeparator=' '
            suffix=' сум'
          />
          <NumberInput
            label='Длительность'
            min={0}
            step={5}
            value={estimatedTime}
            onChange={(v) => setEstimatedTime(Number(v) || 0)}
            suffix=' мин'
          />
        </FormFieldGrid>
      </FormSection>

      {service && (
        <FormSection title='История изменений' muted>
          <AuditLogsPanel tableName='services' recordId={service.id} />
        </FormSection>
      )}
    </FormModal>
  );
};
