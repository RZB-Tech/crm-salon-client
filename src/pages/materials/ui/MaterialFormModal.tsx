import React from 'react';
import { Button, Group, Modal, NumberInput, Select, Text, Textarea, TextInput } from '@mantine/core';
import { useCreateMaterial, useUpdateMaterial } from '@/shared/api/hooks/useMaterials';
import type { Material, MaterialCreatePayload, MaterialUpdatePayload, MeasurementUnit } from '@/shared/api/types';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import { MEASUREMENT_UNIT_LABELS } from '@/shared/lib/format';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';

const MEASUREMENT_OPTIONS = Object.entries(MEASUREMENT_UNIT_LABELS).map(([value, label]) => ({ value, label }));

interface MaterialFormState {
  article: string;
  name: string;
  description: string;
  quantity: number;
  measurement_unit: MeasurementUnit;
  volume: number;
  sell_price: number;
}

const emptyForm = (): MaterialFormState => ({ article: '', name: '', description: '', quantity: 0, measurement_unit: 'piece', volume: 0, sell_price: 0 });

const materialToForm = (m: Material): MaterialFormState => ({
  article: m.article, name: m.name, description: m.description ?? '', quantity: m.quantity, measurement_unit: m.measurement_unit, volume: m.volume, sell_price: m.sell_price,
});

interface MaterialFormModalProps {
  opened: boolean;
  material: Material | null;
  onClose: () => void;
}

export const MaterialFormModal: React.FC<MaterialFormModalProps> = ({ opened, material, onClose }) => {
  const [form, setForm] = React.useState<MaterialFormState>(emptyForm);
  const createMaterial = useCreateMaterial();
  const updateMaterial = useUpdateMaterial();

  useResetOnOpen(opened, () => setForm(material ? materialToForm(material) : emptyForm()));

  const handleSubmit = React.useCallback(() => {
    if (material) {
      const payload: MaterialUpdatePayload = { id: material.id, article: form.article, name: form.name, description: form.description || null, measurement_unit: form.measurement_unit, volume: form.volume, sell_price: form.sell_price };
      updateMaterial.mutate(payload, { onSuccess: onClose });
      return;
    }
    const payload: MaterialCreatePayload = { article: form.article, name: form.name, description: form.description || null, quantity: form.quantity, measurement_unit: form.measurement_unit, volume: form.volume, sell_price: form.sell_price };
    createMaterial.mutate(payload, { onSuccess: onClose });
  }, [material, form, createMaterial, updateMaterial, onClose]);

  return (
    <Modal opened={opened} onClose={onClose} title={material ? 'Редактировать материал' : 'Новый материал'} radius="md" size="lg">
      <Group grow mb="md">
        <TextInput label="Артикул" required value={form.article} onChange={(e) => setForm({ ...form, article: e.currentTarget.value })} />
        <TextInput label="Название" required value={form.name} onChange={(e) => setForm({ ...form, name: e.currentTarget.value })} />
      </Group>
      <Textarea label="Описание" mb="md" value={form.description} onChange={(e) => setForm({ ...form, description: e.currentTarget.value })} />
      <Group grow mb="md">
        {!material && <NumberInput label="Начальное количество" min={0} value={form.quantity} onChange={(v) => setForm({ ...form, quantity: Number(v) || 0 })} />}
        <Select label="Единица измерения" data={MEASUREMENT_OPTIONS} value={form.measurement_unit} onChange={(v) => setForm({ ...form, measurement_unit: (v as MeasurementUnit) ?? 'piece' })} />
        <NumberInput label="Объём" min={0} value={form.volume} onChange={(v) => setForm({ ...form, volume: Number(v) || 0 })} />
      </Group>
      <Group grow mb="md">
        <NumberInput label="Цена продажи" min={0} value={form.sell_price} onChange={(v) => setForm({ ...form, sell_price: Number(v) || 0 })} />
      </Group>
      {material && (
        <>
          <Text size="sm" fw={600} mb="xs">История изменений</Text>
          <AuditLogsPanel tableName="materials" recordId={material.id} />
        </>
      )}
      <Group justify="flex-end" mt={material ? 'md' : undefined}>
        <Button variant="subtle" color="gray" onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} loading={createMaterial.isPending || updateMaterial.isPending} disabled={!form.article || !form.name}>{material ? 'Сохранить' : 'Создать'}</Button>
      </Group>
    </Modal>
  );
};
