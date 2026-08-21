import React from 'react';
import { Badge, NumberInput, Select, Stack } from '@mantine/core';
import { StackIcon } from '@phosphor-icons/react';
import { useUpdateMaterialQuantity } from '@/shared/api/hooks/useMaterials';
import type { Material } from '@/shared/api/types';
import { MEASUREMENT_UNIT_LABELS } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { FormModal, FormModalFooter } from '@/shared/ui';

interface QuantityModalProps {
  material: Material | null;
  onClose: () => void;
}

export const QuantityModal: React.FC<QuantityModalProps> = ({ material, onClose }) => {
  const { t } = useI18n();
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
  const operationOptions = [
    { value: '1', label: t('form.stockIn') },
    { value: '-1', label: t('form.stockOut') },
  ];

  return (
    <FormModal
      opened={Boolean(material)}
      onClose={onClose}
      title={t('form.changeQuantity')}
      subtitle={material?.name}
      icon={<StackIcon />}
      badges={
        material ? (
          <Badge variant='light' color='sage' radius='sm'>
            {material.quantity} {unitLabel}
          </Badge>
        ) : undefined
      }
      size={567}
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel={t('common.apply')}
          onSubmit={handleSubmit}
          loading={updateQuantity.isPending}
        />
      }
    >
      <Stack gap='sm'>
          <Select
            label={t('form.operationType')}
            required
            data={operationOptions}
            value={operation}
            onChange={(v) => setOperation((v as '1' | '-1') ?? '1')}
          />
          <NumberInput
            label={t('materials.quantity')}
            required
            min={1}
            value={value}
            onChange={(v) => setValue(Number(v) || 1)}
            suffix={unitLabel ? ` ${unitLabel}` : undefined}
          />
      </Stack>
    </FormModal>
  );
};
