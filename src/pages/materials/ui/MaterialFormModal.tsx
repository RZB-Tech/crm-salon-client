import React from 'react';
import { Badge, Button } from '@mantine/core';
import { PackageIcon } from '@phosphor-icons/react';
import { useCreateMaterial, useUpdateMaterial } from '@/shared/api/hooks/useMaterials';
import type { Material, MaterialCreatePayload, MaterialUpdatePayload } from '@/shared/api/types';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import { FormModal, FormModalFooter, FormSection } from '@/shared/ui';
import { formatPrice, MEASUREMENT_UNIT_LABELS } from '@/shared/lib/format';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { emptyMaterialForm, materialToForm, type MaterialFormState } from '../lib/materialForm';
import { MaterialFormFields } from './MaterialFormFields';

interface MaterialFormModalProps {
  opened: boolean;
  material: Material | null;
  onClose: () => void;
  onChangeQuantity?: (material: Material) => void;
}

export const MaterialFormModal: React.FC<MaterialFormModalProps> = ({
  opened,
  material,
  onClose,
  onChangeQuantity
}) => {
  const { hasPermission } = useAccess();
  const [form, setForm] = React.useState<MaterialFormState>(emptyMaterialForm);
  const createMaterial = useCreateMaterial();
  const updateMaterial = useUpdateMaterial();

  useResetOnOpen(opened, () => setForm(material ? materialToForm(material) : emptyMaterialForm()));

  const handleSubmit = React.useCallback(() => {
    if (material) {
      const payload: MaterialUpdatePayload = {
        id: material.id,
        article: form.article,
        name: form.name,
        description: form.description || null,
        measurement_unit: form.measurement_unit,
        volume: form.volume,
        sell_price: form.sell_price
      };
      updateMaterial.mutate(payload, { onSuccess: onClose });
      return;
    }
    const payload: MaterialCreatePayload = {
      article: form.article,
      name: form.name,
      description: form.description || null,
      quantity: form.quantity,
      measurement_unit: form.measurement_unit,
      volume: form.volume,
      sell_price: form.sell_price
    };
    createMaterial.mutate(payload, { onSuccess: onClose });
  }, [material, form, createMaterial, updateMaterial, onClose]);

  const canChangeQuantity =
    Boolean(material && onChangeQuantity) && hasPermission(PermissionCode.MATERIAL_UPDATE_QUANTITY);

  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title={material ? 'Редактировать материал' : 'Новый материал'}
      subtitle={material ? material.article : 'Карточка складской позиции'}
      icon={<PackageIcon size={22} />}
      headerAside={
        material ? (
          <Badge variant='light' color='sage' size='lg' radius='sm'>
            {material.quantity} {MEASUREMENT_UNIT_LABELS[material.measurement_unit]}
          </Badge>
        ) : undefined
      }
      size='lg'
      footer={
        <FormModalFooter
          metaLabel='Цена продажи'
          metaValue={formatPrice(form.sell_price)}
          onCancel={onClose}
          submitLabel={material ? 'Сохранить' : 'Создать'}
          onSubmit={handleSubmit}
          submitDisabled={!form.article || !form.name}
          loading={createMaterial.isPending || updateMaterial.isPending}
        >
          {canChangeQuantity && material && (
            <Button variant='light' size='sm' onClick={() => onChangeQuantity?.(material)}>
              Изменить количество
            </Button>
          )}
        </FormModalFooter>
      }
    >
      <MaterialFormFields form={form} isEdit={Boolean(material)} onChange={setForm} />

      {material && (
        <FormSection title='История изменений' muted>
          <AuditLogsPanel tableName='materials' recordId={material.id} />
        </FormSection>
      )}
    </FormModal>
  );
};
