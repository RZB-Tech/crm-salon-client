import React from 'react';
import { Button, Group, Modal, NumberInput, Select, Text, TextInput } from '@mantine/core';
import { useCreateService, useUpdateService } from '@/shared/api/hooks/useServices';
import type { Service, ServiceCategory, ServiceCreatePayload, ServiceUpdatePayload } from '@/shared/api/types';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';

interface ServiceFormModalProps {
  opened: boolean;
  service: Service | null;
  categories: ServiceCategory[];
  onClose: () => void;
}

export const ServiceFormModal: React.FC<ServiceFormModalProps> = ({ opened, service, categories, onClose }) => {
  const [name, setName] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [estimatedTime, setEstimatedTime] = React.useState(0);
  const [categoryId, setCategoryId] = React.useState<string | null>(null);

  const createService = useCreateService();
  const updateService = useUpdateService();

  React.useEffect(() => {
    if (!opened) return;
    setName(service?.name ?? '');
    setPrice(service?.price ?? 0);
    setEstimatedTime(service?.estimated_time ?? 0);
    setCategoryId(service?.category_id != null ? String(service.category_id) : null);
  }, [opened, service]);

  const categoryOptions = React.useMemo(
    () => categories.map((c) => ({ value: String(c.id), label: c.name })),
    [categories],
  );

  const handleSubmit = React.useCallback(() => {
    if (service) {
      const payload: ServiceUpdatePayload = {
        id: service.id,
        name,
        price: price > 0 ? price : undefined,
        category_id: categoryId ? Number(categoryId) : null,
        estimated_time: estimatedTime > 0 ? estimatedTime : null,
      };
      updateService.mutate(payload, { onSuccess: onClose });
      return;
    }

    const payload: ServiceCreatePayload = {
      name,
      category_id: categoryId ? Number(categoryId) : null,
      estimated_time: estimatedTime > 0 ? estimatedTime : null,
    };
    createService.mutate(payload, {
      onSuccess: (created) => {
        if (price > 0) {
          updateService.mutate({ id: created.id, price }, { onSuccess: onClose });
          return;
        }
        onClose();
      },
    });
  }, [name, price, estimatedTime, categoryId, service, createService, updateService, onClose]);

  return (
    <Modal opened={opened} onClose={onClose} title={service ? 'Редактировать услугу' : 'Новая услуга'} radius="md">
      <TextInput label="Название" required mb="md" value={name} onChange={(e) => setName(e.currentTarget.value)} />
      <NumberInput label="Цена" min={0} mb="md" value={price} onChange={(v) => setPrice(Number(v) || 0)} thousandSeparator=" " suffix=" сум" />
      <NumberInput label="Длительность (мин)" min={0} step={5} mb="md" value={estimatedTime} onChange={(v) => setEstimatedTime(Number(v) || 0)} suffix=" мин" />
      <Select label="Категория" data={categoryOptions} clearable mb="lg" value={categoryId} onChange={setCategoryId} />
      {service && (
        <>
          <Text size="sm" fw={600} mb="xs">История изменений</Text>
          <AuditLogsPanel tableName="services" recordId={service.id} />
        </>
      )}
      <Group justify="flex-end" mt={service ? 'md' : undefined}>
        <Button variant="subtle" color="gray" onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} loading={createService.isPending || updateService.isPending} disabled={!name}>
          {service ? 'Сохранить' : 'Создать'}
        </Button>
      </Group>
    </Modal>
  );
};
