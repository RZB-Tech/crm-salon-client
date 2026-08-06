import React from 'react';
import { Badge, NumberInput, Select, Stack } from '@mantine/core';
import { StackIcon } from '@phosphor-icons/react';
import { useUpdateMaterialQuantity } from '@/shared/api/hooks/useMaterials';
import type { Material } from '@/shared/api/types';
import { MEASUREMENT_UNIT_LABELS } from '@/shared/lib/format';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { FormModal, FormModalFooter, FormSection } from '@/shared/ui';

const OPERATION_OPTIONS = [
  { value: '1', label: 'Приход' },
  { value: '-1', label: 'Расход' }
];

interface QuantityModalProps {
  material: Material | null;
  onClose: () => void;
}

export const QuantityModal: React.FC<QuantityModalProps> = ({ material, onClose }) => {
  const [value, setValue] = React.useState(1);
  const [operation, setOperation] = React.useState<'1' | '-1'>('1');
  const updateQuantity = useUpdateMaterialQuantity();

  useResetOnOpen(material, () => {
    setValue(1);
    setOperation('1');
  });

  const handleSubmit = React.useCallback(() => {
    if (!material) return;
    updateQuantity.mutate(
      { id: material.id, operation: Number(operation) as 1 | -1, quantity: value },
      { onSuccess: onClose }
    );
  }, [material, operation, value, updateQuantity, onClose]);

  const unitLabel = material ? MEASUREMENT_UNIT_LABELS[material.measurement_unit] : '';
  const nextQuantity = (material?.quantity ?? 0) + Number(operation) * value;

  return (
    <FormModal
      opened={Boolean(material)}
      onClose={onClose}
      title='Изменить количество'
      subtitle={material?.name}
      icon={<StackIcon size={22} />}
      headerAside={
        material ? (
          <Badge variant='light' color='sage' size='lg' radius='sm'>
            {material.quantity} {unitLabel}
          </Badge>
        ) : undefined
      }
      size='md'
      footer={
        <FormModalFooter
          metaLabel='Остаток после операции'
          metaValue={`${nextQuantity} ${unitLabel}`}
          onCancel={onClose}
          submitLabel='Применить'
          onSubmit={handleSubmit}
          loading={updateQuantity.isPending}
        />
      }
    >
      <FormSection title='Операция'>
        <Stack gap='sm'>
          <Select
            label='Тип операции'
            data={OPERATION_OPTIONS}
            value={operation}
            onChange={(v) => setOperation((v as '1' | '-1') ?? '1')}
          />
          <NumberInput
            label='Количество'
            min={1}
            value={value}
            onChange={(v) => setValue(Number(v) || 1)}
            suffix={unitLabel ? ` ${unitLabel}` : undefined}
          />
        </Stack>
      </FormSection>
    </FormModal>
  );
};
