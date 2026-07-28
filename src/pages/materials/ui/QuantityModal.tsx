import React from 'react';
import { Button, Group, Modal, NumberInput, Select } from '@mantine/core';
import { useUpdateMaterialQuantity } from '@/shared/api/hooks/useMaterials';
import type { Material } from '@/shared/api/types';

interface QuantityModalProps {
  material: Material | null;
  onClose: () => void;
}

export const QuantityModal: React.FC<QuantityModalProps> = ({ material, onClose }) => {
  const [value, setValue] = React.useState(1);
  const [operation, setOperation] = React.useState<'1' | '-1'>('1');
  const updateQuantity = useUpdateMaterialQuantity();

  React.useEffect(() => {
    if (material) { setValue(1); setOperation('1'); }
  }, [material]);

  const handleSubmit = React.useCallback(() => {
    if (!material) return;
    updateQuantity.mutate({ id: material.id, operation: Number(operation) as 1 | -1, quantity: value }, { onSuccess: onClose });
  }, [material, operation, value, updateQuantity, onClose]);

  return (
    <Modal opened={Boolean(material)} onClose={onClose} title="Изменить количество" radius="md">
      <Select label="Операция" mb="md" data={[{ value: '1', label: 'Приход' }, { value: '-1', label: 'Расход' }]} value={operation} onChange={(v) => setOperation((v as '1' | '-1') ?? '1')} />
      <NumberInput label="Количество" min={1} mb="lg" value={value} onChange={(v) => setValue(Number(v) || 1)} />
      <Group justify="flex-end">
        <Button variant="subtle" color="gray" onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} loading={updateQuantity.isPending}>Применить</Button>
      </Group>
    </Modal>
  );
};
